import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { examService } from "../../../services/exam/exam.service";
import type { ExamLesson } from "../../../services/exam/exam.types";

export const ExamListPage = () => {
  const [lessons, setLessons] = useState<ExamLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    examService.getLessons()
      .then((res) => {
        if (res.data) setLessons(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Group lessons by level
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const level = lesson.level_name || "Unknown";
    if (!acc[level]) acc[level] = [];
    acc[level].push(lesson);
    return acc;
  }, {} as Record<string, ExamLesson[]>);

  // Sort levels (A1, A2, B1, B2, C1, C2)
  const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const sortedLevels = Object.keys(groupedLessons).sort(
    (a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b)
  );

  if (loading) return <div className="p-8 text-center">Loading exams...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-15">Examination</h1>
      
      {sortedLevels.map((level) => (
        <div key={level} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-mint-50">{level} Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedLessons[level].map((lesson) => (
              <div 
                key={lesson.lesson_id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-white-90 hover:border-mint-50"
                onClick={() => navigate(`/exams/${lesson.lesson_id}`)}
              >
                <h3 className="text-xl font-bold mb-2 text-gray-15">{lesson.title}</h3>
                <p className="text-gray-30 mb-4">{lesson.description}</p>
                <div className="flex justify-between items-center">
                   <span className="px-3 py-1 bg-mint-80 text-gray-20 rounded-full text-sm font-medium">
                     {lesson.level_name}
                   </span>
                   <button className="text-mint-50 hover:text-mint-75 font-medium flex items-center gap-1">
                     Start Test &rarr;
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {lessons.length === 0 && (
        <div className="text-center text-gray-500">No exams available at the moment.</div>
      )}
    </div>
  );
};
