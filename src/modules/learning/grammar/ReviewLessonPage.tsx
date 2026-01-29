import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Trophy, 
  Calendar,
  BookOpen,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLessonSubmissions } from '@/services/grammar/api';
import type { LessonSubmissionsResponse } from '@/services/grammar/types';
import { StatusBadge } from '@/components/grammar/StatusBadge';
import { ProgressBar } from '@/components/grammar/ProgressBar';
import { SubmissionCard } from '@/components/grammar/SubmissionCard';

export const ReviewLessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<LessonSubmissionsResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!lessonId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getLessonSubmissions(parseInt(lessonId));
      setData(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải chi tiết bài nộp';
      setError(errorMessage);
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    if (lessonId) {
      fetchSubmissions();
    }
  }, [fetchSubmissions, lessonId]);

  const handleBack = () => {
    navigate('/grammar/dashboard');
  };

  const handleViewSubmission = (submissionUrl: string) => {
    window.open(submissionUrl, '_blank');
  };

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

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-16 h-16 text-[#46ce83] animate-spin mx-auto" />
          <p className="text-lg font-medium text-slate-600">Đang tải chi tiết bài nộp...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md space-y-4"
        >
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h3 className="text-xl font-bold text-red-900 text-center">Có lỗi xảy ra</h3>
          <p className="text-red-700 text-center">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-4 py-2 bg-white border-2 border-red-200 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={fetchSubmissions}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 hover:border-[#46ce83] text-slate-700 font-semibold rounded-xl transition-all hover:shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Dashboard
        </motion.button>

        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#46ce83] to-[#3ab56f] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {data.lesson.title}
                  </h1>
                  <p className="text-white/90 text-lg">
                    {data.lesson.description}
                  </p>
                </div>
              </div>
              
              <StatusBadge status={data.userLessonStatus} size="lg" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Score */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
              <div className="bg-amber-500 p-3 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-600 font-medium">Điểm số</p>
                <p className="text-3xl font-bold text-amber-800">{data.userLessonScore}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <div className="bg-green-500 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Tiến độ</p>
                <p className="text-3xl font-bold text-green-800">{data.progressPercentage}%</p>
              </div>
            </div>

            {/* Submissions Count */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <div className="bg-blue-500 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Bài nộp</p>
                <p className="text-3xl font-bold text-blue-800">{data.totalSubmissions}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-6">
            <ProgressBar percentage={data.progressPercentage} size="md" animated />
          </div>

          {/* Dates */}
          <div className="px-6 pb-6 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Clock className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Bắt đầu</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatDate(data.startedAt)}
                  </p>
                </div>
              </div>

              {data.completedAt && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600 font-medium">Hoàn thành</p>
                    <p className="text-sm font-semibold text-green-700">
                      {formatDate(data.completedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Submissions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-[#46ce83] to-[#3ab56f] rounded-full" />
            <h2 className="text-2xl font-bold text-slate-800">
              Chi tiết các phần đã nộp
            </h2>
          </div>

          {data.submissions.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
              <h3 className="text-xl font-bold text-slate-700">Chưa có bài nộp nào</h3>
              <p className="text-slate-500">
                Bạn chưa hoàn thành và nộp phần nào của bài học này.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.submissions
                .sort((a, b) => a.partNumber - b.partNumber)
                .map((submission, index) => (
                  <motion.div
                    key={submission.userSubmissionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <SubmissionCard
                      submission={submission}
                      onViewSubmission={handleViewSubmission}
                    />
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pt-4"
        >
          <button
            onClick={() => navigate(`/grammar/lessons/${lessonId}`)}
            className={cn(
              'px-8 py-3 rounded-xl font-bold text-lg transition-all flex items-center gap-3 shadow-lg hover:shadow-xl',
              data.userLessonStatus === 'COMPLETED'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
            )}
          >
            <BookOpen className="w-5 h-5" />
            {data.userLessonStatus === 'COMPLETED' ? 'Xem lại bài học' : 'Tiếp tục học'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};
