import { authService } from "../auth/auth.service";
import type { ApiMessageResponse } from "../auth/auth.types";
import type {
  ExamDetail,
  ExamHistoryItem,
  ExamLesson,
  ExamReviewDetail,
  SubmitPayload,
  SubmitResponse,
} from "./exam.types";

const getClient = () => authService.getHttpClient();

export const examService = {
  getLessons: async () => {
    const response = await getClient().get<ApiMessageResponse<ExamLesson[]>>("/exams/lessons");
    return response.data;
  },

  getExamDetail: async (lessonId: number) => {
    const response = await getClient().get<ApiMessageResponse<ExamDetail>>(`/exams/lessons/${lessonId}`);
    return response.data;
  },

  submitExam: async (payload: SubmitPayload) => {
    const response = await getClient().post<ApiMessageResponse<SubmitResponse>>("/exams/submit", payload);
    return response.data;
  },

  getHistory: async () => {
    const response = await getClient().get<ApiMessageResponse<ExamHistoryItem[]>>("/exams/history");
    return response.data;
  },

  getReviewDetail: async (userLessonId: number) => {
    const response = await getClient().get<ApiMessageResponse<ExamReviewDetail>>(`/exams/detail/${userLessonId}`);
    return response.data;
  },
};
