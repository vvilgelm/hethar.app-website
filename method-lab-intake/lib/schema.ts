import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  startup: z.string().url().optional().or(z.literal('')),
  building: z.string().min(1, 'What you\'re building is required'),
  drag: z.enum(['traffic', 'funnel', 'users', 'story', 'all'], {
    required_error: 'Please select the biggest drag',
  }),
  stage: z.enum([
    'idea',
    'building',
    'pre-launch',
    'just-launched',
    'early-rev',
    'between-early-scaling',
    'scaling',
    'post-scaling'
  ], {
    required_error: 'Please select your stage',
  }),
});

export type LeadFormData = z.infer<typeof leadSchema>;

