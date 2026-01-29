import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, AlertCircle, GraduationCap, Library, Filter as FilterIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getMyLessons, getLessons } from '@/services/grammar/api';
import type { UserLesson, UserLessonStatus, LessonSummary } from '@/services/grammar/types';
import { LessonCard } from '@/components/grammar/LessonCard';

type StatusFilter = 'ALL' | UserLessonStatus;
type ViewMode = 'MY_LESSONS' | 'ALL_LESSONS';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'IN_PROGRESS', label: 'Đang học' },
  { value: 'NOT_STARTED', label: 'Chưa bắt đầu' },
];

const LEVELS = [
  { id: null, label: 'Tất cả', color: 'from-slate-500 to-slate-600' },
  { id: 1, label: 'A1', color: 'from-green-500 to-emerald-500' },
  { id: 2, label: 'A2', color: 'from-blue-500 to-cyan-500' },
  { id: 3, label: 'B1', color: 'from-purple-500 to-pink-500' },
  { id: 4, label: 'B2', color: 'from-orange-500 to-red-500' },
  { id: 5, label: 'C1', color: 'from-indigo-500 to-purple-600' },
  { id: 6, label: 'C2', color: 'from-rose-500 to-pink-600' },
];

const CATEGORIES = [
  { id: null, label: 'Tất cả', icon: '📚' },
  { id: 1, label: 'Grammar', icon: '✍️' },
  { id: 2, label: 'Vocabulary', icon: '📖' },
  { id: 3, label: 'Reading', icon: '📄' },
  { id: 4, label: 'Listening Part 1', icon: '🎧' },
  { id: 5, label: 'Listening Part 2', icon: '🎵' },
  { id: 6, label: 'TOEIC Full Test', icon: '🎯' },
];

export const GrammarDashboardPage = () => {
  const navigate = useNavigate();
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('MY_LESSONS');
  
  // My Lessons state
  const [myLessons, setMyLessons] = useState<UserLesson[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  
  // All Lessons state
  const [allLessons, setAllLessons] = useState<LessonSummary[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Common state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Dynamic lessons state - changes type based on viewMode
  const lessons = viewMode === 'MY_LESSONS' ? myLessons : allLessons;

  // Fetch lessons based on view mode
  const fetchLessons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (viewMode === 'MY_LESSONS') {
        // Fetch user's participated lessons
        const params: { page: number; limit: number; status?: UserLessonStatus } = {
          page: currentPage,
          limit: 12,
        };

        if (statusFilter !== 'ALL') {
          params.status = statusFilter;
        }

        const response = await getMyLessons(params);
        setMyLessons(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      } else {
        // Fetch all available lessons with level/category filters
        const params: { page: number; limit: number; levelId?: number; categoryId?: number } = {
          page: currentPage,
          limit: 12,
        };

        if (selectedLevel !== null) params.levelId = selectedLevel;
        if (selectedCategory !== null) params.categoryId = selectedCategory;

        const response = await getLessons(params);
        setAllLessons(response.data.lessons);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách bài học';
      setError(errorMessage);
      console.error('Error fetching lessons:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, viewMode, statusFilter, selectedLevel, selectedCategory]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  // Handle status filter change (My Lessons)
  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  // Handle level filter change (All Lessons)
  const handleLevelChange = (levelId: number | null) => {
    setSelectedLevel(levelId);
    setCurrentPage(1);
  };

  // Handle category filter change (All Lessons)
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
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white px-6 py-3 rounded-2xl shadow-lg">
            <Library className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Bài học Grammar</h1>
          </div>
          
          <p className="text-slate-600 text-lg">
            Theo dõi tiến độ và khám phá bài học mới
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-center gap-3"
        >
          <button
            onClick={() => handleViewModeChange('MY_LESSONS')}
            className={cn(
              'px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 shadow-sm',
              viewMode === 'MY_LESSONS'
                ? 'bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white border-[#46ce83] scale-105'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#46ce83]'
            )}
          >
            📚 Bài học của tôi
          </button>
          <button
            onClick={() => handleViewModeChange('ALL_LESSONS')}
            className={cn(
              'px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 shadow-sm',
              viewMode === 'ALL_LESSONS'
                ? 'bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white border-[#46ce83] scale-105'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#46ce83]'
            )}
          >
            🌐 Khám phá tất cả
          </button>
        </motion.div>

        {/* Filters - Sticky on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-4 z-40 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-slate-200"
        >
          {viewMode === 'MY_LESSONS' ? (
            // Status Filter for My Lessons
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FilterIcon className="w-5 h-5 text-[#46ce83]" />
                <h3 className="text-lg font-bold text-slate-800">Lọc theo trạng thái</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleStatusFilterChange(filter.value)}
                    className={cn(
                      'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2',
                      statusFilter === filter.value
                        ? 'bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white border-[#46ce83] shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#46ce83] hover:shadow-sm'
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Level & Category Filters for All Lessons
            <div className="space-y-5">
              {/* Level Filter */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-[#46ce83]" />
                  <h3 className="text-base font-bold text-slate-800">Trình độ</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((level) => (
                    <button
                      key={level.id ?? 'all'}
                      onClick={() => handleLevelChange(level.id)}
                      className={cn(
                        'group relative px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 overflow-hidden',
                        selectedLevel === level.id
                          ? 'border-transparent text-white shadow-md scale-105'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#46ce83]'
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
                      <span className="relative z-10">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FilterIcon className="w-5 h-5 text-[#46ce83]" />
                  <h3 className="text-base font-bold text-slate-800">Loại bài học</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id ?? 'all'}
                      onClick={() => handleCategoryChange(category.id)}
                      className={cn(
                        'px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2',
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-[#46ce83] to-[#3ab56f] text-white border-[#46ce83] shadow-md scale-105'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-[#46ce83]'
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-slate-600 font-medium">
              {viewMode === 'MY_LESSONS' ? 'Bạn có' : 'Tìm thấy'}{' '}
              <span className="text-[#46ce83] font-bold">{totalItems}</span> bài học
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
              {viewMode === 'MY_LESSONS' ? 'Chưa có bài học nào' : 'Không tìm thấy bài học'}
            </h3>
            <p className="text-slate-500">
              {viewMode === 'MY_LESSONS'
                ? 'Bạn chưa tham gia bài học nào. Chuyển sang "Khám phá tất cả" để bắt đầu!'
                : 'Thử điều chỉnh bộ lọc để xem nhiều kết quả hơn.'}
            </p>
          </motion.div>
        )}

        {/* Lessons Grid */}
        {!isLoading && !error && lessons.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {viewMode === 'MY_LESSONS' 
                  ? (lessons as UserLesson[]).map((lesson, index) => (
                      <motion.div
                        key={lesson.userLessonId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div onClick={() => navigate(`/grammar/lessons/${lesson.lesson.lessonId}`)}>
                          <LessonCard lesson={lesson} />
                        </div>
                      </motion.div>
                    ))
                  : (lessons as LessonSummary[]).map((lesson, index) => (
                      <motion.div
                        key={lesson.lesson_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          onClick={() => handleStartLesson(lesson.lesson_id)}
                          className="group cursor-pointer bg-white border-2 border-slate-200 hover:border-[#46ce83] rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                          {/* Header with Level Badge */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#46ce83] transition-colors line-clamp-2">
                                {lesson.title}
                              </h3>
                            </div>
                            {lesson.level && (
                              <div className="ml-3 px-3 py-1 rounded-lg font-bold text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm flex-shrink-0">
                                {lesson.level.name}
                              </div>
                            )}
                          </div>

                          {/* Category */}
                          {lesson.category && (
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-lg">
                                {CATEGORIES.find(c => c.id === lesson.category_id)?.icon || '📚'}
                              </span>
                              <span className="text-sm font-semibold text-slate-600">
                                {lesson.category.name}
                              </span>
                            </div>
                          )}

                          {/* Start Button */}
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-500">
                                Nhấp để bắt đầu
                              </span>
                              <ArrowRight className="w-5 h-5 text-[#46ce83] group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                }
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
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
}
