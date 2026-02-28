import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Puppy } from '@/types/puppy';

function formatAge({ value, unit }: Puppy['age']): string {
  return `${value} ${value === 1 ? unit.replace(/s$/, '') : unit}`;
}

interface PuppyCardProps {
  puppy: Puppy;
}

export function PuppyCard({ puppy }: PuppyCardProps): JSX.Element {
  const isUnavailable = puppy.status !== 'available';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={puppy.photoUrl}
          alt={`${puppy.name} — ${puppy.breed}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isUnavailable && (
          <div className="absolute inset-0 bg-warm-900/50 flex items-center justify-center">
            <span className="bg-white/90 text-warm-800 font-semibold px-4 py-1.5 rounded-full text-sm capitalize">
              {puppy.status}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-warm-900/70 to-transparent p-4">
          <h3 className="text-white font-display font-bold text-xl">{puppy.name}</h3>
          <div className="flex items-center gap-1 text-white/80 text-sm mt-0.5">
            <MapPinIcon className="w-3.5 h-3.5" />
            <span>{puppy.location}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="breed">{puppy.breed}</Badge>
          <Badge variant="age">{formatAge(puppy.age)}</Badge>
          <Badge variant="size">{puppy.size}</Badge>
        </div>
        <p className="text-warm-600 text-sm line-clamp-2 flex-1">{puppy.description}</p>
        <Link href={`/puppies/${puppy.id}`}>
          <Button variant="primary" size="sm" className="w-full" disabled={isUnavailable}>
            Meet {puppy.name}
          </Button>
        </Link>
      </div>
    </div>
  );
}
