import Link from 'next/link';

export function Footer(): JSX.Element {
  return (
    <footer className="bg-warm-900 text-warm-400 border-t-4 border-brand-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <span className="text-2xl">🐾</span>
            <span>PuppyFinder</span>
          </div>
          <p className="text-sm text-center">Every puppy deserves a loving home.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/puppies" className="hover:text-brand-300 transition-colors">
              Browse
            </Link>
            <Link href="/submit" className="hover:text-brand-300 transition-colors">
              List a Puppy
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-warm-600 mt-6">
          © {new Date().getFullYear()} PuppyFinder. Made with ❤️ for dogs everywhere.
        </p>
      </div>
    </footer>
  );
}
