import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
  animated?: boolean;
}

export const ProgressBar = ({
  percentage,
  showLabel = true,
  size = 'md',
  variant = 'default',
  animated = true,
}: ProgressBarProps) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const getVariantColors = () => {
    if (clampedPercentage === 100) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
    
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'warning':
        return 'bg-gradient-to-r from-amber-400 to-orange-500';
      default:
        return 'bg-gradient-to-r from-[#46ce83] to-[#3ab56f]';
    }
  };

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className={cn('font-semibold text-slate-700', textSizeClasses[size])}>
            Tiến độ
          </span>
          <span className={cn('font-bold text-slate-800', textSizeClasses[size])}>
            {clampedPercentage}%
          </span>
        </div>
      )}
      
      <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', heightClasses[size])}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full', getVariantColors())}
          />
        ) : (
          <div
            style={{ width: `${clampedPercentage}%` }}
            className={cn('h-full rounded-full transition-all duration-500', getVariantColors())}
          />
        )}
      </div>
    </div>
  );
};
