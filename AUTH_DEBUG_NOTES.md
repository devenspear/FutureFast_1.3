# Admin Authentication Debugging Notes (Session: 2025-05-29)

## Objective:
Resolve 401 Unauthorized errors on the `/api/admin/news/submit` endpoint after a successful admin login. The system is intended to use an `HttpOnly` cookie named `auth-token`.

## Key Problem:
Despite successful login and the `auth-token` cookie ostensibly being set by `/api/auth/login`, subsequent authenticated requests to `/api/admin/news/submit` fail with a 401 "Authentication required" error.

## Core Components Involved:
*   **Login Page:** `src/app/admin/login/page.tsx`
*   **Login API:** `src/app/api/auth/login/route.ts` (sets `auth-token` cookie)
*   **Frontend API Utility:** `src/lib/api.ts` (contains `fetchWithAuth` using `credentials: 'include'`)
*   **News Submission API:** `src/app/api/admin/news/submit/route.ts` (reads `auth-token` cookie)
*   **Middleware:** `src/middleware.ts` (intercepts `/admin/*` routes for auth checks)
*   **Auth Utilities:** `src/lib/auth.ts` (contains `verifyAuthToken`)

## Summary of Findings & Actions Taken:
1.  **Cookie Mechanism:** Confirmed login API sets an `HttpOnly` `auth-token`. `fetchWithAuth` updated to rely on browser-sent cookies (`credentials: 'include'`) rather than manual `Authorization` headers.
2.  **News Submission API (`/api/admin/news/submit`):**
    *   Updated to use `cookies()` from `next/headers` to read the `auth-token`.
    *   Added diagnostic `console.log` statements.
3.  **Middleware (`src/middleware.ts`):**
    *   Identified as active for all `/admin/*` routes, performing its own auth check using `verifyAuthToken`.
    *   Vercel logs suggested middleware was often blocking requests to `/api/admin/news/submit` before the API route's own logging could execute.
    *   **Last Change Made:** Removed `/admin/news-submit` from the `PUBLIC_PATHS` array in `middleware.ts`. This was done to *force* all requests to `/api/admin/news/submit` through the middleware's authentication logic, aiming for clearer diagnostic logs from the middleware itself regarding token validation for this specific path.

## Current Status & Next Steps (If Resumed):
*   The immediate next step (now on hold) was to test the application with `/admin/news-submit` removed from `PUBLIC_PATHS`.
*   The goal was to observe Vercel logs from `src/middleware.ts` for requests to `/api/admin/news/submit` to see:
    *   If the `auth-token` cookie is correctly received and read by the middleware.
    *   The outcome of `verifyAuthToken(token)` within the middleware.
    *   Whether the middleware allows the request to proceed to the API route or redirects/blocks it.
*   This would help pinpoint if the issue lies in the middleware's cookie handling/validation, or if the cookie isn't being correctly sent/received at that stage, or if the problem is further downstream in the API route itself (if middleware allows passage).

## Lingering Questions:
*   Is the `auth-token` correctly read and validated by `middleware.ts` under the latest configuration?
*   If the middleware validates the token and passes the request, is `src/app/api/admin/news/submit/route.ts` then correctly reading and processing it? (Potential issues with `await cookies()` vs. synchronous `cookies()` or other logic).
*   Was the "Unexpected token '<'" error (HTML instead of JSON) on the login page a transient issue or indicative of a deeper problem with the `/api/auth/login` route under certain conditions?
