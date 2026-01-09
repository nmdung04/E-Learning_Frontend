type LearningHistoryItem = {
  date: string;
  topic: string;
  lesson: string;
  duration: number;
  wordsLearned: number;
  completed: boolean;
};

const HISTORY: LearningHistoryItem[] = [
  {
    date: '2024-01-08',
    topic: 'Business English',
    lesson: 'Professional Email Writing',
    duration: 45,
    wordsLearned: 12,
    completed: true,
  },
  {
    date: '2024-01-07',
    topic: 'Conversational English',
    lesson: 'Small Talk Techniques',
    duration: 30,
    wordsLearned: 8,
    completed: true,
  },
  {
    date: '2024-01-07',
    topic: 'Grammar Essentials',
    lesson: 'Past Perfect Tense',
    duration: 50,
    wordsLearned: 5,
    completed: true,
  },
  {
    date: '2024-01-06',
    topic: 'Vocabulary Building',
    lesson: 'Common Phrasal Verbs',
    duration: 35,
    wordsLearned: 15,
    completed: true,
  },
  {
    date: '2024-01-05',
    topic: 'Pronunciation Skills',
    lesson: 'Vowel Sounds',
    duration: 25,
    wordsLearned: 3,
    completed: false,
  },
  {
    date: '2024-01-05',
    topic: 'Listening Comprehension',
    lesson: 'Business Podcasts',
    duration: 60,
    wordsLearned: 20,
    completed: true,
  },
  {
    date: '2024-01-04',
    topic: 'Business English',
    lesson: 'Meeting Discussions',
    duration: 40,
    wordsLearned: 10,
    completed: true,
  },
  {
    date: '2024-01-03',
    topic: 'Vocabulary Building',
    lesson: 'Technology Vocabulary',
    duration: 45,
    wordsLearned: 18,
    completed: true,
  },
];

const GROUPED_BY_DATE = HISTORY.reduce<Record<string, LearningHistoryItem[]>>((acc, item) => {
  (acc[item.date] ??= []).push(item);
  return acc;
}, {});

const ORDERED_DATES = Object.keys(GROUPED_BY_DATE).sort((a, b) => b.localeCompare(a));

export const LearningHistory = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const formatDate = (dateStr: string) => {
    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {ORDERED_DATES.map((date) => (
        <div key={date}>
          <h4 className="font-bold text-gray-15 mb-3 flex items-center gap-2">
            <span className="text-mint-50">📅</span>
            {formatDate(date)}
          </h4>
          <div className="space-y-3 ml-4 border-l-2 border-mint-50/20 pl-4">
            {GROUPED_BY_DATE[date].map((item) => (
              <div
                key={`${item.date}-${item.topic}-${item.lesson}`}
                className={`p-4 rounded-lg border transition-all ${
                  item.completed
                    ? 'bg-mint-50/5 border-mint-50/30'
                    : 'bg-white-95 border-white-90'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-15">{item.lesson}</p>
                    <p className="text-sm text-gray-40">{item.topic}</p>
                  </div>
                  {item.completed && <span className="text-lg">✓</span>}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-40">
                  <span>⏱️ {item.duration} min</span>
                  <span>📝 {item.wordsLearned} words</span>
                  <span
                    className={`font-semibold ${
                      item.completed ? 'text-mint-50' : 'text-orange-400'
                    }`}
                  >
                    {item.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
