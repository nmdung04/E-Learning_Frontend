import { authService } from "../auth/auth.service"
import type {
    SpeakingMaterialResponse,
    SpeakingTopicResponse,
    SpeakingTestMaterialResponse,
    SpeakingSentenceMaterialResponse,
    CheckResultResponse,
    ConversationTopicResponse,
    ConversationMaterialResponse
} from "./speaking.types"

export const speakingService = {
    getLearningTopics: async () => {
        const client = authService.getHttpClient()
        const res = await client.get<SpeakingTopicResponse>("/speaking/learning/topics")
        return res.data
    },
    getLearningMaterials: async (activityId: number) => {
        const client = authService.getHttpClient()
        const res = await client.get<SpeakingMaterialResponse>(`/speaking/learning/materials/${activityId}`)
        return res.data
    },
    getTestMaterials: async (activityId: number) => {
        const client = authService.getHttpClient()
        const res = await client.get<SpeakingTestMaterialResponse>(`/speaking/learning/test/materials/${activityId}`)
        return res.data
    },
    // NEW: Sentence Practice Topics
    getSentenceTopics: async () => {
        const client = authService.getHttpClient()
        const res = await client.get<SpeakingTopicResponse>("/speaking/practice/sentence/topics")
        return res.data
    },
    // NEW: Sentence Practice Materials
    getSentenceMaterials: async (activityId: number) => {
        const client = authService.getHttpClient()
        const res = await client.get<SpeakingSentenceMaterialResponse>(`/speaking/practice/sentence/materials/${activityId}`)
        return res.data
    },
    // NEW: Submit Sentence Practice
    submitSentencePractice: async (sessionId: string | number, referenceId: string | number, record: File) => {
        const client = authService.getHttpClient()
        const formData = new FormData()
        formData.append("sessionId", String(sessionId))
        formData.append("referenceId", String(referenceId))
        formData.append("record", record)

        const res = await client.post<CheckResultResponse>("/speaking/practice/sentence/submit", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data
    },
    // NEW: Conversation Topics
    getConversationTopics: async () => {
        const client = authService.getHttpClient()
        const res = await client.get<ConversationTopicResponse>("/speaking/practice/conversation/topics")
        return res.data
    },
    getConversationMaterials: async (lessonId: number) => {
        const client = authService.getHttpClient()
        const res = await client.get<ConversationMaterialResponse>(`/speaking/practice/conversation/materials/${lessonId}`)
        return res.data
    },
    checkTestResult: async (sessionId: string | number, referenceId: string | number, record: File) => {
        const client = authService.getHttpClient()
        const formData = new FormData()
        formData.append("sessionId", String(sessionId))
        formData.append("referenceId", String(referenceId))
        formData.append("record", record)

        const res = await client.post<CheckResultResponse>("/speaking/learning/test/check-result", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data
    }
}
