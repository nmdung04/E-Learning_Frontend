export interface ExamLesson {
  lesson_id: number;
  title: string;
  description: string;
  level_id: number;
  level_name: string;
  is_active: boolean;
}

export interface DisplayOrder {
  display_order_id: number;
  content_type: string; // "AUDIO", "text", "Introduction", "IMAGE"
  content_path: string;
  description?: string;
  content_order: number;
}

export interface Question {
  question_id: number;
  question_number: number;
  displayOrders: DisplayOrder[];
}

export interface Part {
  part_id: number;
  part_number: number;
  description: string;
  questions: Question[];
}

export interface ExamDetail {
  lesson_id: number;
  title: string;
  description: string;
  level_id: number;
  level_name: string;
  parts: Part[];
}

export interface SubmitAnswer {
  part_id: number;
  answer: string; // "ABCDABCD..."
}

export interface SubmitPayload {
  lesson_id: number;
  answers: SubmitAnswer[];
}

export interface PartResult {
  part_id: number;
  part_number: number;
  total_questions: number;
  correct_answers: number;
  score: number;
  correct_answer: string; // "A,B,C,D,A,B"
  user_answer: string; // "A,C,C,D,A,B"
}

export interface SubmitResponse {
  user_lesson_id: number;
  lesson_id: number;
  lesson_title: string;
  status: string;
  total_score: number;
  part_results: PartResult[];
  completed_at: string;
  level_upgraded: boolean;
  new_level: string;
}

export interface ExamHistoryItem {
  user_lesson_id: number;
  lesson_id: number;
  lesson_title: string;
  level_name: string;
  score: number;
  status: string;
  completed_at: string;
  started_at: string;
}

export interface ExamReviewDetail extends SubmitResponse {
  started_at: string;
}
