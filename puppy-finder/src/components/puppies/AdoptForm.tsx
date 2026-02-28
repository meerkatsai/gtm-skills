'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, inputStyles, selectStyles } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { Puppy } from '@/types/puppy';

const schema = z.object({
  adopterName: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  livingSituation: z.enum(['house-with-yard', 'house-no-yard', 'apartment', 'other']),
  message: z.string().min(20, 'Please tell us a bit more (at least 20 characters)'),
  hasYard: z.boolean(),
  hasPets: z.boolean(),
});

type FormData = z.infer<typeof schema>;
type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

interface AdoptFormProps {
  puppy: Puppy;
}

export function AdoptForm({ puppy }: AdoptFormProps): JSX.Element {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { hasYard: false, hasPets: false },
  });

  async function onSubmit(_data: FormData): Promise<void> {
    setSubmitState({ status: 'submitting' });
    await new Promise((r) => setTimeout(r, 800));
    setSubmitState({ status: 'success' });
  }

  if (submitState.status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-display font-bold text-xl text-warm-900 mb-2">
          Message sent to {puppy.ownerName}!
        </h3>
        <p className="text-warm-600">
          They&apos;ll be in touch soon. Fingers crossed for you and {puppy.name}!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-brand-50 rounded-3xl p-6 md:p-8 flex flex-col gap-5">
      <h2 className="font-display font-bold text-2xl text-warm-900">
        Interested in {puppy.name}?
      </h2>
      <p className="text-warm-600 text-sm -mt-2">
        Send a message to {puppy.ownerName} and introduce yourself.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Your name" required error={errors.adopterName?.message}>
          <input {...register('adopterName')} placeholder="Jane Smith" className={inputStyles} />
        </FormField>
        <FormField label="Email" required error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="jane@example.com" className={inputStyles} />
        </FormField>
        <FormField label="Phone" required error={errors.phone?.message}>
          <input {...register('phone')} type="tel" placeholder="+1 555 000 0000" className={inputStyles} />
        </FormField>
        <FormField label="Living situation" required error={errors.livingSituation?.message}>
          <select {...register('livingSituation')} className={selectStyles}>
            <option value="">Select…</option>
            <option value="house-with-yard">House with yard</option>
            <option value="house-no-yard">House, no yard</option>
            <option value="apartment">Apartment</option>
            <option value="other">Other</option>
          </select>
        </FormField>
      </div>

      <FormField label="Tell us about yourself" required error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={4}
          placeholder={`Why do you want to adopt ${puppy.name}? Tell the owner a bit about your home and lifestyle…`}
          className={cn(inputStyles, 'resize-none')}
        />
      </FormField>

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register('hasYard')} type="checkbox" className="w-4 h-4 rounded accent-brand-500" />
          <span className="text-sm text-warm-700">I have a yard</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register('hasPets')} type="checkbox" className="w-4 h-4 rounded accent-brand-500" />
          <span className="text-sm text-warm-700">I have other pets</span>
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitState.status === 'submitting'}
        className="self-start"
      >
        {submitState.status === 'submitting' ? 'Sending…' : `Message ${puppy.ownerName}`}
      </Button>
    </form>
  );
}
