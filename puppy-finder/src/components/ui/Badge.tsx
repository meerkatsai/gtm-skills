import { cn } from '@/lib/cn';

type BadgeVariant = 'breed' | 'age' | 'size' | 'status' | 'location' | 'personality' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  breed: 'bg-brand-100 text-brand-800',
  age: 'bg-amber-100 text-amber-800',
  size: 'bg-cream-200 text-warm-800',
  status: 'bg-green-100 text-green-800',
  location: 'bg-blue-50 text-blue-700',
  personality: 'bg-warm-100 text-warm-600',
  default: 'bg-warm-100 text-warm-600',
};

export function Badge({ variant = 'default', children, className }: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
