type Stat = {
  label: string;
  value: string;
  icon: string;
  progress: number;
};

const STATS: Stat[] = [
  { label: 'Total Words Learned', value: '342', icon: '📚', progress: 68 },
  { label: 'Lessons Completed', value: '28', icon: '✅', progress: 56 },
  { label: 'Study Days', value: '45', icon: '📅', progress: 75 },
  { label: 'Current Streak', value: '7', icon: '🔥', progress: 35 },
];

export const StatsOverview = () => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md p-6 border border-white-90 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-40 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-15">{stat.value}</p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
          <div className="h-1 bg-white-95 rounded-full overflow-hidden">
            <div
              className="h-full bg-mint-50"
              style={{ width: `${stat.progress}%` }}
              role="progressbar"
              aria-valuenow={stat.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${stat.label} progress`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
