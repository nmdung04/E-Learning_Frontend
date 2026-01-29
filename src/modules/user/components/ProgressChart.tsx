type WeeklyDatum = {
  day: string;
  minutes: number;
  lessons: number;
};

const WEEKLY_DATA: WeeklyDatum[] = [
  { day: 'Mon', minutes: 45, lessons: 2 },
  { day: 'Tue', minutes: 60, lessons: 3 },
  { day: 'Wed', minutes: 30, lessons: 1 },
  { day: 'Thu', minutes: 75, lessons: 3 },
  { day: 'Fri', minutes: 50, lessons: 2 },
  { day: 'Sat', minutes: 90, lessons: 4 },
  { day: 'Sun', minutes: 40, lessons: 2 },
];

const MAX_MINUTES = Math.max(...WEEKLY_DATA.map((d) => d.minutes));
const TOTAL_MINUTES = WEEKLY_DATA.reduce((acc, d) => acc + d.minutes, 0);
const TOTAL_LESSONS = WEEKLY_DATA.reduce((acc, d) => acc + d.lessons, 0);
const AVERAGE_MINUTES = Math.round(TOTAL_MINUTES / WEEKLY_DATA.length);

export const ProgressChart = () => {

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-white-90">
      <h3 className="text-xl font-bold text-gray-15 mb-6">Weekly Learning Activity</h3>

      <div className="flex items-end justify-between h-64 gap-3 mb-6 px-2">
        {WEEKLY_DATA.map((data) => (
          <div key={data.day} className="flex flex-col items-center flex-1">
            <div className="flex items-end justify-center h-56 w-full mb-3">
              <div
                className="w-full bg-linear-to-t from-mint-50 to-mint-70 rounded-t-lg transition-all hover:from-mint-70 hover:to-mint-75 cursor-pointer group relative"
                style={{
                  height: `${(data.minutes / MAX_MINUTES) * 100}%`,
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-15 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {data.minutes} min
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-15">{data.day}</p>
            <p className="text-xs text-gray-40">{data.lessons}L</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 pt-6 border-t border-white-90">
        <div>
          <p className="text-sm text-gray-40">Total Minutes</p>
          <p className="text-2xl font-bold text-mint-50">{TOTAL_MINUTES}</p>
        </div>
        <div>
          <p className="text-sm text-gray-40">Total Lessons</p>
          <p className="text-2xl font-bold text-mint-50">{TOTAL_LESSONS}</p>
        </div>
        <div>
          <p className="text-sm text-gray-40">Average/Day</p>
          <p className="text-2xl font-bold text-mint-50">{AVERAGE_MINUTES} min</p>
        </div>
      </div>
    </div>
  );
};
