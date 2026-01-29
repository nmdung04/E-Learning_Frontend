import { motion } from 'framer-motion';
import { BookOpen, Trophy, Calendar, TrendingUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserLesson } from '@/services/grammar/types';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';

interface LessonCardProps {
  lesson: UserLesson;
  onReview?: (lessonId: number) => void;
  onContinue?: (lessonId: number) => void;
}

export const LessonCard = ({ lesson, onReview, onContinue }: LessonCardProps) => {
  const isCompleted = lesson.status === 'COMPLETED';
  const isInProgress = lesson.status === 'IN_PROGRESS';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleAction = () => {
    if (isCompleted && onReview) {
      onReview(lesson.lesson.lessonId);
    } else if (onContinue) {
      onContinue(lesson.lesson.lessonId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#46ce83] hover:shadow-lg transition-all overflow-hidden group"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#46ce83] to-[#3ab56f] p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-white/20 backdrop-blur p-1.5 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <StatusBadge status={lesson.status} size="sm" />
            </div>
            
            <h3 className="text-lg font-bold text-white line-clamp-2 mb-1">
              {lesson.lesson.title}
            </h3>
            
            <p className="text-sm text-white/90 line-clamp-1">
              {lesson.lesson.description}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Level & Category */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200">
            {lesson.lesson.levelName}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200">
            {lesson.lesson.categoryName}
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          percentage={lesson.progressPercentage} 
          size="sm"
          showLabel={false}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Score */}
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <Trophy className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs text-amber-600 font-medium">Điểm</p>
              <p className="text-sm font-bold text-amber-800">{lesson.score}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Tiến độ</p>
              <p className="text-sm font-bold text-blue-800">{lesson.progressPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>Bắt đầu: {formatDate(lesson.startedAt)}</span>
          </div>
          
          {lesson.completedAt && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hoàn thành: {formatDate(lesson.completedAt)}</span>
            </div>
          )}
        </div>

        {/* Submissions Count */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium">{lesson.totalSubmissions} bài nộp</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAction}
          className={cn(
            'w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:scale-105',
            isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg'
              : isInProgress
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md hover:shadow-lg'
          )}
        >
          {isCompleted ? (
            <>
              <Eye className="w-4 h-4" />
              Xem lại bài học
            </>
          ) : isInProgress ? (
            <>
              <BookOpen className="w-4 h-4" />
              Tiếp tục học
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              Bắt đầu học
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
