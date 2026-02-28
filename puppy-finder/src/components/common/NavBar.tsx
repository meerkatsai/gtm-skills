'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '/puppies', label: 'Browse Puppies' },
  { href: '/submit', label: 'List a Puppy' },
];

export function NavBar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-sm border-b border-warm-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-warm-900">
            <span className="text-2xl">🐾</span>
            <span>PuppyFinder</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-warm-600 hover:text-brand-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/submit">
              <Button size="sm">Find a Home</Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-warm-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-warm-200 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-warm-700 hover:text-brand-600 font-medium transition-colors px-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-2">
              <Link href="/submit" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">
                  Find a Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
