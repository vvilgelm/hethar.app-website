import Airtable from 'airtable';
import { LeadFormData } from './schema';

const USE_CRM = process.env.USE_CRM || 'airtable';

// Airtable
export async function createAirtableLead(data: LeadFormData) {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID!
  );

  const table = base(process.env.AIRTABLE_TABLE_NAME || 'Leads');

  const record = await table.create({
    'Product Name': data.product_name,
    'Product URL': data.product_url || '',
    'Stage': data.stage,
    'Goals (90d)': data.goals.join(', '),
    'Channels': data.channels.join(', '),
    'Budget Band': data.budget_band,
    'Success Metric': data.success_metric,
    'Name': data.name,
    'Email': data.email,
    'Timezone': data.timezone,
    'Twitter': data.twitter_handle || '',
    'Source': 'Method Lab Site',
    'Booked?': false,
    'Created At': new Date().toISOString(),
  });

  return record;
}

// HubSpot
export async function createHubSpotLead(data: LeadFormData) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        email: data.email,
        firstname: data.name.split(' ')[0],
        lastname: data.name.split(' ').slice(1).join(' ') || '',
        company: data.product_name,
        website: data.product_url,
        product_stage: data.stage,
        goals_90d: data.goals.join(', '),
        channels: data.channels.join(', '),
        budget_band: data.budget_band,
        success_metric: data.success_metric,
        timezone: data.timezone,
        twitter: data.twitter_handle,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HubSpot API error: ${response.statusText}`);
  }

  return await response.json();
}

// Main CRM function
export async function createLeadInCRM(data: LeadFormData) {
  if (USE_CRM === 'hubspot') {
    return await createHubSpotLead(data);
  } else {
    return await createAirtableLead(data);
  }
}

