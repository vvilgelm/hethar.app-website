import Airtable from 'airtable';
import { LeadFormData } from './schema';

const USE_CRM = process.env.USE_CRM || 'airtable';

// Airtable
export async function createAirtableLead(data: LeadFormData) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'METHOD LAB Leads';
  
  console.log('Airtable config:', {
    hasApiKey: !!apiKey,
    baseId,
    tableName,
  });

  const base = new Airtable({ apiKey }).base(baseId!);
  const table = base(tableName);

  const record = await table.create({
    'Startup Name': data.startup,
    'What\'s Working': data.working,
    'What\'s Not Working': data.notWorking,
    '90 Day Goal': data.goal,
    'Email': data.email,
    'Website': data.website || '',
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
        company: data.startup,
        website: data.website,
        what_working: data.working,
        what_not_working: data.notWorking,
        goal_90d: data.goal,
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
  // For now, just log the data - we'll send via email instead
  console.log('Lead data received:', data);
  return { success: true, data };
}

