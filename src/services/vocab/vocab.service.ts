import axios, { AxiosHeaders } from "axios";
import { readAccessToken } from "@/services/auth/tokenStorage";

export type TopicSummary = {
  name: string;
  totalWords: number;
  learnedCount: number;
  progressPercentage: number;
};

export type VocabEntry = {
  word_vi?: string;
  definition_vi?: string;
  definition_en?: string;
  phonetic?: string;
  audio?: string;
  example?: string;
  class?: string;
  cefr?: string;
};

export type WordItem = {
  word: string;
  wordKey: string;
  topics?: string[];
  entries?: VocabEntry[];
};

export type ReviewItem = {
  id: number;
  userId?: number;
  wordKey: string;
  easeFactor?: number;
  interval?: number;
  repetition?: number;
  nextReview?: string;
  lastReview?: string;
  wrongCount?: number;
  status?: number;
  detail?: {
    word?: string;
    topics?: string[];
  };
  entries?: VocabEntry[];
};

const client = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = readAccessToken();
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else if (config.headers) {
      const merged = { ...Object(config.headers), Authorization: `Bearer ${token}` };
      config.headers = new AxiosHeaders(merged);
    } else {
      config.headers = new AxiosHeaders({ Authorization: `Bearer ${token}` });
    }
  }
  return config;
});

const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const { data } = await client.get(url, { params });
  // APIs return { statusCode, message, data }; normalize to data
  return (data?.data ?? data) as T;
};

const post = async <T>(url: string, body: unknown): Promise<T> => {
  const { data } = await client.post(url, body);
  return (data?.data ?? data) as T;
};

export const vocabService = {
  async getTopics(): Promise<TopicSummary[]> {
    return get<TopicSummary[]>("/vocabs/topics");
  },

  async getNewWords(params: { topic?: string; level?: string; limit?: number }): Promise<WordItem[]> {
    return get<WordItem[]>("/vocabs/new-words", params);
  },

  async getReviewDeck(params: { topic?: string }): Promise<ReviewItem[]> {
    return get<ReviewItem[]>("/vocabs/review-deck", params);
  },

  async submitAnswer(payload: { wordKey: string; quality: number }) {
    return post<ReviewItem>("/vocabs/answer", payload);
  },
};
