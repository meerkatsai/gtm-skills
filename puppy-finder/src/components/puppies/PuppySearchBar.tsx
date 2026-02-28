'use client';

import { useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { inputStyles } from '@/components/ui/FormField';
import { cn } from '@/lib/cn';

interface PuppySearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export function PuppySearchBar({ query, onChange }: PuppySearchBarProps): JSX.Element {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(value), 300);
  }

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400 pointer-events-none" />
      <input
        type="search"
        defaultValue={query}
        onChange={handleChange}
        placeholder="Search by name, breed, or location…"
        className={cn(inputStyles, 'pl-12 py-3 text-base')}
      />
    </div>
  );
}
