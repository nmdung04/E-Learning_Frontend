import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "../../../services/exam/exam.service";
import type { ExamDetail, SubmitAnswer } from "../../../services/exam/exam.types";
import { ExamAudioPlayer } from "../components/ExamAudioPlayer";
import { QuestionItem } from "../components/QuestionItem";

const IMAGE_PREFIX = "https://e-learn-backend.s3.ap-southeast-2.amazonaws.com/";

export const ExamTakingPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  
  // partId -> { questionIndex (0-based) -> "A"|"B"|"C"|"D" }
  const [userAnswers, setUserAnswers] = useState<Record<number, Record<number, string>>>({}); 

  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    // We removed the synchronous restoration here to move it after data load
    // so we can validate the partIndex.

    examService.getExamDetail(Number(lessonId))
      .then((res) => {
        if (res.data) {
            setExam(res.data);
            
            // Load progress from local storage AND validate against loaded exam
            const savedProgress = localStorage.getItem(`exam_progress_${lessonId}`);
            if (savedProgress) {
                try {
                    const parsed = JSON.parse(savedProgress);
                    setUserAnswers(parsed.answers || {});
                    
                    // Validate partIndex
                    let restoredIndex = parsed.partIndex || 0;
                    if (res.data.parts && restoredIndex >= res.data.parts.length) {
                        restoredIndex = 0;
                    }
                    setCurrentPartIndex(restoredIndex);
                } catch (e) {
                    console.error("Failed to load progress", e);
                }
            }

            // Find audio
            let foundAudio = null;
            if (res.data.parts) {
                for (const part of res.data.parts) {
                    if (part.questions) {
                        for (const q of part.questions) {
                            if (q.displayOrders) {
                                const audioContent = q.displayOrders.find(d => d.content_type === "AUDIO");
                                if (audioContent) {
                                    foundAudio = audioContent.content_path;
                                    break;
                                }
                            }
                        }
                    }
                    if (foundAudio) break;
                }
            }
            
            if (foundAudio) {
                 setAudioSrc(foundAudio.startsWith("http") ? foundAudio : `${IMAGE_PREFIX}${foundAudio.trim()}`);
            }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Save progress
  useEffect(() => {
    if (lessonId) {
        localStorage.setItem(`exam_progress_${lessonId}`, JSON.stringify({
            answers: userAnswers,
            partIndex: currentPartIndex
        }));
    }
  }, [userAnswers, currentPartIndex, lessonId]);

  const handleSelectAnswer = (partId: number, questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({
        ...prev,
        [partId]: {
            ...(prev[partId] || {}),
            [questionIndex]: answer
        }
    }));
  };

  const handleSubmit = async () => {
    if (!exam || !lessonId) return;
    
    // Construct payload
    // Map each question to an answer char or space
    const payloadAnswers: SubmitAnswer[] = exam.parts.map(part => {
        const partAnswers = userAnswers[part.part_id] || {};
        
        // We need to ensure we map strictly to the question array order
        const chars = part.questions.map((_, qIdx) => {
            return partAnswers[qIdx] || " "; 
        });
        
        return {
            part_id: part.part_id,
            answer: chars.join("")
        };
    });

    const payload = {
        lesson_id: Number(lessonId),
        answers: payloadAnswers
    };

    try {
        const res = await examService.submitExam(payload);
        if (res) {
            // Clear local storage
            localStorage.removeItem(`exam_progress_${lessonId}`);
            
            // Navigate to review page with result state
            navigate(`/exams/review/${res.user_lesson_id}`, { 
                state: { 
                    submissionResult: {
                        score: res.total_score,
                        levelUpgraded: res.level_upgraded,
                        newLevel: res.new_level
                    }
                } 
            });
        }
    } catch (e) {
        console.error(e);
        alert("Failed to submit exam. Please try again.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading exam...</div>;
  if (!exam) return <div className="p-8 text-center text-red-500">Exam not found</div>;

  const currentPart = exam.parts[currentPartIndex];

  return (
    <div className="pb-20">
      {audioSrc && <ExamAudioPlayer src={audioSrc} />}
      
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-15">{exam.title}</h1>
            <div className="text-gray-40 font-medium">Part {currentPartIndex + 1} / {exam.parts.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-white-90">
            <h2 className="text-xl font-bold mb-4 border-b border-white-90 pb-2 text-gray-15">{currentPart.description}</h2>
            
            {currentPart.questions.map((q, qIdx) => (
                <QuestionItem 
                    key={q.question_id} 
                    question={q} 
                    selectedAnswer={userAnswers[currentPart.part_id]?.[qIdx]}
                    onSelectAnswer={(ans) => handleSelectAnswer(currentPart.part_id, qIdx, ans)}
                />
            ))}
        </div>

        <div className="flex justify-between mt-8">
            <button 
                className="px-6 py-2 bg-white-90 text-gray-30 rounded hover:bg-white-95 disabled:opacity-50 transition-colors"
                disabled={currentPartIndex === 0}
                onClick={() => {
                    window.scrollTo(0, 0);
                    setCurrentPartIndex(prev => prev - 1);
                }}
            >
                &larr; Previous Part
            </button>
            
            {currentPartIndex < exam.parts.length - 1 ? (
                <button 
                    className="px-6 py-2 bg-mint-50 text-white rounded hover:bg-mint-75 transition-colors"
                    onClick={() => {
                        window.scrollTo(0, 0);
                        setCurrentPartIndex(prev => prev + 1);
                    }}
                >
                    Next Part &rarr;
                </button>
            ) : (
                <button 
                    className="px-8 py-2 bg-mint-50 text-white rounded hover:bg-mint-75 font-bold shadow-lg transition-colors"
                    onClick={handleSubmit}
                >
                    Submit Exam
                </button>
            )}
        </div>
        
        {/* Allow submit anytime */}
        {currentPartIndex < exam.parts.length - 1 && (
             <div className="mt-6 text-right">
                <button 
                    className="text-red-500 hover:text-red-700 hover:underline text-sm font-medium"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to submit now? Unanswered questions will be marked as incorrect.")) {
                            handleSubmit();
                        }
                    }}
                >
                    Submit Exam Now
                </button>
             </div>
        )}
      </div>
    </div>
  );
};
