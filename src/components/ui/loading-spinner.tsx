import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-blue-500 border-t-transparent',
          sizeClasses[size]
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
