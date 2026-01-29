import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { examService } from "../../../services/exam/exam.service";
import type { ExamHistoryItem } from "../../../services/exam/exam.types";

export const ExamHistoryPage = () => {
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    examService.getHistory()
      .then((res) => {
        if (res.data) setHistory(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading history...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-15">Exam History</h1>
      
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.user_lesson_id} className="bg-white rounded-lg shadow p-6 border border-white-90 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-15">{item.lesson_title}</h3>
              <div className="text-gray-30 mt-1">
                Level: <span className="font-semibold text-gray-15">{item.level_name}</span>
              </div>
              <div className="text-sm text-gray-40 mt-1">
                Completed: {new Date(item.completed_at).toLocaleString()}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
               <div className="text-2xl font-bold text-mint-50">
                 Score: {item.score.toFixed(1)}
               </div>
               <button 
                 className="px-4 py-2 bg-white border border-mint-50 text-mint-50 rounded hover:bg-white-95 transition-colors"
                 onClick={() => navigate(`/exams/review/${item.user_lesson_id}`)}
               >
                 Review Result
               </button>
            </div>
          </div>
        ))}

        {history.length === 0 && (
            <div className="text-center text-gray-500 py-8">
                No exam history found. <button onClick={() => navigate("/exams")} className="text-blue-600 hover:underline">Take an exam</button>
            </div>
        )}
      </div>
    </div>
  );
};
