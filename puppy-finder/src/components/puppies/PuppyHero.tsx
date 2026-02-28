import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function PuppyHero(): JSX.Element {
  return (
    <section className="bg-brand-50 border-b border-brand-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        <div className="text-7xl mb-6">🐶</div>
        <h1 className="font-display font-bold text-4xl md:text-6xl text-warm-900 text-balance mb-6">
          Every puppy deserves a<br />
          <span className="text-brand-500">loving home.</span>
        </h1>
        <p className="text-warm-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-balance">
          Connect with local puppies looking for their forever families. Browse, fall in love, and make a new best friend.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/puppies">
            <Button size="lg">Browse Puppies</Button>
          </Link>
          <Link href="/submit">
            <Button size="lg" variant="outline">List a Puppy</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
