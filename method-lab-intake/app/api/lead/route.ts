import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/lib/schema';
import { createLeadInCRM } from '@/lib/crm';
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

    // Create in CRM
    await createLeadInCRM(validatedData);

    // Send notifications
    await Promise.all([
      sendInternalNotification(validatedData),
      sendLeadConfirmation(validatedData),
      sendSlackNotification(validatedData),
    ]);

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

