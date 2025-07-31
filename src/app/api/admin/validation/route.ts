import { NextRequest, NextResponse } from 'next/server';
import WebsiteValidationService from '../../../../../lib/website-validation-service';

export async function POST(request: NextRequest) {
  try {
    const { action, recordId } = await request.json();
    const validationService = new WebsiteValidationService();

    switch (action) {
      case 'validate-all':
        console.log('🔍 Validating all published articles...');
        const summary = await validationService.validateAllArticles();
        
        return NextResponse.json({
          success: true,
          message: `Validation complete: ${summary.live} live, ${summary.missing} missing, ${summary.errors} errors`,
          data: summary
        });

      case 'validate-single':
        if (!recordId) {
          return NextResponse.json({
            success: false,
            error: 'recordId is required for validate-single action'
          }, { status: 400 });
        }

        console.log(`🔍 Validating single article: ${recordId}`);
        const result = await validationService.validateSpecificArticle(recordId);
        
        return NextResponse.json({
          success: result.status !== 'Error',
          message: `Article validation: ${result.status}`,
          data: result
        });

      case 'get-stats':
        console.log('📊 Getting validation statistics...');
        const stats = await validationService.getValidationStats();
        
        return NextResponse.json({
          success: true,
          data: stats
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Valid actions: validate-all, validate-single, get-stats'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Error in validation API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const validationService = new WebsiteValidationService();
    const stats = await validationService.getValidationStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error getting validation stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}