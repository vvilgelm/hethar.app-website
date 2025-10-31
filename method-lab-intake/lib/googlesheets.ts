import { LeadFormData } from './schema';

export async function sendToGoogleSheets(data: LeadFormData) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('Google Sheets webhook URL not configured, skipping...');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets webhook error: ${response.statusText}`);
    }

    console.log('Successfully sent data to Google Sheets');
    return await response.json();
  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    throw error;
  }
}

