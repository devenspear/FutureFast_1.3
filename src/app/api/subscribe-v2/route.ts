/**
 * Dual-Submission Subscribe API
 *
 * POST /api/subscribe-v2
 *
 * Submits to both Deven CRM and MailerLite during transition period.
 * Controlled by environment variables:
 * - ENABLE_DEVEN_CRM_SUBMISSION (default: true)
 * - ENABLE_MAILERLITE_SUBMISSION (default: true)
 */

import { NextRequest, NextResponse } from 'next/server'

// Environment configuration
const DEVEN_CRM_API_URL = process.env.DEVEN_CRM_API_URL || 'https://crm.deven.network/api/v1/capture'
const DEVEN_CRM_API_KEY = process.env.DEVEN_CRM_API_KEY
const ENABLE_DEVEN_CRM = process.env.ENABLE_DEVEN_CRM_SUBMISSION !== 'false'
const ENABLE_MAILERLITE = process.env.ENABLE_MAILERLITE_SUBMISSION !== 'false'

// MailerLite configuration (from existing integration)
const MAILERLITE_FORM_URL = 'https://assets.mailerlite.com/jsonp/1595754/forms/157210520722605964/subscribe'

interface SubscribeRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  comment?: string
}

interface SubmissionResult {
  success: boolean
  error?: string
}

/**
 * Submit to Deven CRM capture API
 */
async function submitToDevenCRM(data: SubscribeRequest): Promise<SubmissionResult> {
  if (!DEVEN_CRM_API_KEY) {
    console.warn('[subscribe-v2] DEVEN_CRM_API_KEY not configured')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const response = await fetch(DEVEN_CRM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': DEVEN_CRM_API_KEY,
      },
      body: JSON.stringify({
        primaryEmail: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        primaryPhone: data.phone || null,
        metadata: {
          comment: data.comment || null,
          source_page: 'futurefast.ai',
          submitted_at: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[subscribe-v2] Deven CRM error:', response.status, errorBody)
      return { success: false, error: `CRM error: ${response.status}` }
    }

    const result = await response.json()
    console.log('[subscribe-v2] Deven CRM success:', result.isNew ? 'new contact' : 'existing contact')
    return { success: true }
  } catch (error) {
    console.error('[subscribe-v2] Deven CRM exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Submit to MailerLite form endpoint
 */
async function submitToMailerLite(data: SubscribeRequest): Promise<SubmissionResult> {
  try {
    // Build form data for MailerLite
    const formData = new FormData()
    formData.append('fields[name]', data.firstName)
    formData.append('fields[last_name]', data.lastName)
    formData.append('fields[email]', data.email)
    if (data.phone) {
      formData.append('fields[phone]', data.phone)
    }
    if (data.comment) {
      formData.append('fields[note]', data.comment)
    }
    formData.append('ml-submit', '1')
    formData.append('anticsrf', 'true')

    const response = await fetch(MAILERLITE_FORM_URL, {
      method: 'POST',
      body: formData,
    })

    // MailerLite returns 200 even for errors, check response
    if (!response.ok) {
      console.error('[subscribe-v2] MailerLite HTTP error:', response.status)
      return { success: false, error: `MailerLite error: ${response.status}` }
    }

    console.log('[subscribe-v2] MailerLite submission sent')
    return { success: true }
  } catch (error) {
    console.error('[subscribe-v2] MailerLite exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json()

    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Submit to both systems in parallel
    const submissions: Promise<SubmissionResult>[] = []

    if (ENABLE_DEVEN_CRM) {
      submissions.push(submitToDevenCRM(body))
    }

    if (ENABLE_MAILERLITE) {
      submissions.push(submitToMailerLite(body))
    }

    const results = await Promise.allSettled(submissions)

    // Check results
    const crmResult = ENABLE_DEVEN_CRM ? results[0] : null
    const mlResult = ENABLE_MAILERLITE ? results[ENABLE_DEVEN_CRM ? 1 : 0] : null

    const crmSuccess = crmResult?.status === 'fulfilled' && crmResult.value.success
    const mlSuccess = mlResult?.status === 'fulfilled' && mlResult.value.success

    // Log any discrepancies
    if (ENABLE_DEVEN_CRM && ENABLE_MAILERLITE && crmSuccess !== mlSuccess) {
      console.warn('[subscribe-v2] Submission discrepancy:', {
        devenCRM: crmSuccess,
        mailerlite: mlSuccess,
      })
    }

    // Consider success if at least one system accepted the submission
    const overallSuccess = crmSuccess || mlSuccess

    if (!overallSuccess) {
      console.error('[subscribe-v2] Both submissions failed')
      return NextResponse.json(
        { success: false, error: 'Subscription failed. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for a welcome email.',
      systems: {
        devenCRM: ENABLE_DEVEN_CRM ? crmSuccess : 'disabled',
        mailerlite: ENABLE_MAILERLITE ? mlSuccess : 'disabled',
      },
    })
  } catch (error) {
    console.error('[subscribe-v2] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
