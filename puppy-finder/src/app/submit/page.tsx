import { SubmitPuppyForm } from '@/components/puppies/SubmitPuppyForm';
import { CheckIcon } from '@heroicons/react/24/outline';

const BENEFITS = [
  'Free to list — always',
  'Reach families actively looking for puppies',
  'You control who you speak to',
  'Listings go live within 24 hours',
];

export default function SubmitPage(): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left: info panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <div className="text-5xl mb-4">🏠</div>
            <h1 className="font-display font-bold text-4xl text-warm-900 mb-3">
              Find your puppy a loving home
            </h1>
            <p className="text-warm-600 leading-relaxed">
              Fill in the details below and we will connect your puppy with families who are ready to give them the life they deserve.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-warm-700">
                <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-3.5 h-3.5 text-brand-600" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 text-sm text-warm-600">
            <strong className="text-warm-800 block mb-1">Your privacy matters</strong>
            Your email is never shown publicly. Interested adopters contact us first, and we share your details only when you agree.
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-3">
          <SubmitPuppyForm />
        </div>
      </div>
    </div>
  );
}
