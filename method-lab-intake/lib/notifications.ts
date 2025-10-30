import { Resend } from 'resend';
import { LeadFormData } from './schema';

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendInternalNotification(data: LeadFormData) {
  const resend = getResendClient();
  if (!resend) return; // Skip if not configured
  
  const notifyEmails = process.env.NOTIFY_EMAILS?.split(',') || [];
  if (notifyEmails.length === 0) return;
  
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: notifyEmails,
    subject: `New lead — ${data.name} (${data.email})`,
    text: `
New Lead Received
=================

Name: ${data.name}
Email: ${data.email}
Startup URL: ${data.startup || 'N/A'}

Building:
${data.building}

Biggest Drag: ${data.drag}
Stage: ${data.stage}

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
          { type: 'mrkdwn', text: `*Building:*\n${data.building.substring(0, 100)}${data.building.length > 100 ? '...' : ''}` },
          { type: 'mrkdwn', text: `*Biggest Drag:* ${data.drag}\n*Stage:* ${data.stage}` },
        ],
      },
    ],
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

