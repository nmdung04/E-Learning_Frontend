import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, AlertCircle, Filter, GraduationCap, Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getLessons } from '@/services/grammar/api';
import type { LessonSummary } from '@/services/grammar/types';

// Level filters với màu sắc riêng
const LEVEL_FILTERS = [
  { id: null, label: 'Tất cả', color: 'from-slate-500 to-slate-600' },
  { id: 1, label: 'A1', description: 'Beginner', color: 'from-green-500 to-emerald-500' },
  { id: 2, label: 'A2', description: 'Elementary', color: 'from-blue-500 to-cyan-500' },
  { id: 3, label: 'B1', description: 'Intermediate', color: 'from-purple-500 to-pink-500' },
  { id: 4, label: 'B2', description: 'Upper Intermediate', color: 'from-orange-500 to-red-500' },
  { id: 5, label: 'C1', description: 'Advanced', color: 'from-indigo-500 to-purple-600' },
  { id: 6, label: 'C2', description: 'Proficiency', color: 'from-rose-500 to-pink-600' },
];

// Category filters
const CATEGORY_FILTERS = [
  { id: null, label: 'Tất cả', icon: '📚' },
  { id: 1, label: 'Grammar', icon: '✍️' },
  { id: 2, label: 'Vocabulary Quiz', icon: '📖' },
  { id: 3, label: 'Reading', icon: '📄' },
  { id: 4, label: 'Listening Part 1', icon: '🎧' },
  { id: 5, label: 'Listening Part 2', icon: '🎵' },
  { id: 6, label: 'TOEIC Practice', icon: '🎯' },
];

export const GrammarLessonsPage = () => {
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch lessons
  const fetchLessons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: { page: number; limit: number; levelId?: number; categoryId?: number } = {
        page: currentPage,
        limit: 12,
      };

      if (selectedLevel !== null) params.levelId = selectedLevel;
      if (selectedCategory !== null) params.categoryId = selectedCategory;

      const response = await getLessons(params);
      
      setLessons(response.data.lessons);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách bài học';
      setError(errorMessage);
      console.error('Error fetching lessons:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedLevel, selectedCategory]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Handle filter changes
  const handleLevelChange = (levelId: number | null) => {
    setSelectedLevel(levelId);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Handle start lesson
  const handleStartLesson = (lessonId: number) => {
    navigate(`/grammar/lessons/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white px-8 py-4 rounded-2xl shadow-lg">
            <Library className="w-9 h-9" />
            <h1 className="text-3xl font-bold">Thư viện bài học</h1>
          </div>
          
          <p className="text-slate-600 text-lg">
            Khám phá và bắt đầu các bài học phù hợp với trình độ của bạn
          </p>
        </motion.div>

        {/* Level Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md border-2 border-slate-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-5 h-5 text-[#46ce83]" />
            <h3 className="text-lg font-bold text-slate-800">Chọn trình độ</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {LEVEL_FILTERS.map((level) => (
              <button
                key={level.id ?? 'all'}
                onClick={() => handleLevelChange(level.id)}
                className={cn(
                  'group relative px-5 py-3 rounded-xl font-bold text-sm transition-all border-2 overflow-hidden',
                  selectedLevel === level.id
                    ? 'border-transparent text-white shadow-lg scale-105'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-[#46ce83] hover:shadow-sm'
                )}
              >
                {selectedLevel === level.id && (
                  <motion.div
                    layoutId="activeLevel"
                    className={cn('absolute inset-0 bg-gradient-to-r', level.color)}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-1">
                  <span className="text-base">{level.label}</span>
                  {level.description && (
                    <span className={cn(
                      'text-xs',
                      selectedLevel === level.id ? 'text-white/80' : 'text-slate-500'
                    )}>
                      {level.description}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-md border-2 border-slate-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-[#46ce83]" />
            <h3 className="text-lg font-bold text-slate-800">Chọn loại bài học</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {CATEGORY_FILTERS.map((category) => (
              <button
                key={category.id ?? 'all'}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  'px-5 py-3 rounded-xl font-semibold text-sm transition-all border-2',
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white border-[#46ce83] shadow-lg scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#46ce83] hover:shadow-sm'
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.label}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-slate-600 font-medium">
              Tìm thấy <span className="text-[#46ce83] font-bold">{totalItems}</span> bài học
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <Loader2 className="w-12 h-12 text-[#46ce83] animate-spin" />
            <p className="text-slate-600 font-medium">Đang tải bài học...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">Có lỗi xảy ra</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchLessons}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Thử lại
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && lessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center space-y-4"
          >
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-700">
              Không tìm thấy bài học
            </h3>
            <p className="text-slate-500">
              Thử thay đổi bộ lọc để xem thêm bài học khác
            </p>
          </motion.div>
        )}

        {/* Lessons Grid */}
        {!isLoading && !error && lessons.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.lesson_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#46ce83] hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                    onClick={() => handleStartLesson(lesson.lesson_id)}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#46ce83] to-[#3ab56f] p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="bg-white/20 backdrop-blur p-2 rounded-lg">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-lg">
                            {lesson.level.name}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {lesson.title}
                      </h3>
                      
                      <p className="text-sm text-white/90 line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-4">
                      {/* Category Badge */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold border border-purple-200">
                          {lesson.category.name}
                        </span>
                      </div>

                      {/* Parts Info */}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-medium">{lesson.parts.length} phần học</span>
                        <span>•</span>
                        <span>
                          {lesson.parts.filter(p => p.description === 'THEORY').length} lý thuyết
                        </span>
                        <span>•</span>
                        <span>
                          {lesson.parts.filter(p => p.description !== 'THEORY').length} bài tập
                        </span>
                      </div>

                      {/* Start Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartLesson(lesson.lesson_id);
                        }}
                        className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#46ce83] to-[#3ab56f] hover:from-[#3ab56f] hover:to-[#2ea55f] text-white transition-all shadow-md hover:shadow-lg group-hover:scale-105"
                      >
                        Bắt đầu học
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 pt-4"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    'px-4 py-2 rounded-lg font-semibold transition-all',
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-[#46ce83] hover:shadow-sm'
                  )}
                >
                  Trang trước
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          'w-10 h-10 rounded-lg font-bold transition-all',
                          currentPage === page
                            ? 'bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white shadow-md'
                            : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-[#46ce83]'
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'px-4 py-2 rounded-lg font-semibold transition-all',
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-[#46ce83] hover:shadow-sm'
                  )}
                >
                  Trang sau
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
