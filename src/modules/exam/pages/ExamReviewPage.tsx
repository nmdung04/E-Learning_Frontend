import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { examService } from "../../../services/exam/exam.service";
import type { ExamDetail, ExamReviewDetail } from "../../../services/exam/exam.types";
import { QuestionItem } from "../components/QuestionItem";

export const ExamReviewPage = () => {
  const { userLessonId } = useParams<{ userLessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [result, setResult] = useState<ExamReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  const submissionState = location.state?.submissionResult;

  useEffect(() => {
    if (!userLessonId) return;

    const fetchData = async () => {
        try {
            // 1. Get result to find lesson_id and answers
            const resultRes = await examService.getReviewDetail(Number(userLessonId));
            if (!resultRes.data) throw new Error("Result not found");
            const resultData = resultRes.data;
            setResult(resultData);

            // 2. Get exam content
            const examRes = await examService.getExamDetail(resultData.lesson_id);
            if (!examRes.data) throw new Error("Exam content not found");
            setExam(examRes.data);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [userLessonId]);

  if (loading) return <div className="p-8 text-center">Loading review...</div>;
  if (!exam || !result) return <div className="p-8 text-center text-red-500">Review data not found</div>;

  const currentPart = exam.parts[currentPartIndex];
  
  // Find result for current part
  const partResult = result.part_results.find(p => p.part_id === currentPart.part_id);
  
  // Parse answers
  // user_answer: "A,C,C,D,..."
  const userAnswers = partResult?.user_answer ? partResult.user_answer.split(",") : [];
  const correctAnswers = partResult?.correct_answer ? partResult.correct_answer.split(",") : [];

  return (
    <div className="pb-20">
      {submissionState && (
        <div className="bg-mint-80/50 border-b border-mint-50 p-4 text-center">
            <h2 className="text-2xl font-bold text-mint-75 mb-2">Exam Submitted Successfully!</h2>
            <p className="text-gray-15">You scored <span className="font-bold text-xl text-mint-50">{submissionState.score.toFixed(2)}</span></p>
            {submissionState.levelUpgraded && (
                <div className="mt-2 animate-bounce font-bold text-mint-50">
                    🎉 Congratulations! You've been upgraded to level {submissionState.newLevel}! 🎉
                </div>
            )}
        </div>
      )}

      <div className="bg-white-97 border-b border-white-90 p-4 sticky top-0 z-40">
          <div className="container mx-auto flex justify-between items-center">
              <div>
                  <h1 className="text-xl font-bold text-gray-15">{exam.title} - Review</h1>
                  <p className="text-sm text-gray-30">
                      Score: <span className="font-bold text-mint-50">{result.total_score}</span>
                  </p>
              </div>
              <button onClick={() => navigate("/exams/history")} className="text-mint-50 hover:underline">
                  Back to History
              </button>
          </div>
      </div>
      
      <div className="container mx-auto p-4 max-w-4xl mt-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-white-90">
            <h2 className="text-xl font-bold mb-4 border-b border-white-90 pb-2 text-gray-15">{currentPart.description}</h2>
            
            {partResult && (
                <div className="mb-6 p-4 bg-white-95 rounded text-sm flex gap-6">
                    <div className="text-gray-15">Part Score: <span className="font-bold text-mint-50">{partResult.score}</span></div>
                    <div className="text-gray-15">Correct: <span className="font-bold text-mint-50">{partResult.correct_answers}</span> / {partResult.total_questions}</div>
                </div>
            )}

            {currentPart.questions.map((q, qIdx) => (
                <QuestionItem 
                    key={q.question_id} 
                    question={q} 
                    selectedAnswer={userAnswers[qIdx]}
                    correctAnswer={correctAnswers[qIdx]}
                    onSelectAnswer={() => {}}
                    isReview={true}
                />
            ))}
        </div>

        <div className="flex justify-between mt-8">
            <button 
                className="px-6 py-2 bg-white-90 text-gray-30 rounded hover:bg-white-95 disabled:opacity-50"
                disabled={currentPartIndex === 0}
                onClick={() => {
                    window.scrollTo(0, 0);
                    setCurrentPartIndex(prev => prev - 1);
                }}
            >
                &larr; Previous Part
            </button>
            
            <button 
                className="px-6 py-2 bg-mint-50 text-white rounded hover:bg-mint-75 disabled:opacity-50"
                disabled={currentPartIndex >= exam.parts.length - 1}
                onClick={() => {
                    window.scrollTo(0, 0);
                    setCurrentPartIndex(prev => prev + 1);
                }}
            >
                Next Part &rarr;
            </button>
        </div>
      </div>
    </div>
  );
};
