'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadFormData } from '@/lib/schema';
import clsx from 'clsx';

const STAGES = [
  'pre-launch',
  'beta',
  'launched <$5k MRR',
  'launched $5–50k MRR',
  '>$50k MRR',
];

const GOALS = [
  'paying users',
  'activation',
  'lower CAC',
  'raise',
  'brand proof',
];

const CHANNELS = [
  'twitter',
  'reels/shorts',
  'meta ads',
  'google ads',
  'communities',
  'referrals',
  'none yet',
];

const BUDGET_BANDS = [
  '$0–1k',
  '$1–3k',
  '$3–10k',
  '$10k+',
  'not sure',
];

const questions = [
  {
    key: 'product_name',
    label: 'first, what\'s your product called? (site if you have one)',
    type: 'text',
    response: 'nice. names carry weight — even before you have users.',
  },
  {
    key: 'product_url',
    label: 'product URL (optional)',
    type: 'url',
    response: '',
  },
  {
    key: 'stage',
    label: 'where are you at right now?',
    type: 'chips',
    options: STAGES,
    response: '',
  },
  {
    key: 'goals',
    label: 'what\'s the goal you actually care about for the next 90 days?',
    type: 'multi-chips',
    options: GOALS,
    response: '',
  },
  {
    key: 'channels',
    label: 'what\'s your current engine?',
    type: 'multi-chips',
    options: CHANNELS,
    response: '',
  },
  {
    key: 'budget_band',
    label: 'ballpark budget you\'re comfortable deploying into growth right now?',
    type: 'chips',
    options: BUDGET_BANDS,
    response: '',
  },
  {
    key: 'success_metric',
    label: 'what would make you say in 60 days: "ok, this was worth it?"',
    type: 'textarea',
    response: 'good window. three months is enough to prove almost anything — or kill it fast.',
  },
  {
    key: 'name',
    label: 'best contact name?',
    type: 'text',
    response: '',
  },
  {
    key: 'email',
    label: 'email address',
    type: 'email',
    response: '',
  },
  {
    key: 'timezone',
    label: 'timezone',
    type: 'text',
    response: '',
  },
  {
    key: 'twitter_handle',
    label: 'drop your X (twitter) handle if you want us to peek the vibe (optional)',
    type: 'text',
    response: '',
  },
];

export default function ChatForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCalEmbed, setShowCalEmbed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<LeadFormData>>({});

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  // Auto-detect timezone
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setValue('timezone', tz);
    setFormData(prev => ({ ...prev, timezone: tz }));
  }, [setValue]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('methodlab_form', JSON.stringify(formData));
  }, [formData]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('methodlab_form');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      Object.keys(parsed).forEach(key => {
        setValue(key as any, parsed[key]);
      });
    }
  }, [setValue]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setValue(key as any, value);
    
    // Auto-advance to next question
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 400);
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowCalEmbed(true);
        localStorage.removeItem('methodlab_form');
      } else {
        alert('hmm—something glitched. mind trying once more?');
      }
    } catch (error) {
      alert('hmm—something glitched. mind trying once more?');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showCalEmbed) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-lg mb-2">nice. this helps. lock a time below and we'll come prepared.</p>
        </div>
        <iframe
          src={process.env.NEXT_PUBLIC_CAL_URL || 'https://cal.com/methodlab/intro'}
          width="100%"
          height="720px"
          className="border border-gray-200 rounded-lg"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
      {questions.map((q, index) => {
        const isVisible = index <= currentStep;
        
        return (
          <div
            key={q.key}
            className={clsx(
              'transition-all duration-500',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            )}
          >
            <label className="block text-sm text-muted mb-3 lowercase">{q.label}</label>
            
            {q.type === 'text' && (
              <input
                type="text"
                {...register(q.key as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black transition-colors"
                onChange={(e) => handleFieldChange(q.key, e.target.value)}
              />
            )}

            {q.type === 'url' && (
              <input
                type="url"
                {...register(q.key as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black transition-colors"
                placeholder="https://"
                onChange={(e) => handleFieldChange(q.key, e.target.value)}
              />
            )}

            {q.type === 'email' && (
              <input
                type="email"
                {...register(q.key as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black transition-colors"
                placeholder="you@startup.com"
                onChange={(e) => handleFieldChange(q.key, e.target.value)}
              />
            )}

            {q.type === 'textarea' && (
              <textarea
                {...register(q.key as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black transition-colors resize-y min-h-[100px]"
                onChange={(e) => handleFieldChange(q.key, e.target.value)}
              />
            )}

            {q.type === 'chips' && (
              <div className="flex flex-wrap gap-2">
                {q.options?.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleFieldChange(q.key, option)}
                    className={clsx(
                      'px-4 py-2 border rounded transition-all',
                      watch(q.key as any) === option
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-200 hover:border-black'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'multi-chips' && (
              <div className="flex flex-wrap gap-2">
                {q.options?.map(option => {
                  const selected = (watch(q.key as any) as string[] || []).includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        const current = watch(q.key as any) as string[] || [];
                        const updated = selected
                          ? current.filter(v => v !== option)
                          : [...current, option];
                        handleFieldChange(q.key, updated);
                      }}
                      className={clsx(
                        'px-4 py-2 border rounded transition-all',
                        selected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-200 hover:border-black'
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}

            {q.response && watch(q.key as any) && (
              <p className="text-sm text-muted italic mt-3 pl-4 border-l-2 border-gray-200 animate-fade-in">
                {q.response}
              </p>
            )}

            {errors[q.key as keyof LeadFormData] && (
              <p className="text-sm text-red-600 mt-2">
                {errors[q.key as keyof LeadFormData]?.message}
              </p>
            )}
          </div>
        );
      })}

      {currentStep >= questions.length - 1 && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'submitting...' : 'submit to lab review'}
        </button>
      )}
    </form>
  );
}

