'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, inputStyles, selectStyles } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { BREEDS } from '@/data/puppies';
import { cn } from '@/lib/cn';

const schema = z.object({
  puppyName: z.string().min(2, 'Name must be at least 2 characters'),
  breed: z.string().min(1, 'Please select a breed'),
  ageValue: z.string().refine((v) => Number(v) >= 1 && Number(v) <= 120, 'Must be between 1 and 120'),
  ageUnit: z.enum(['weeks', 'months', 'years']),
  size: z.enum(['small', 'medium', 'large']),
  sex: z.enum(['male', 'female']),
  location: z.string().min(3, 'Please enter a location'),
  ownerName: z.string().min(2, 'Please enter your name'),
  ownerEmail: z.string().email('Please enter a valid email'),
  description: z.string().min(20, 'Please write at least 20 characters'),
  photoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;
type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export function SubmitPuppyForm(): JSX.Element {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ageUnit: 'months', size: 'medium', sex: 'male' },
  });

  async function onSubmit(_data: FormData): Promise<void> {
    setSubmitState({ status: 'submitting' });
    await new Promise((r) => setTimeout(r, 900));
    setSubmitState({ status: 'success' });
  }

  if (submitState.status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h3 className="font-display font-bold text-2xl text-warm-900 mb-2">Listing submitted!</h3>
        <p className="text-warm-600">
          Thank you! Your puppy&apos;s listing will go live shortly. We hope they find their perfect family.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Puppy's name" required error={errors.puppyName?.message}>
          <input {...register('puppyName')} placeholder="e.g. Biscuit" className={inputStyles} />
        </FormField>

        <FormField label="Breed" required error={errors.breed?.message}>
          <select {...register('breed')} className={selectStyles}>
            <option value="">Select breed…</option>
            {BREEDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
            <option value="Mixed / Other">Mixed / Other</option>
          </select>
        </FormField>

        <FormField label="Age" required error={errors.ageValue?.message}>
          <div className="flex gap-2">
            <input
              {...register('ageValue')}
              type="number"
              min={1}
              placeholder="e.g. 3"
              className={cn(inputStyles, 'w-24')}
            />
            <select {...register('ageUnit')} className={cn(selectStyles, 'flex-1')}>
              <option value="weeks">weeks</option>
              <option value="months">months</option>
              <option value="years">years</option>
            </select>
          </div>
        </FormField>

        <FormField label="Size" required error={errors.size?.message}>
          <select {...register('size')} className={selectStyles}>
            <option value="small">Small (under 10 kg)</option>
            <option value="medium">Medium (10–25 kg)</option>
            <option value="large">Large (25 kg+)</option>
          </select>
        </FormField>

        <FormField label="Sex" required error={errors.sex?.message}>
          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('sex')} type="radio" value="male" className="accent-brand-500" />
              <span className="text-sm text-warm-700">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('sex')} type="radio" value="female" className="accent-brand-500" />
              <span className="text-sm text-warm-700">Female</span>
            </label>
          </div>
        </FormField>

        <FormField label="Location" required error={errors.location?.message}>
          <input {...register('location')} placeholder="e.g. Austin, TX" className={inputStyles} />
        </FormField>

        <FormField label="Your name" required error={errors.ownerName?.message}>
          <input {...register('ownerName')} placeholder="Jane Smith" className={inputStyles} />
        </FormField>

        <FormField label="Your email" required error={errors.ownerEmail?.message}>
          <input {...register('ownerEmail')} type="email" placeholder="jane@example.com" className={inputStyles} />
        </FormField>
      </div>

      <FormField label="About this puppy" required error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe their personality, temperament, any training they have, and what kind of home would suit them best…"
          className={cn(inputStyles, 'resize-none')}
        />
      </FormField>

      <FormField label="Photo URL" error={errors.photoUrl?.message}>
        <input
          {...register('photoUrl')}
          type="url"
          placeholder="https://… (optional)"
          className={inputStyles}
        />
      </FormField>

      <Button
        type="submit"
        size="lg"
        disabled={submitState.status === 'submitting'}
        className="self-start"
      >
        {submitState.status === 'submitting' ? 'Submitting…' : 'List my puppy'}
      </Button>
    </form>
  );
}
