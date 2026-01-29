import { cn } from '@/lib/utils';
import type { UserLessonStatus, SubmissionStatus } from '@/services/grammar/types';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: UserLessonStatus | SubmissionStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge = ({ status, size = 'md', showIcon = true }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'Hoàn thành',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          icon: CheckCircle2,
        };
      case 'IN_PROGRESS':
        return {
          label: 'Đang học',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          icon: PlayCircle,
        };
      case 'NOT_STARTED':
        return {
          label: 'Chưa bắt đầu',
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-600',
          borderColor: 'border-slate-200',
          icon: Clock,
        };
      case 'SUBMITTED':
        return {
          label: 'Đã nộp',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
          icon: CheckCircle2,
        };
      default:
        return {
          label: status,
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-600',
          borderColor: 'border-slate-200',
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border-2',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={iconSizeClasses[size]} />}
      {config.label}
    </span>
  );
};
