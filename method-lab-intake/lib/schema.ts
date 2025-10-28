import { z } from 'zod';

export const leadSchema = z.object({
  startup: z.string().min(1, 'Startup name is required'),
  working: z.string().min(1, 'What\'s working is required'),
  notWorking: z.string().min(1, 'What\'s not working is required'),
  goal: z.string().min(1, '90 day goal is required'),
  budget: z.string().min(1, 'Budget confirmation is required'),
  email: z.string().email('Valid email is required'),
  website: z.string().url().optional().or(z.literal('')),
});

export type LeadFormData = z.infer<typeof leadSchema>;

