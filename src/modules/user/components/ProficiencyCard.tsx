type Proficiency = {
  skill: string;
  level: number;
  color: string;
};

const PROFICIENCIES: Proficiency[] = [
  { skill: 'Reading', level: 85, color: 'from-mint-50' },
  { skill: 'Writing', level: 72, color: 'from-mint-70' },
  { skill: 'Listening', level: 68, color: 'from-mint-75' },
  { skill: 'Speaking', level: 60, color: 'from-mint-80' },
];

export const ProficiencyCard = () => {
  const proficiencies = PROFICIENCIES;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-white-90">
      <h3 className="text-xl font-bold text-gray-15 mb-6">Skill Proficiency</h3>

      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E4E4E7"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#46CE83"
              strokeWidth="8"
              strokeDasharray={`${(75 / 100) * 282.7} 282.7`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-mint-50">75%</p>
            <p className="text-sm text-gray-40">Overall</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {proficiencies.map((prof) => (
          <div key={prof.skill}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-15">{prof.skill}</span>
              <span className="text-sm font-semibold text-mint-50">{prof.level}%</span>
            </div>
            <div className="w-full h-2 bg-white-95 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${prof.color} to-mint-50`}
                style={{ width: `${prof.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
