type WordStat = {
  category: string;
  count: number;
  completed: boolean;
};

const WORD_STATS: WordStat[] = [
  { category: 'Business', count: 85, completed: true },
  { category: 'Travel', count: 62, completed: true },
  { category: 'Technology', count: 58, completed: false },
  { category: 'Health & Fitness', count: 45, completed: false },
  { category: 'Food & Cooking', count: 38, completed: false },
  { category: 'Entertainment', count: 54, completed: true },
];

const MAX_WORD_COUNT = Math.max(...WORD_STATS.map((s) => s.count));

export const WordsLearned = () => {

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-white-90">
      <h3 className="text-xl font-bold text-gray-15 mb-6">Words Learned by Category</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WORD_STATS.map((stat) => (
          <div
            key={stat.category}
            className={`p-4 rounded-lg border transition-all ${
              stat.completed
                ? 'bg-mint-50/5 border-mint-50/30 hover:bg-mint-50/10'
                : 'bg-white-95 border-white-90 hover:bg-white-97'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-15">{stat.category}</h4>
              {stat.completed && <span className="text-lg">✓</span>}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-mint-50">{stat.count}</p>
              <div className="flex-1 h-2 bg-white-90 rounded-full ml-4 overflow-hidden">
                <div
                  className="h-full bg-mint-50"
                  style={{ width: `${(stat.count / MAX_WORD_COUNT) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-40 mt-2">
              {stat.completed ? 'Mastered' : 'In Progress'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white-90 bg-mint-50/5 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-40">Total words in vocabulary</span>
          <span className="text-xl font-bold text-mint-50">342 words</span>
        </div>
        <p className="text-sm text-gray-40">
          You're making great progress! Keep learning to expand your vocabulary.
        </p>
      </div>
    </div>
  );
};
