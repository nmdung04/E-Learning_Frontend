export type VocabularyTopic = {
  name: string
  totalWords: number
  learnedCount: number
  progressPercentage: number
}

export type VocabularyTopicsResponse = {
  statusCode: number
  message: string
  data: VocabularyTopic[]
}

// Lesson API Types
export type DisplayOrder = {
  display_order_id: number
  question_id: number
  content_type: string
  content_path: string
  description: string | null
  content_order: number
  created_at: string
  updated_at: string
}

export type Question = {
  question_id: number
  question_number: number
  part_id: number
  created_at: string
  updated_at: string
  displayOrders: DisplayOrder[]
}

export type Part = {
  part_id: number
  part_number: number
  description: string
  correct_answer_path: string
  lesson_id: number
  created_at: string
  updated_at: string
  questions: Question[]
}

export type Lesson = {
  lesson_id: number
  title: string
  description: string
  topic: string
  is_active: boolean
  created_at: string
  updated_at: string
  level_id: number
  category_id: number
  parts: Part[]
}

export type LessonResponse = {
  statusCode: number
  message: string
  data: Lesson
}

// Lessons List API Response
export type VocabularyLesson = {
  lesson_id: number
  title: string
  description: string
  topic: string
  is_active: boolean
  created_at: string
  updated_at: string
  level_id: number
  category_id: number
}

export type VocabularyLessonsResponse = {
  statusCode: number
  message: string
  data: VocabularyLesson[]
}

export type QuizQuestion = {
  id: number
  partId: number
  question: string
  options?: string[]
  // Store original options order for correct answer mapping when shuffled
  originalOptions?: string[]
  type?: 'fill' | 'matching' | 'multiple_choice'
  answer: string
  explanation?: string
  // For matching type - pairs of {english, vietnamese}
  matchingPairs?: { english: string; vietnamese: string }[]
}
