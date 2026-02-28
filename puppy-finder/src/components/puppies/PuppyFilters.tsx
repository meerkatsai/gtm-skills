'use client';

import { selectStyles } from '@/components/ui/FormField';
import { BREEDS, LOCATIONS } from '@/data/puppies';
import type { FilterState, PuppyAgeUnit, PuppySize, PuppyStatus } from '@/types/puppy';

interface PuppyFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function PuppyFilters({ filters, onChange }: PuppyFiltersProps): JSX.Element {
  function update(partial: Partial<FilterState>): void {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={filters.breed}
        onChange={(e) => update({ breed: e.target.value })}
        className={selectStyles + ' w-auto min-w-[140px]'}
      >
        <option value="">All breeds</option>
        {BREEDS.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select
        value={filters.size}
        onChange={(e) => update({ size: e.target.value as PuppySize | '' })}
        className={selectStyles + ' w-auto min-w-[120px]'}
      >
        <option value="">Any size</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>

      <select
        value={filters.ageUnit}
        onChange={(e) => update({ ageUnit: e.target.value as PuppyAgeUnit | '' })}
        className={selectStyles + ' w-auto min-w-[120px]'}
      >
        <option value="">Any age</option>
        <option value="weeks">Weeks old</option>
        <option value="months">Months old</option>
        <option value="years">1+ year</option>
      </select>

      <select
        value={filters.location}
        onChange={(e) => update({ location: e.target.value })}
        className={selectStyles + ' w-auto min-w-[140px]'}
      >
        <option value="">All locations</option>
        {LOCATIONS.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => update({ status: e.target.value as PuppyStatus | '' })}
        className={selectStyles + ' w-auto min-w-[130px]'}
      >
        <option value="">All statuses</option>
        <option value="available">Available</option>
        <option value="pending">Pending</option>
        <option value="adopted">Adopted</option>
      </select>

      {(filters.breed || filters.size || filters.ageUnit || filters.location || filters.status) && (
        <button
          onClick={() => onChange({ query: filters.query, breed: '', ageUnit: '', size: '', location: '', status: '' })}
          className="text-sm text-brand-600 hover:text-brand-800 font-medium underline underline-offset-2 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
