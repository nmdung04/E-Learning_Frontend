import { motion } from 'framer-motion';
import { Clock, FileText, Trophy, Calendar, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserSubmission, PartType } from '@/services/grammar/types';
import { StatusBadge } from './StatusBadge';

interface SubmissionCardProps {
  submission: UserSubmission;
  onViewSubmission?: (submissionUrl: string) => void;
}

export const SubmissionCard = ({ submission, onViewSubmission }: SubmissionCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeSpent = (seconds: number | null) => {
    if (!seconds) return 'Chưa ghi nhận';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes} phút ${remainingSeconds} giây`;
    }
    return `${remainingSeconds} giây`;
  };

  const getPartTypeLabel = (partType: PartType) => {
    switch (partType) {
      case 'THEORY':
        return 'Lý thuyết';
      case 'MULTIPLE_CHOICE':
        return 'Trắc nghiệm';
      case 'MATCHING':
        return 'Ghép cặp';
      case 'FILL_IN_BLANK':
        return 'Điền vào chỗ trống';
      default:
        return partType;
    }
  };

  const getPartTypeColor = (partType: PartType) => {
    switch (partType) {
      case 'THEORY':
        return 'from-blue-500 to-indigo-500';
      case 'MULTIPLE_CHOICE':
        return 'from-purple-500 to-pink-500';
      case 'MATCHING':
        return 'from-orange-500 to-red-500';
      case 'FILL_IN_BLANK':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const handleViewSubmission = () => {
    if (onViewSubmission) {
      onViewSubmission(submission.submissionUrl);
    } else {
      // Open in new tab as fallback
      window.open(submission.submissionUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl border-2 border-slate-200 hover:border-[#46ce83] hover:shadow-md transition-all overflow-hidden"
    >
      {/* Header with gradient */}
      <div className={cn('bg-gradient-to-r p-4', getPartTypeColor(submission.partDescription))}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur p-2 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">
                Phần {submission.partNumber}
              </h4>
              <p className="text-white/90 text-sm">
                {getPartTypeLabel(submission.partDescription)}
              </p>
            </div>
          </div>
          
          <StatusBadge status={submission.status} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Score */}
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Điểm số</span>
          </div>
          <span className="text-lg font-bold text-amber-800">{submission.score}</span>
        </div>

        {/* Submission Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Submitted At */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Nộp lúc</span>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {formatDate(submission.submittedAt)}
            </p>
          </div>

          {/* Time Spent */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Thời gian</span>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {formatTimeSpent(submission.timeSpent)}
            </p>
          </div>
        </div>

        {/* Submission Type */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Loại:</span>
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs font-semibold',
            submission.submissionType === 'TEXT' 
              ? 'bg-blue-50 text-blue-700' 
              : 'bg-purple-50 text-purple-700'
          )}>
            {submission.submissionType}
          </span>
        </div>

        {/* View Submission Button */}
        <button
          onClick={handleViewSubmission}
          className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-[#46ce83] to-[#3ab56f] hover:from-[#3ab56f] hover:to-[#2ea55f] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <ExternalLink className="w-4 h-4" />
          Xem chi tiết bài nộp
        </button>
      </div>
    </motion.div>
  );
};
