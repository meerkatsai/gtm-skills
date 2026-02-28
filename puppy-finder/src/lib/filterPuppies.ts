import type { Puppy, FilterState } from '@/types/puppy';

export function filterPuppies(puppies: Puppy[], filters: FilterState): Puppy[] {
  return puppies.filter((puppy) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = [puppy.name, puppy.breed, puppy.location, puppy.description]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.breed && puppy.breed !== filters.breed) return false;
    if (filters.size && puppy.size !== filters.size) return false;
    if (filters.ageUnit && puppy.age.unit !== filters.ageUnit) return false;
    if (filters.location && puppy.location !== filters.location) return false;
    if (filters.status && puppy.status !== filters.status) return false;
    return true;
  });
}
