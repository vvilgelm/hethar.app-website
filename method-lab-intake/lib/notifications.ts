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
    subject: `New lead — ${data.startup} (${data.email})`,
    text: `
New Lead Received
=================

Startup: ${data.startup}
Website: ${data.website || 'N/A'}
Email: ${data.email}

What's Working:
${data.working}

What's Not Working:
${data.notWorking}

90 Day Goal:
${data.goal}

Budget: ${data.budget}

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
    subject: 'got it — we\'ll be in touch',
    text: `hey there,

got your details for ${data.startup}.

we'll review and reach out within 10h if it's a fit.

— method lab
    `,
  });
}

export async function sendSlackNotification(data: LeadFormData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    text: `🚀 New Lead: ${data.startup}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Lead Received*\n\n*Startup:* ${data.startup}\n*Email:* ${data.email}\n*Budget OK:* ${data.budget}`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*What's Working:*\n${data.working.substring(0, 100)}${data.working.length > 100 ? '...' : ''}` },
          { type: 'mrkdwn', text: `*90 Day Goal:*\n${data.goal.substring(0, 100)}${data.goal.length > 100 ? '...' : ''}` },
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

