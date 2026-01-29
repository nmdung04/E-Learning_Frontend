import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence,  } from 'framer-motion';
import { ArrowLeft, Trophy, ChevronLeft, ChevronRight, Loader2, AlertCircle, History } from 'lucide-react';
import confetti from 'canvas-confetti';
import {  type Lesson } from '@/services/grammar/types';
import { cn } from '@/lib/utils';
import { submitPartScore, getMySubmissions, type MySubmission } from '@/services/grammar/api';
import { soundEffects } from '@/utils/soundEffects';
import { TheoryPart } from './TheoryPart';
import { MultipleChoicePart } from './MultipleChoicePart';
import { MatchingGamePart } from './MatchingGamePart';
import { FillInBlankPart } from './FillInBlankPart';

interface Props {
  lesson: Lesson;
  onExit?: () => void;
}

interface PartCompletionState {
  [partId: number]: {
    isCompleted: boolean;
    score?: number;
  };
}

export const LessonContainer = ({ lesson, onExit }: Props) => {
  // LocalStorage key for persistence
  const storageKey = `lesson_${lesson.lesson_id}_progress`;

  // Initialize state from localStorage if available
  const [currentPartIndex, setCurrentPartIndex] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [partCompletionState, setPartCompletionState] = useState<PartCompletionState>(() => {
    const saved = localStorage.getItem(`${storageKey}_completion`);
    return saved ? JSON.parse(saved) : {};
  });

  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [mySubmissions, setMySubmissions] = useState<MySubmission[]>([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(storageKey, currentPartIndex.toString());
  }, [currentPartIndex, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}_completion`, JSON.stringify(partCompletionState));
  }, [partCompletionState, storageKey]);

  const parts = useMemo(() => lesson?.parts ?? [], [lesson]);
  const currentPart = parts[currentPartIndex];
  const totalParts = parts.length;

  // Cuộn lên đầu trang mỗi khi chuyển Part
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPartIndex]);

  // Trigger confetti when lesson is finished
  useEffect(() => {
    if (isFinished) {
      // Clear localStorage on completion
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}_completion`);

      // Play completion sound
      soundEffects.playComplete();

      // Confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Launch confetti from two sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isFinished, storageKey]);

  // Tính toán tiến trình dựa trên số part đã hoàn thành
  const progressPercentage = useMemo(() => {
    if (totalParts === 0) return 0;
    
    // Đếm số part đã hoàn thành
    const completedCount = Object.values(partCompletionState).filter(
      (state) => state.isCompleted
    ).length;
    
    return Math.round((completedCount / totalParts) * 100);
  }, [partCompletionState, totalParts]);

  // Kiểm tra Part hiện tại đã hoàn thành chưa
  const isCurrentPartCompleted = useMemo(() => {
    return currentPart ? partCompletionState[currentPart.part_id]?.isCompleted ?? false : false;
  }, [currentPart, partCompletionState]);

  // Handler khi Part hoàn thành với API submission
  const handlePartComplete = async (score?: string) => {
    if (!currentPart || !lesson) return;

    // Reset error state
    setSubmissionError(null);

    // Nếu là THEORY (không có điểm), chỉ cần update state local
    if (currentPart.description === 'THEORY') {
      setPartCompletionState((prev) => ({
        ...prev,
        [currentPart.part_id]: {
          isCompleted: true,
          score: undefined,
        },
      }));
      return;
    }

    // Với các part khác, cần submit lên server
    if (score === undefined) {
      console.warn('Score is required for non-theory parts');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Gọi API submit
      await submitPartScore(lesson.lesson_id, currentPart.part_id, score);
      
      console.log(`Successfully submitted part ${currentPart.part_id} with score ${score}`);
      
      // Chỉ sau khi submit thành công mới update state
      setPartCompletionState((prev) => ({
        ...prev,
        [currentPart.part_id]: {
          isCompleted: true,
          score: 100,
        },
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể lưu kết quả';
      console.error('Submission failed:', errorMessage);
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler để retry submission
  const handleRetrySubmission = () => {
    setSubmissionError(null);
  };

  // Handler để load submission history
  const   handleLoadSubmissions = async () => {
    if (!lesson) return;
    
    try {
      setLoadingSubmissions(true);
      const response = await getMySubmissions(lesson.lesson_id);
      console.log("Dữ liệu submission:", response.data.submissions); // Kiểm tra tên các key ở đây
      setMySubmissions(response.data.submissions);
      setShowSubmissions(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải lịch sử';
      console.error('Failed to load submissions:', errorMessage);
      alert(errorMessage);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Handler chuyển sang Part tiếp theo
  const handleNext = () => {
    if (currentPartIndex < totalParts - 1) {
      setCurrentPartIndex((prev) => prev + 1);
    } else {
      // Đã hoàn thành tất cả Part
      setIsFinished(true);
    }
  };

  // Handler quay lại Part trước
  const handleBack = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1);
    }
  };

  // Tính tổng điểm (nếu có)
  const totalScore = useMemo(() => {
    const scores = Object.values(partCompletionState)
      .map((state) => state.score)
      .filter((score): score is number => score !== undefined);
    
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [partCompletionState]);

  // Render Part component dựa trên type
  const renderPartContent = () => {
    if (!currentPart) {
      return (
        <div className="py-12 text-center text-slate-500">
          <p>Không tìm thấy nội dung bài học.</p>
        </div>
      );
    }

    const commonProps = {
      data: currentPart,
      onBack: handleBack,
    };

    switch (currentPart.description) {
      case 'THEORY':
        return (
          <TheoryPart
            data={currentPart}
            onComplete={() => handlePartComplete()}
          />
        );

      case 'MULTIPLE_CHOICE':
        return (
          <MultipleChoicePart
            {...commonProps}
            onComplete={(score: string) => handlePartComplete(score)}
          />
        );

      case 'MATCHING':
        return (
          <MatchingGamePart
            {...commonProps}
            onFinish={() => handlePartComplete("100")}
          />
        );

      case 'FILL_IN_BLANK':
        return (
          <FillInBlankPart
            {...commonProps}
            onFinish={() => handlePartComplete("100")}
          />
        );

      default:
        return (
          <div className="py-12 text-center text-slate-500">
            <p>Loại bài tập "{currentPart.description}" chưa được hỗ trợ.</p>
          </div>
        );
    }
  };

  // Màn hình hoàn thành
  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6"
      >
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🎉 Chúc mừng!
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Bạn đã hoàn thành bài học
          </p>
          <h2 className="text-2xl font-bold text-green-600 mb-8">
            {lesson.title}
          </h2>

          {totalScore !== null && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl">
              <p className="text-sm text-slate-600 mb-2">Điểm trung bình</p>
              <p className="text-5xl font-bold text-green-600">{totalScore}</p>
              <p className="text-sm text-slate-500 mt-1">/ 100 điểm</p>
            </div>
          )}

          <div className="space-y-4">
            {/* View Submissions Button */}
            <button
              onClick={handleLoadSubmissions}
              disabled={loadingSubmissions}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loadingSubmissions ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <History className="w-5 h-5" />
                  <span>Lịch sử làm bài</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                // Clear localStorage when restarting
                localStorage.removeItem(storageKey);
                localStorage.removeItem(`${storageKey}_completion`);
                setIsFinished(false);
                setCurrentPartIndex(0);
                setPartCompletionState({});
              }}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white rounded-2xl font-bold text-lg hover:from-[#3ab56f] hover:to-[#2fa35f] transition-all hover:scale-105 shadow-lg"
            >
              Học lại từ đầu
            </button>

            {onExit && (
              <button
                onClick={() => {
                  // Clear localStorage when exiting
                  localStorage.removeItem(storageKey);
                  localStorage.removeItem(`${storageKey}_completion`);
                  onExit();
                }}
                className="w-full px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all hover:scale-105"
              >
                Quay về
              </button>
            )}
          </div>

          {/* Submissions Modal */}
          {showSubmissions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowSubmissions(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#46ce83] to-[#3ab56f] px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <History className="w-7 h-7" />
                      <h3 className="text-2xl font-bold">Lịch sử làm bài</h3>
                    </div>
                    <button
                      onClick={() => setShowSubmissions(false)}
                      className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-all text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-green-50 text-sm mt-2">
                    Xem lại điểm số các lần làm bài của bạn
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                  {mySubmissions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <History className="w-12 h-12 text-slate-400" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-700 mb-2">Chưa có lịch sử làm bài</h4>
                      <p className="text-slate-500 text-center max-w-sm">
                        Các bài làm của bạn sẽ được lưu lại tại đây
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {/* Stats Summary */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-100">
                          <p className="text-sm text-blue-600 font-semibold mb-1">Tổng số lần nộp</p>
                          <p className="text-3xl font-bold text-blue-700">{mySubmissions.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-100">
                          <p className="text-sm text-green-600 font-semibold mb-1">Điểm cao nhất</p>
                          <p className="text-3xl font-bold text-green-700">
                            {Math.max(...mySubmissions.map(s => s.score))}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100">
                          <p className="text-sm text-purple-600 font-semibold mb-1">Điểm trung bình</p>
                          <p className="text-3xl font-bold text-purple-700">
                            {Math.round(mySubmissions.reduce((sum, s) => sum + s.score, 0) / mySubmissions.length)}
                          </p>
                        </div>
                      </div>

                      {/* Timeline List */}
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#46ce83] via-[#3ab56f] to-slate-200" />

                        <div className="space-y-6">
                          {mySubmissions.map((sub, index) => (
                            <motion.div
                              key={sub.userSubmissionId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative pl-16 pr-4"
                            >
                              {/* Timeline Dot */}
                              <div className="absolute left-0 flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#46ce83] to-[#3ab56f] flex items-center justify-center text-white font-bold shadow-lg border-4 border-white">
                                  {mySubmissions.length - index}
                                </div>
                              </div>

                              {/* Card */}
                              <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5 border-2 border-slate-200 hover:border-[#46ce83] hover:shadow-lg transition-all group">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-bold text-white bg-gradient-to-r from-[#46ce83] to-[#3ab56f] px-2.5 py-1 rounded-full">
                                        Lần {mySubmissions.length - index}
                                      </span>
                                      <span className="text-xs font-semibold text-slate-500">
                                        Phần {sub.partNumber}
                                      </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-[#46ce83] transition-colors">
                                      {sub.partDescription}
                                    </h4>
                                  </div>
                                  
                                  {/* Score Badge */}
                                  <div className="ml-4 flex flex-col items-end">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-md">
                                      <p className="text-2xl font-bold leading-none">{sub.score}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">điểm</p>
                                  </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center gap-2 text-sm text-slate-600 pt-3 border-t border-slate-200">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">
                                    {new Date(sub.submittedAt).toLocaleString('vi-VN', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-200">
                  <button
                    onClick={() => setShowSubmissions(false)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Hoàn thành {totalParts} phần • {lesson.level.name} • {lesson.category.name}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Màn hình học bài
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Top Row: Back button and Lesson Info */}
          <div className="flex items-center justify-between mb-4">
            {onExit && (
              <button
                onClick={onExit}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Thoát</span>
              </button>
            )}

            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-slate-800 mb-1">
                {lesson.title}
              </h1>
              <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  {lesson.level.name}
                </span>
                <span>•</span>
                <span>{lesson.category.name}</span>
              </div>
            </div>

            <div className="w-20" /> {/* Spacer for symmetry */}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">
                Phần {currentPartIndex + 1}/{totalParts}
              </span>
              <span className="text-slate-500">{progressPercentage}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#46ce83] to-[#3ab56f] rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Animation */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Submission Error Alert */}
        <AnimatePresence>
          {submissionError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-red-900 mb-1">Không thể lưu kết quả</h4>
                <p className="text-sm text-red-700 mb-3">{submissionError}</p>
                <button
                  onClick={handleRetrySubmission}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-all"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay during submission */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3"
          >
            <Loader2 className="w-6 h-6 text-green-600 animate-spin flex-shrink-0" />
            <div>
              <h4 className="font-bold text-green-900">Đang lưu kết quả...</h4>
              <p className="text-sm text-green-700">Vui lòng đợi trong giây lát</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPartIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPartContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center justify-between gap-4"
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={currentPartIndex === 0}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all',
              currentPartIndex === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:scale-105'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          {/* Part Type Indicator */}
          <div className="flex-1 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-full text-sm font-semibold text-slate-600">
              {currentPart?.description === 'THEORY' && '📚 Lý thuyết'}
              {currentPart?.description === 'MULTIPLE_CHOICE' && '✍️ Trắc nghiệm'}
              {currentPart?.description === 'MATCHING' && '🔗 Nối cặp'}
              {currentPart?.description === 'FILL_IN_BLANK' && '✏️ Điền từ'}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!isCurrentPartCompleted}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg',
              isCurrentPartCompleted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105 hover:shadow-xl'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            )}
          >
            <span>{currentPartIndex === totalParts - 1 ? 'Hoàn thành' : 'Tiếp theo'}</span>
            {currentPartIndex === totalParts - 1 ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </motion.div>

        {/* Completion Status */}
        {!isCurrentPartCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-amber-600 bg-amber-50 inline-block px-4 py-2 rounded-lg border border-amber-200">
              💡 Hoàn thành phần này để tiếp tục
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LessonContainer;
