import { z } from 'zod';

export const leadSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  product_url: z.string().url().optional().or(z.literal('')),
  stage: z.string().min(1, 'Stage is required'),
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
  channels: z.array(z.string()),
  budget_band: z.string().min(1, 'Budget band is required'),
  success_metric: z.string().min(10, 'Please describe your success metric'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  twitter_handle: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

