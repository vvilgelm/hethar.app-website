// Serverless function for contact form submission
// Works with Vercel/Netlify Functions

// Rate limiting (in-memory, use Redis/KV for production)
const submissions = new Map();
const RATE_LIMIT = 3; // max submissions per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

// Honeypot fields for spam detection
const HONEYPOT_FIELDS = ['website', 'url', 'company'];

// Simple email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Simple phone validation
function isValidPhone(phone) {
  return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
}

// Check rate limit
function checkRateLimit(ip) {
  const now = Date.now();
  const userSubmissions = submissions.get(ip) || [];
  
  // Clean old submissions
  const recentSubmissions = userSubmissions.filter(time => now - time < RATE_WINDOW);
  
  if (recentSubmissions.length >= RATE_LIMIT) {
    return false;
  }
  
  recentSubmissions.push(now);
  submissions.set(ip, recentSubmissions);
  return true;
}

// Main handler
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { contact, timestamp, source, ...rest } = req.body;
    
    // Get IP for rate limiting
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Try again later.' });
    }
    
    // Honeypot check
    const hasHoneypot = HONEYPOT_FIELDS.some(field => rest[field]);
    if (hasHoneypot) {
      console.log('[SPAM] Honeypot triggered:', ip);
      return res.status(400).json({ error: 'Invalid submission' });
    }
    
    // Validate contact
    if (!contact || typeof contact !== 'string') {
      return res.status(400).json({ error: 'Contact required' });
    }
    
    const trimmed = contact.trim();
    const isEmail = isValidEmail(trimmed);
    const isPhone = isValidPhone(trimmed);
    
    if (!isEmail && !isPhone) {
      return res.status(400).json({ error: 'Invalid email or phone format' });
    }
    
    // Log submission (in production, save to database)
    console.log('[CONTACT SUBMISSION]', {
      contact: trimmed,
      type: isEmail ? 'email' : 'phone',
      timestamp,
      source,
      ip
    });
    
    // TODO: Save to database (Supabase, Firebase, Airtable, etc.)
    // TODO: Send notification (email, Slack, etc.)
    
    // Example: Send to Resend/SendGrid
    // await sendEmailNotification(trimmed);
    
    // Example: Save to Airtable
    // await saveToAirtable({ contact: trimmed, timestamp, source, ip });
    
    return res.status(200).json({ 
      success: true, 
      message: 'received. i'll find you.' 
    });
    
  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Example: Send email notification via Resend
async function sendEmailNotification(contact) {
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // 
  // await resend.emails.send({
  //   from: 'Hethar <noreply@hethar.app>',
  //   to: 'team@hethar.app',
  //   subject: 'New Contact Submission',
  //   text: `New contact: ${contact}`
  // });
}

// Example: Save to Airtable
async function saveToAirtable(data) {
  // const Airtable = require('airtable');
  // const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
  // 
  // await base('Contacts').create([{
  //   fields: {
  //     Contact: data.contact,
  //     Timestamp: data.timestamp,
  //     Source: data.source,
  //     IP: data.ip
  //   }
  // }]);
}

