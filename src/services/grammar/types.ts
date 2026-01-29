// ============================================================================
// ENUMS & UNION TYPES
// ============================================================================
export type PartType = 'THEORY' | 'MULTIPLE_CHOICE' | 'MATCHING' | 'FILL_IN_BLANK';

export type ContentType = 'text' | 'image' | 'audio' | 'video' | 'pdf' | 'other';

// ============================================================================
// CORE INTERFACES
// ============================================================================
export interface DisplayOrder {
  display_order_id: number;
  content_type: ContentType;
  /** URL path to content file (null if content_type is 'text') */
  content_path: string | null;
  /** Text content or description */
  description: string | null;
  /** Order in which this content should be displayed */
  content_order: number;
}
export interface Question {
  question_id: number;
  question_number: number;
  /** Array of content items to display (e.g., question text, options) */
  displayOrders: DisplayOrder[];
  description?: string;
}

export interface Part {
  part_id: number;
  part_number: number;
  /** Type of part: THEORY, MULTIPLE_CHOICE, MATCHING, or FILL_IN_BLANK */
  description: PartType;
  /** URL to file containing correct answers (null for THEORY parts) */
  correct_answer_path: string | null;
  /** Array of questions in this part */
  questions: Question[];
}

export interface PartSummary {
  part_id: number;
  part_number: number;
  description: PartType;
}

export interface LevelInfo {
  level_id: number;
  /** Level code (A1, A2, B1, B2) */
  name: string;
  /** Human-readable level description */
  description: string;
}

export interface CategoryInfo {
  category_id: number;
  /** Category name (e.g., "Grammar", "Vocabulary Quiz") */
  name: string;
  /** Category description */
  description: string;
  /** URL to category icon */
  icon_path: string;
}

export interface Lesson {
  lesson_id: number;
  title: string;
  description: string;
  topic: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  level_id: number;
  category_id: number;
  level: LevelInfo;
  category: CategoryInfo;
  /** Full parts with questions and displayOrders */
  parts: Part[];
}

export interface LessonSummary {
  lesson_id: number;
  title: string;
  description: string;
  topic: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  level_id: number;
  category_id: number;
  level: LevelInfo;
  category: CategoryInfo;
  /** Simplified parts without questions */
  parts: PartSummary[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LessonsListResponse {
  statusCode: number;
  message: string;
  data: {
    lessons: LessonSummary[];
    pagination: Pagination;
  };
}

export interface LessonDetailResponse {
  statusCode: number;
  message: string;
  data: Lesson;
}

export interface LessonsQueryParams {
  page?: number;
  limit?: number;
  levelId?: number;
  categoryId?: number;
}

// ============================================================================
// USER ANSWER STATE TYPES
// ============================================================================

interface BaseAnswerState {
  isChecked: boolean;
  isCorrect: boolean | null;
  showHint: boolean;
  submittedAt?: string;
}

export interface MultipleChoiceAnswerState extends BaseAnswerState {
  type: 'MULTIPLE_CHOICE';
  selectedOption: number | null;
}

export interface MatchingAnswerState extends BaseAnswerState {
  type: 'MATCHING';
  matches: Record<number, number>;
}

export interface FillInBlankAnswerState extends BaseAnswerState {
  type: 'FILL_IN_BLANK';
  /** Map of blank ID to user's answer text */
  answers: Record<number, string>;
}

export interface TheoryState {
  type: 'THEORY';
  hasViewed: boolean;
  timeSpent: number;
}

export type UserAnswerState =
  | MultipleChoiceAnswerState
  | MatchingAnswerState
  | FillInBlankAnswerState
  | TheoryState;

export interface LessonProgress {
  lesson_id: number;
  partProgress: Record<number, Record<number, UserAnswerState>>;
  completionPercentage: number;
  score: number;
  /** Maximum possible score */
  maxScore: number;
  isCompleted: boolean;
  lastUpdated: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export function isTheoryPart(part: Part): boolean {
  return part.description === 'THEORY';
}

export function requiresAnswer(part: Part): boolean {
  return part.description !== 'THEORY';
}

export function isAnswerStateType<T extends UserAnswerState['type']>(
  state: UserAnswerState,
  type: T
): state is Extract<UserAnswerState, { type: T }> {
  return state.type === type;
}

export function createInitialAnswerState(partType: PartType): UserAnswerState {
  switch (partType) {
    case 'THEORY':
      return {
        type: 'THEORY',
        hasViewed: false,
        timeSpent: 0,
      };
    case 'MULTIPLE_CHOICE':
      return {
        type: 'MULTIPLE_CHOICE',
        selectedOption: null,
        isChecked: false,
        isCorrect: null,
        showHint: false,
      };
    case 'MATCHING':
      return {
        type: 'MATCHING',
        matches: {},
        isChecked: false,
        isCorrect: null,
        showHint: false,
      };
    case 'FILL_IN_BLANK':
      return {
        type: 'FILL_IN_BLANK',
        answers: {},
        isChecked: false,
        isCorrect: null,
        showHint: false,
      };
  }
}

// ============================================================================
// MY LESSONS API TYPES (User's lesson progress)
// ============================================================================

export type UserLessonStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type SubmissionStatus = 'SUBMITTED' | 'COMPLETED';

export type SubmissionType = 'TEXT' | 'FILE';

export interface UserSubmission {
  userSubmissionId: number;
  partId: number;
  partNumber: number;
  partDescription: PartType;
  submissionType: SubmissionType;
  submissionUrl: string;
  status: SubmissionStatus;
  score: number;
  timeSpent: number | null;
  submittedAt: string;
  updatedAt: string;
}

export interface UserLessonInfo {
  lessonId: number;
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  levelId: number;
  levelName: string;
}

export interface UserLesson {
  userLessonId: number;
  lesson: UserLessonInfo;
  status: UserLessonStatus;
  score: number;
  progressPercentage: number;
  startedAt: string;
  completedAt: string | null;
  submissions: UserSubmission[];
  totalSubmissions: number;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * API response for GET /api/grammar/my-lessons
 */
export interface MyLessonsResponse {
  statusCode: number;
  message: string;
  data: {
    data: UserLesson[];
    pagination: PaginationInfo;
  };
}

/**
 * Query params for GET /api/grammar/my-lessons
 */
export interface MyLessonsQueryParams {
  page?: number;
  limit?: number;
  status?: UserLessonStatus;
}

// ============================================================================
// LESSON SUBMISSIONS DETAIL API TYPES
// ============================================================================

/**
 * Lesson summary in submission detail
 */
export interface SubmissionLessonInfo {
  lesson_id: number;
  title: string;
  description: string;
}

/**
 * API response for GET /api/grammar/lessons/{lessonId}/my-submissions
 */
export interface LessonSubmissionsResponse {
  statusCode: number;
  message: string;
  data: {
    lesson: SubmissionLessonInfo;
    userLessonStatus: UserLessonStatus;
    userLessonScore: number;
    startedAt: string;
    completedAt: string | null;
    progressPercentage: number;
    submissions: UserSubmission[];
    totalSubmissions: number;
  };
}
