import Link from 'next/link';
import { PuppyHero } from '@/components/puppies/PuppyHero';
import { PuppyCard } from '@/components/puppies/PuppyCard';
import { Button } from '@/components/ui/Button';
import { PUPPIES } from '@/data/puppies';
import { HeartIcon, MagnifyingGlassIcon, HomeIcon } from '@heroicons/react/24/outline';

const FEATURED = PUPPIES.filter((p) => p.status === 'available').slice(0, 4);

const HOW_IT_WORKS = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Browse puppies',
    description: 'Search and filter puppies near you by breed, size, age, and more.',
  },
  {
    icon: HeartIcon,
    title: 'Fall in love',
    description: "Read about their personality, meet them virtually, and find your perfect match.",
  },
  {
    icon: HomeIcon,
    title: 'Welcome them home',
    description: 'Message the owner directly and arrange to bring your new best friend home.',
  },
];

export default function HomePage(): JSX.Element {
  return (
    <>
      <PuppyHero />

      {/* Featured puppies */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-3xl text-warm-900">
            Meet some puppies 🐾
          </h2>
          <Link href="/puppies">
            <Button variant="ghost" size="sm">View all →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED.map((puppy) => (
            <PuppyCard key={puppy.id} puppy={puppy} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-50 border-y border-brand-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-warm-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-warm">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-300 font-bold text-xl">{i + 1}.</span>
                  <h3 className="font-display font-semibold text-xl text-warm-900">{title}</h3>
                </div>
                <p className="text-warm-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-display font-bold text-3xl text-warm-900 mb-4">
          Ready to find your forever friend?
        </h2>
        <p className="text-warm-600 mb-8 max-w-xl mx-auto">
          Hundreds of puppies are waiting for a loving home. Your perfect match might be just a click away.
        </p>
        <Link href="/puppies">
          <Button size="lg">Browse all puppies</Button>
        </Link>
      </section>
    </>
  );
}
