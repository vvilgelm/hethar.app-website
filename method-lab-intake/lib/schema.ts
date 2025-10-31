import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  startup: z.string().optional().or(z.literal('')),
  building: z.string().min(1, 'What you\'re building is required').max(100, 'Max 100 characters'),
  drag: z.enum([
    'not-enough-traffic',
    'low-conversion',
    'users-not-sticking',
    'unclear-messaging',
    'no-repeatable-channel',
    'dont-know-what-to-test'
  ], {
    required_error: 'Please select the biggest drag',
  }),
  tried: z.string().optional().or(z.literal('')),
  stage: z.enum(['idea', 'prototype', 'launched', 'revenue', 'scaling'], {
    required_error: 'Please select your stage',
  }),
  acquisition: z.enum(['organic', 'paid', 'outbound', 'partnerships', 'other']).optional().or(z.literal('')),
});

export type LeadFormData = z.infer<typeof leadSchema>;

