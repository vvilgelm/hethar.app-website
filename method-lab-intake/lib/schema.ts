import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  startup: z.string().optional().or(z.literal('')),
  building: z.string().min(1, 'What you\'re building is required').max(140, 'Max 140 characters'),
  drag: z.string().min(1, 'Please select at least one challenge'),
  tried: z.string().optional().or(z.literal('')),
  stage: z.enum(['idea', 'prototype', 'launched', 'revenue', 'scaling'], {
    required_error: 'Please select your stage',
  }),
  acquisition: z.string().optional().or(z.literal('')),
  blocker: z.string().optional().or(z.literal('')),
  finalNote: z.string().optional().or(z.literal('')),
});

export type LeadFormData = z.infer<typeof leadSchema>;

