import { Resend } from 'resend';
import { LeadFormData } from './schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInternalNotification(data: LeadFormData) {
  const notifyEmails = process.env.NOTIFY_EMAILS?.split(',') || [];
  
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: notifyEmails,
    subject: `New lead — ${data.product_name} (${data.email})`,
    text: `
New Lead Received
=================

Product: ${data.product_name}
URL: ${data.product_url || 'N/A'}
Stage: ${data.stage}
Goals: ${data.goals.join(', ')}
Channels: ${data.channels.join(', ')}
Budget: ${data.budget_band}
Success Metric: ${data.success_metric}

Contact:
Name: ${data.name}
Email: ${data.email}
Timezone: ${data.timezone}
Twitter: ${data.twitter_handle || 'N/A'}

---
JSON:
${JSON.stringify(data, null, 2)}
    `,
  });
}

export async function sendLeadConfirmation(data: LeadFormData) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: data.email,
    subject: 'got it — let\'s talk',
    text: `hey ${data.name},

thanks for the details — that's exactly what we need to prep.
you can book a time on the page you're on now.
if anything shifts, hit reply.

— method lab
    `,
  });
}

export async function sendSlackNotification(data: LeadFormData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    text: `🚀 New Lead: ${data.product_name}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Lead Received*\n\n*Product:* ${data.product_name}\n*Stage:* ${data.stage}\n*Budget:* ${data.budget_band}\n*Goal:* ${data.success_metric.substring(0, 100)}...`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name:*\n${data.name}` },
          { type: 'mrkdwn', text: `*Email:*\n${data.email}` },
          { type: 'mrkdwn', text: `*Channels:*\n${data.channels.join(', ')}` },
          { type: 'mrkdwn', text: `*Goals:*\n${data.goals.join(', ')}` },
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

