'use client';

import { useState, useMemo } from 'react';
import { PuppySearchBar } from '@/components/puppies/PuppySearchBar';
import { PuppyFilters } from '@/components/puppies/PuppyFilters';
import { PuppyGrid } from '@/components/puppies/PuppyGrid';
import { PUPPIES } from '@/data/puppies';
import { filterPuppies } from '@/lib/filterPuppies';
import type { FilterState } from '@/types/puppy';

const DEFAULT_FILTERS: FilterState = {
  query: '',
  breed: '',
  ageUnit: '',
  size: '',
  location: '',
  status: '',
};

export default function BrowsePage(): JSX.Element {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(() => filterPuppies(PUPPIES, filters), [filters]);

  function handleQueryChange(query: string): void {
    setFilters((prev) => ({ ...prev, query }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-4xl text-warm-900 mb-2">Find a puppy</h1>
        <p className="text-warm-500">
          {PUPPIES.length} puppies listed — search, filter, and find your perfect match.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <PuppySearchBar query={filters.query} onChange={handleQueryChange} />
        <PuppyFilters filters={filters} onChange={setFilters} />
      </div>

      <p className="text-sm text-warm-500 mb-6">
        {filtered.length} {filtered.length === 1 ? 'puppy' : 'puppies'} found
      </p>

      <PuppyGrid puppies={filtered} />
    </div>
  );
}
