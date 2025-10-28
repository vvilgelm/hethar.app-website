'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadFormData } from '@/lib/schema';
import clsx from 'clsx';

const questions = [
  {
    key: 'startup',
    label: 'what\'s your startup called?',
    type: 'text',
    response: 'nice. names carry weight — even before you have users.',
  },
  {
    key: 'working',
    label: 'what\'s working right now?',
    type: 'textarea',
    response: 'makes sense. there\'s always that one thing that keeps the lights on.',
  },
  {
    key: 'notWorking',
    label: 'what\'s not working?',
    type: 'textarea',
    response: 'that\'s usually where the leverage hides. most founders just ignore it.',
  },
  {
    key: 'goal',
    label: 'what\'s your goal for the next 90 days?',
    type: 'textarea',
    response: 'good window. three months is enough to prove almost anything — or kill it fast.',
  },
  {
    key: 'budget',
    label: 'okay with $5k/month + small rev-share? (covers ads, ops, management)',
    type: 'text',
    response: 'cool. we only take startups that treat this like partnership, not outsourcing.',
  },
  {
    key: 'email',
    label: 'email address',
    type: 'email',
    response: '',
  },
  {
    key: 'website',
    label: 'drop your link / contact (optional)',
    type: 'url',
    response: 'perfect. we\'ll review it and reach out if it fits the batch. no waiting list. no polite "maybes."',
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

  // Note: Removed timezone auto-detection as it's not in our schema

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

