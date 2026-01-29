export type SpeakingTopic = {
    id: number
    activity_mode: string
    activity_kind: string
    ref_id: string
    title: string
    created_at: string
    is_completed: boolean
}

export type SpeakingTopicResponse = {
    statusCode: number
    message: string
    data: SpeakingTopic[]
}

export type SpeakingWordExample = {
    word: string
    word_transcription: string
    word_mean: string
    word_sound_url: string
}

export type SpeakingSymbol = {
    id: number
    type: string
    symbol: string
    example_word: string
    example_word_transcription: string
    symbol_sound_url: string
    note: string
    words: SpeakingWordExample[]
}

export type SpeakingMaterial = {
    activity_id: number
    symbols: SpeakingSymbol[]
}

export type SpeakingMaterialResponse = {
    statusCode: number
    message: string
    data: SpeakingMaterial
}

// Test Materials Types
export type TestWord = {
    word_id: number
    word: string
    word_transcription: string
    word_mean: string
    word_sound_url: string
}

export type TestSymbolGroup = {
    symbol_id: number
    words: TestWord[]
}

export type SpeakingTestMaterial = {
    activity_id: number
    session_id: number
    symbols: TestSymbolGroup[]
}

export type SpeakingTestMaterialResponse = {
    statusCode: number
    message: string
    data: SpeakingTestMaterial
}

// Sentence Practice Types
export type SpeakingSentence = {
    id: number
    text: string
    phonetic: string
    practice_symbol_ids: number | string
    target_words: string
    audio_url: string
    note: string
}

export type SpeakingSentenceMaterial = {
    session_id: number
    activity_id: number
    sentences: SpeakingSentence[]
}

export type SpeakingSentenceMaterialResponse = {
    statusCode: number
    message: string
    data: SpeakingSentenceMaterial
}

export type CheckResultResponse = {
    statusCode: number
    message: string
    data: {
        challenge_result: "pass" | "fail"
        challenge_score: number
        is_session_completed: boolean
    }
}

// Conversation Types
export type ConversationLesson = {
    lesson_id: number
    lesson_name: string
}

export type ConversationTopic = {
    topic_id: number
    topic_name: string
    description: string
    lessons: ConversationLesson[]
}

export type ConversationTopicResponse = {
    statusCode: number
    message: string
    data: ConversationTopic[]
}

export type ConversationQuestion = {
    id: number
    question: string
    lesson_id: number
    topic_id: number
}

export type ConversationMaterial = {
    session_id: number
    activity_id: number
    questions: ConversationQuestion[]
}

export type ConversationMaterialResponse = {
    statusCode: number
    message: string
    data: ConversationMaterial
}
