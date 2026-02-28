import { PuppyCard } from './PuppyCard';
import type { Puppy } from '@/types/puppy';

interface PuppyGridProps {
  puppies: Puppy[];
}

export function PuppyGrid({ puppies }: PuppyGridProps): JSX.Element {
  if (puppies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl mb-4">🐾</span>
        <h3 className="text-xl font-semibold text-warm-800 mb-2">No puppies found</h3>
        <p className="text-warm-500 max-w-sm">
          Try adjusting your search or filters — more puppies are added every day!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {puppies.map((puppy) => (
        <PuppyCard key={puppy.id} puppy={puppy} />
      ))}
    </div>
  );
}
