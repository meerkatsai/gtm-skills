import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, CheckBadgeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/Badge';
import { AdoptForm } from '@/components/puppies/AdoptForm';
import { PUPPIES } from '@/data/puppies';

function formatAge(value: number, unit: string): string {
  return `${value} ${value === 1 ? unit.replace(/s$/, '') : unit}`;
}

interface PageProps {
  params: { id: string };
}

export function generateStaticParams(): { id: string }[] {
  return PUPPIES.map((p) => ({ id: p.id }));
}

export default function PuppyDetailPage({ params }: PageProps): JSX.Element {
  const puppy = PUPPIES.find((p) => p.id === params.id);
  if (!puppy) notFound();

  const statusColor = {
    available: 'bg-green-100 text-green-800',
    pending: 'bg-amber-100 text-amber-800',
    adopted: 'bg-warm-100 text-warm-600',
  }[puppy.status];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/puppies"
        className="inline-flex items-center gap-1.5 text-warm-500 hover:text-brand-600 text-sm font-medium mb-8 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to all puppies
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Photo */}
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-warm">
          <Image
            src={puppy.photoUrl}
            alt={`${puppy.name} — ${puppy.breed}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display font-bold text-4xl text-warm-900">{puppy.name}</h1>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor}`}>
                {puppy.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-warm-500">
              <MapPinIcon className="w-4 h-4" />
              <span>{puppy.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="breed">{puppy.breed}</Badge>
            <Badge variant="age">{formatAge(puppy.age.value, puppy.age.unit)}</Badge>
            <Badge variant="size">{puppy.size}</Badge>
            <Badge variant="default">{puppy.sex}</Badge>
          </div>

          <div className="flex gap-4">
            {puppy.isVaccinated && (
              <div className="flex items-center gap-1.5 text-green-700 text-sm font-medium">
                <CheckBadgeIcon className="w-5 h-5" />
                Vaccinated
              </div>
            )}
            {puppy.isNeutered && (
              <div className="flex items-center gap-1.5 text-green-700 text-sm font-medium">
                <CheckBadgeIcon className="w-5 h-5" />
                Neutered
              </div>
            )}
          </div>

          <p className="text-warm-700 leading-relaxed">{puppy.description}</p>

          <div>
            <h3 className="text-sm font-semibold text-warm-500 uppercase tracking-wide mb-2">
              Personality
            </h3>
            <div className="flex flex-wrap gap-2">
              {puppy.personality.map((trait) => (
                <Badge key={trait} variant="personality">{trait}</Badge>
              ))}
            </div>
          </div>

          <p className="text-sm text-warm-400">
            Listed by <span className="text-warm-600 font-medium">{puppy.ownerName}</span>
          </p>
        </div>
      </div>

      {puppy.status === 'available' && <AdoptForm puppy={puppy} />}
      {puppy.status !== 'available' && (
        <div className="bg-warm-100 rounded-3xl p-8 text-center text-warm-600">
          <p className="text-lg font-medium">
            {puppy.name} is {puppy.status} — check back later or{' '}
            <Link href="/puppies" className="text-brand-600 hover:underline">browse other puppies</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
