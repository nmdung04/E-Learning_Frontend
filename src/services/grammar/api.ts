/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import type { 
  Lesson, 
  DisplayOrder, 
  Part, 
  Question,
  MyLessonsResponse,
  MyLessonsQueryParams,
  LessonSubmissionsResponse,
  LessonsListResponse,
  LessonsQueryParams
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
const attachToken = () => {
  const token = window.localStorage.getItem("access_token");

  return token ? { Authorization: `Bearer ${token}` } : {};

};

const sortDisplayOrders = (orders: DisplayOrder[] = []): DisplayOrder[] =>
  [...orders].sort((a, b) => (a.content_order ?? 0) - (b.content_order ?? 0));

const normalizeDisplayOrder = (order: any): DisplayOrder => ({
  display_order_id: order.display_order_id ?? order.id ?? 0,
  content_type: order.content_type ?? order.type ?? "text",
  content_path: order.content_path ?? order.path ?? null,
  description: order.description ?? order.text ?? order.content_text ?? null,
  content_order: order.content_order ?? order.order ?? 0,
});

const normalizeQuestion = (question: any): Question => ({
  question_id: question.question_id ?? question.id ?? 0,
  question_number: question.question_number ?? question.number ?? 0,
  displayOrders: sortDisplayOrders(
    (question.displayOrders ?? question.display_orders ?? question.contents ?? [])
      .map(normalizeDisplayOrder)
  ),
});

const sortQuestions = (questions: Question[] = []): Question[] =>
  questions.map((q) => ({ ...q, displayOrders: sortDisplayOrders(q.displayOrders) }));

const normalizePart = (part: any): Part => ({
  part_id: part.part_id ?? part.id ?? 0,
  part_number: part.part_number ?? part.number ?? 0,
  description: part.description ?? null,
  correct_answer_path: part.correct_answer_path ?? null,
  questions: sortQuestions((part.questions ?? []).map(normalizeQuestion)),
});

const sortParts = (parts: Part[] = []): Part[] =>
  parts.map((p) => ({ ...p, questions: sortQuestions(p.questions) }));

const normalizeLesson = (raw: any): Lesson => ({
  lesson_id: raw.lesson_id ?? raw.id ?? 0,
  title: raw.title ?? "",
  description: raw.description ?? null,
  topic: raw.topic ?? null,
  is_active: Boolean(raw.is_active ?? true),
  created_at: raw.created_at ?? "",
  updated_at: raw.updated_at ?? "",
  level_id: raw.level_id ?? raw.level?.level_id ?? 0,
  category_id: raw.category_id ?? raw.category?.category_id ?? 0,
  level: raw.level ?? null,
  category: raw.category ?? null,
  parts: sortParts((raw.parts ?? raw.lesson_parts ?? []).map(normalizePart)),
});

export const fetchLessonDetail = async (id: number): Promise<Lesson> => {
  console.log(`🚀 Đang gọi API: ${API_BASE}/grammar/lessons/${id}`);
  try {
    const res = await axios.get(`${API_BASE}/grammar/lessons/${id}`, {
      headers: {
        accept: "application/json",
        ...attachToken(),
      },
    });

    // Dữ liệu có thể ở nhiều lớp: res.data.data.data hoặc res.data.data hoặc res.data
    const rawData = res.data?.data?.data ?? res.data?.data ?? res.data;

    if (!rawData) {
      throw new Error("Không tìm thấy dữ liệu trong phản hồi từ server");
    }

    const lesson = normalizeLesson(rawData);
    if (!lesson.lesson_id) {
      throw new Error("Phản hồi không chứa lesson_id hợp lệ");
    }
    return lesson;

  } catch (error: unknown) {
    const axiosErr = error as AxiosError;
    console.error("Lỗi API:", axiosErr.response?.status, axiosErr.message);
    const status = axiosErr?.response?.status;
    if (status === 404) {
      throw new Error("Lesson not found (404)");
    }
    if (status === 500) {
      throw new Error("Server error (500)");
    }
    const message = axiosErr?.message || (error instanceof Error ? error.message : "Failed to fetch lesson");
    throw new Error(message);
  }
};

// ============================================================================
// SUBMISSION API
// ============================================================================

export interface SubmitPartPayload {
  score: number;
}

export interface SubmitPartResponse {
  statusCode: number;
  message: string;
  data?: {
    submission_id: number;
    lesson_id: number;
    part_id: number;
    user_id: number;
    score: number;
    submitted_at: string;
  };
}

export interface MySubmission {
  userSubmissionId: number;
  lesson_id: number;
  partId: number;
  partNumber: number;
  partDescription: string;
  score: number;
  submittedAt: string;
}

export interface MySubmissionsResponse {
  statusCode: number;
  message: string;
  data: {
    lesson_title: string;
    submissions: MySubmission[];
    average_score: number;
  };
}

/**
 * Submit part completion score to the server
 * POST /api/grammar/lessons/{lessonId}/parts/{partId}/submissions
 */
export const submitPartScore = async (
  lessonId: number,
  partId: number,
  answers: string
): Promise<SubmitPartResponse> => {
  console.log(`📤 Submitting answers for lesson ${lessonId}, part ${partId}: ${answers}`);
  
  try {
    const res = await axios.post(
      `${API_BASE}/grammar/lessons/${lessonId}/parts/${partId}/submissions`,
      { answers },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          ...attachToken(),
        },
      }
    );

    return res.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError;
    console.error('Submission error:', axiosErr.response?.status, axiosErr.message);
    
    const status = axiosErr?.response?.status;
    if (status === 401) {
      throw new Error('Bạn cần đăng nhập để lưu kết quả');
    }
    if (status === 404) {
      throw new Error('Không tìm thấy bài học hoặc phần bài tập');
    }
    if (status === 500) {
      throw new Error('Lỗi server, vui lòng thử lại sau');
    }
    
    const message = axiosErr?.message || (error instanceof Error ? error.message : 'Không thể lưu kết quả');
    throw new Error(message);
  }
};

/**
 * Get all user submissions for a lesson
 * GET /api/grammar/lessons/{lessonId}/my-submissions
 */
export const getMySubmissions = async (lessonId: number): Promise<MySubmissionsResponse> => {
  console.log(`📥 Fetching submissions for lesson ${lessonId}`);
  
  try {
    const res = await axios.get(
      `${API_BASE}/grammar/lessons/${lessonId}/my-submissions`,
      {
        headers: {
          accept: 'application/json',
          ...attachToken(),
        },
      }
    );

    return res.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError;
    console.error('Get submissions error:', axiosErr.response?.status, axiosErr.message);
    
    const status = axiosErr?.response?.status;
    if (status === 401) {
      throw new Error('Bạn cần đăng nhập để xem lịch sử');
    }
    if (status === 404) {
      throw new Error('Không tìm thấy bài học');
    }
    
    const message = axiosErr?.message || (error instanceof Error ? error.message : 'Không thể tải lịch sử');
    throw new Error(message);
  }
};

// ============================================================================
// LESSONS LIST API (Browse all lessons)
// ============================================================================
export const getLessons = async (params?: LessonsQueryParams): Promise<LessonsListResponse> => {
  console.log('📥 Fetching lessons list with params:', params);
  
  try {
    const res = await axios.get(`${API_BASE}/grammar/lessons`, {
      params,
      headers: {
        accept: 'application/json',
        ...attachToken(),
      },
    });

    return res.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError;
    console.error('Get lessons error:', axiosErr.response?.status, axiosErr.message);
    
    const message = axiosErr?.message || (error instanceof Error ? error.message : 'Không thể tải danh sách bài học');
    throw new Error(message);
  }
};

// ============================================================================
// MY LESSONS API (User's lesson progress)
// ============================================================================

/**
 * Get all lessons that the user has participated in
 * GET /api/grammar/my-lessons
 */
export const getMyLessons = async (params?: MyLessonsQueryParams): Promise<MyLessonsResponse> => {
  console.log('📥 Fetching my lessons with params:', params);
  
  try {
    const res = await axios.get(`${API_BASE}/grammar/my-lessons`, {
      params,
      headers: {
        accept: 'application/json',
        ...attachToken(),
      },
    });

    return res.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError;
    console.error('Get my lessons error:', axiosErr.response?.status, axiosErr.message);
    
    const status = axiosErr?.response?.status;
    if (status === 401) {
      throw new Error('Bạn cần đăng nhập để xem bài học của bạn');
    }
    
    const message = axiosErr?.message || (error instanceof Error ? error.message : 'Không thể tải danh sách bài học');
    throw new Error(message);
  }
};

/**
 * Get detailed submission history for a specific lesson
 * GET /api/grammar/lessons/{lessonId}/my-submissions
 */
export const getLessonSubmissions = async (lessonId: number): Promise<LessonSubmissionsResponse> => {
  console.log(`📥 Fetching submission details for lesson ${lessonId}`);
  
  try {
    const res = await axios.get(
      `${API_BASE}/grammar/lessons/${lessonId}/my-submissions`,
      {
        headers: {
          accept: 'application/json',
          ...attachToken(),
        },
      }
    );

    return res.data;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError;
    console.error('Get lesson submissions error:', axiosErr.response?.status, axiosErr.message);
    
    const status = axiosErr?.response?.status;
    if (status === 401) {
      throw new Error('Bạn cần đăng nhập để xem chi tiết bài nộp');
    }
    if (status === 404) {
      throw new Error('Không tìm thấy bài học');
    }
    
    const message = axiosErr?.message || (error instanceof Error ? error.message : 'Không thể tải chi tiết bài nộp');
    throw new Error(message);
  }
};

export default { 
  fetchLessonDetail, 
  submitPartScore, 
  getMySubmissions,
  getMyLessons,
  getLessonSubmissions,
  getLessons
};
