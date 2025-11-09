import { Resend } from 'resend';
import { LeadFormData } from './schema';

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendInternalNotification(data: LeadFormData) {
  console.log('📧 Starting email notification...');
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
  console.log('NOTIFY_EMAILS:', process.env.NOTIFY_EMAILS);
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  
  const resend = getResendClient();
  if (!resend) {
    console.error('❌ Resend client not initialized - missing API key');
    return;
  }
  
  const notifyEmails = process.env.NOTIFY_EMAILS?.split(',') || [];
  if (notifyEmails.length === 0) {
    console.error('❌ No notify emails configured');
    return;
  }
  
  console.log('📨 Sending email to:', notifyEmails);
  
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: notifyEmails,
    subject: `New lead — ${data.name} (${data.email})`,
    text: `
New Lead Received
=================

Name: ${data.name}
Email: ${data.email}
Startup: ${data.startup || 'N/A'}

Building:
${data.building}

Biggest Drag: ${data.drag}
What They've Tried: ${data.tried || 'N/A'}
Stage: ${data.stage}
Acquisition: ${data.acquisition || 'N/A'}
Blocker: ${data.blocker || 'N/A'}
Final Note: ${data.finalNote || 'N/A'}

---
JSON:
${JSON.stringify(data, null, 2)}
    `,
  });
}

export async function sendLeadConfirmation(data: LeadFormData) {
  const resend = getResendClient();
  if (!resend) return; // Skip if not configured
  
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: data.email,
    subject: 'got it',
    text: `hey ${data.name.split(' ')[0]},

got your submission.

we'll take a look and reach out if it makes sense to work together.

— method
    `,
  });
}

export async function sendSlackNotification(data: LeadFormData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    text: `🚀 New Lead: ${data.name}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Lead Received*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Startup:* ${data.startup || 'N/A'}`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Building:*\n${data.building}` },
          { type: 'mrkdwn', text: `*Stage:* ${data.stage}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Biggest Drag:* ${data.drag}\n*Acquisition:* ${data.acquisition || 'N/A'}\n*Final Note:* ${data.finalNote?.substring(0, 100) || 'N/A'}${data.finalNote && data.finalNote.length > 100 ? '...' : ''}`,
        },
      },
    ],
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

