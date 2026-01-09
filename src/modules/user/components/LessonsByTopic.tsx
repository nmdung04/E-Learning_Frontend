type Topic = {
  name: string;
  lessons: number;
  completed: number;
  percentage: number;
  nextLesson: string;
  icon: string;
};

const TOPICS: Topic[] = [
  {
    name: 'Business English',
    lessons: 12,
    completed: 10,
    percentage: 83,
    nextLesson: 'Professional Email Writing',
    icon: '💼',
  },
  {
    name: 'Conversational English',
    lessons: 15,
    completed: 8,
    percentage: 53,
    nextLesson: 'Small Talk Techniques',
    icon: '💬',
  },
  {
    name: 'Grammar Essentials',
    lessons: 20,
    completed: 18,
    percentage: 90,
    nextLesson: 'Advanced Tenses',
    icon: '📖',
  },
  {
    name: 'Vocabulary Building',
    lessons: 24,
    completed: 16,
    percentage: 67,
    nextLesson: 'Idioms & Expressions',
    icon: '📚',
  },
  {
    name: 'Pronunciation Skills',
    lessons: 10,
    completed: 5,
    percentage: 50,
    nextLesson: 'Vowel Sounds',
    icon: '🎤',
  },
  {
    name: 'Listening Comprehension',
    lessons: 18,
    completed: 12,
    percentage: 67,
    nextLesson: 'Business Podcasts',
    icon: '👂',
  },
];

export const LessonsByTopic = () => {

  return (
    <div className="space-y-4">
      {TOPICS.map((topic) => (
        <div
          key={topic.name}
          className="bg-white rounded-lg shadow-md p-6 border border-white-90 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{topic.icon}</span>
              <div>
                <h4 className="text-lg font-bold text-gray-15">{topic.name}</h4>
                <p className="text-sm text-gray-40">
                  {topic.completed} of {topic.lessons} lessons completed
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-mint-50">{topic.percentage}%</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-40">Progress</span>
              <span className="text-xs font-semibold text-gray-30">
                {topic.completed}/{topic.lessons}
              </span>
            </div>
            <div className="w-full h-3 bg-white-95 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mint-50 to-mint-70 rounded-full"
                style={{ width: `${topic.percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-4 border-t border-white-90">
            <p className="text-sm text-gray-40 mb-3">
              <span className="font-semibold text-gray-15">Next Lesson:</span> {topic.nextLesson}
            </p>
            <button className="w-full px-4 py-2 bg-mint-50 text-white rounded-lg font-semibold hover:bg-mint-70 transition-colors">
              Continue Learning
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
