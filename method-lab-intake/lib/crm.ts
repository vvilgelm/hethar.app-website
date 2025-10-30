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
    'Name': data.name,
    'Email': data.email,
    'Startup URL': data.startup || '',
    'Building': data.building,
    'Biggest Drag': data.drag,
    'Stage': data.stage,
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
        firstname: data.name.split(' ')[0],
        lastname: data.name.split(' ').slice(1).join(' ') || data.name.split(' ')[0],
        email: data.email,
        website: data.startup,
        building: data.building,
        biggest_drag: data.drag,
        stage: data.stage,
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

