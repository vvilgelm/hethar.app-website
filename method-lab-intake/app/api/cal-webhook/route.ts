import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract email from Cal.com webhook payload
    const email = body.payload?.email || body.payload?.responses?.email;
    
    if (!email) {
      return NextResponse.json({ error: 'No email in payload' }, { status: 400 });
    }

    // Update Airtable record
    if (process.env.USE_CRM === 'airtable' && process.env.AIRTABLE_API_KEY) {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
        process.env.AIRTABLE_BASE_ID!
      );
      const table = base(process.env.AIRTABLE_TABLE_NAME || 'Leads');

      // Find record by email
      const records = await table.select({
        filterByFormula: `{Email} = "${email}"`,
        maxRecords: 1,
      }).firstPage();

      if (records.length > 0) {
        await table.update(records[0].id, {
          'Booked?': true,
        });
      }
    }

    // TODO: Update HubSpot if using HubSpot

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Cal.com webhook:', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}

