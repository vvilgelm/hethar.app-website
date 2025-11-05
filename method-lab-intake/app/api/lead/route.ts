import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/lib/schema';
import { createLeadInCRM } from '@/lib/crm';
import { sendToGoogleSheets } from '@/lib/googlesheets';
import { sendInternalNotification, sendLeadConfirmation, sendSlackNotification } from '@/lib/notifications';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate
    const validatedData = leadSchema.parse(body);

    console.log('Form submission received:', {
      name: validatedData.name,
      email: validatedData.email,
      stage: validatedData.stage
    });

    // Send to Google Sheets (PRIMARY DATA STORAGE)
    try {
      await sendToGoogleSheets(validatedData);
      console.log('✅ Saved to Google Sheets');
    } catch (error) {
      console.error('❌ Google Sheets failed:', error);
      // Continue even if Google Sheets fails
    }

    // Send notifications
    try {
      await sendInternalNotification(validatedData);
      console.log('✅ Email notification sent');
    } catch (error) {
      console.error('❌ Email notification failed:', error);
    }

    try {
      await sendSlackNotification(validatedData);
      console.log('✅ Slack notification sent');
    } catch (error) {
      console.error('❌ Slack notification failed:', error);
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Error processing lead:', error);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

