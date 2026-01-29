import { authService } from '../auth/auth.service'
import type { VocabularyTopicsResponse, LessonResponse, VocabularyLessonsResponse } from './vocabulary.types'

// Types for quiz submission
export type QuizAnswer = {
  part_id: number
  answer: string
}

export type QuizSubmitRequest = {
  lesson_id: number
  answers: QuizAnswer[]
}

export type PartResult = {
  part_id: number
  part_number: number
  total_questions: number
  correct_answers: number
  score: number
  correct_answer: string
  user_answer: string
}

export type QuizSubmitResponse = {
  statusCode: number
  message: string
  data: {
    user_lesson_id: number
    lesson_id: number
    lesson_title: string
    status: string
    total_score: number
    part_results: PartResult[]
    completed_at: string
  }
}

// Types for new words API
export type NewWordEntry = {
  word_vi: string
  cefr: string
  phonetic: string
  audio: string
  class: string
  definition_en: string
  definition_vi: string
  example: string
}

export type NewWord = {
  wordKey: string
  word: string
  topics: string[]
  entries: NewWordEntry[]
}

export type NewWordsResponse = {
  statusCode: number
  message: string
  data: NewWord[]
}

// Types for word answer submission
export type WordAnswerRequest = {
  wordKey: string
  quality: number
}

export type WordAnswerResponse = {
  statusCode: number
  message: string
  data: {
    id: number
    userId: number
    wordKey: string
    easeFactor: number
    interval: number
    repetition: number
    nextReview: string
    lastReview: string
    wrongCount: number
    status: number
  }
}

export const vocabularyService = {
  getTopics: async (): Promise<VocabularyTopicsResponse> => {
    const client = authService.getHttpClient()
    const response = await client.get<VocabularyTopicsResponse>('/vocabs/topics')
    return response.data
  },
  getLessons: async (): Promise<VocabularyLessonsResponse> => {
    const client = authService.getHttpClient()
    const response = await client.get<VocabularyLessonsResponse>('/vocabs/lessons')
    return response.data
  },
  getLesson: async (lessonId: number): Promise<LessonResponse> => {
    const client = authService.getHttpClient()
    const response = await client.get<LessonResponse>(`/vocabs/lessons/${lessonId}`)
    return response.data
  },
  submitQuiz: async (data: QuizSubmitRequest): Promise<QuizSubmitResponse> => {
    const client = authService.getHttpClient()
    const response = await client.post<QuizSubmitResponse>('/vocabs/lessons/submit', data)
    return response.data
  },
  getNewWords: async (topic: string, level?: string, limit: number = 10): Promise<NewWordsResponse> => {
    const client = authService.getHttpClient()
    const params = new URLSearchParams({
      topic,
      limit: limit.toString(),
    })
    if (level) {
      params.append('level', level)
    }
    const response = await client.get<NewWordsResponse>(`/vocabs/new-words?${params.toString()}`)
    return response.data
  },
  submitWordAnswer: async (data: WordAnswerRequest): Promise<WordAnswerResponse> => {
    const client = authService.getHttpClient()
    const response = await client.post<WordAnswerResponse>('/vocabs/answer', data)
    return response.data
  },
  getCorrectAnswers: async (filePath: string): Promise<string> => {
    const client = authService.getHttpClient()
    // File path is relative, need to construct full URL
    // Try different possible endpoints:
    // 1. Direct file path under API base
    // 2. File endpoint under /vocabs/files/ or similar
    // 3. Full URL if provided

    let url: string
    if (filePath.startsWith('http')) {
      url = filePath
    } else {
      // Try common file serving patterns
      // Option 1: Direct under API base
      url = `${client.defaults.baseURL}/${filePath}`
    }

    try {
      const response = await client.get<string>(url, {
        responseType: 'text',
      })
      return response.data
    } catch (error) {
      // If direct path fails, try alternative endpoint
      if (!filePath.startsWith('http')) {
        const altUrl = `${client.defaults.baseURL}/vocabs/files/${filePath}`
        const response = await client.get<string>(altUrl, {
          responseType: 'text',
        })
        return response.data
      }
      throw error
    }
  },
}

export type VocabularyService = typeof vocabularyService
