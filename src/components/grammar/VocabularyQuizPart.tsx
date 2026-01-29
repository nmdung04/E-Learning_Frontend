import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ArrowRight, RotateCcw, CheckCircle } from "lucide-react";
import OptionButton from "./OptionButton";
import ContentFactory from "@/components/grammar/ContentFactory";
import type { Part } from "@/services/grammar/types";
import { cn } from "@/lib/utils";
import { fetchAndParseAnswers } from "@/utils/answerParser";
import { cleanUrlContent } from "@/utils/textHelpers";

interface Props {
  data: Part;
  onNext: () => void;
}

export const VocabularyQuizPart = ({ data, onNext }: Props) => {
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]); // Mảng chứa ["D", "C", "B"...]
  const [userAnswers, setUserAnswers] = useState<Record<number, { selectedLabel: string, isCorrect: boolean }>>({});
  const topRef = useRef<HTMLDivElement>(null);
  
  // 1. Tải đáp án ngay khi Component được mount
  useEffect(() => {
    if (data.correct_answer_path) {
      fetchAndParseAnswers(data.correct_answer_path, "MULTIPLE_CHOICE")
        .then((parsedData) => {
          if (Array.isArray(parsedData)) setCorrectAnswers(parsedData);
        });
    }
  }, [data]);

  // Logic kiểm tra xem đã xong hết chưa
  const questions = useMemo(() => data?.questions ?? [], [data]);

  const answeredCount = useMemo(() => {
    return Object.keys(userAnswers).length;
  }, [userAnswers]);

  const correctCount = useMemo(() => {
    return Object.values(userAnswers).filter(a => a.isCorrect).length;
  }, [userAnswers]);

  const allAnswered = useMemo(() => {
    return questions.length > 0 && answeredCount === questions.length;
  }, [answeredCount, questions.length]);

  const isCompleted = useMemo(() => {
    return questions.length > 0 && questions.every((q) => userAnswers[q.question_id]?.isCorrect);
  }, [userAnswers, questions]);

  const handleSelect = (questionId: number, selectedLabel: string, correctLabel: string) => {
    if (userAnswers[questionId]) return; // Không cho chọn lại
    const isCorrect = selectedLabel === correctLabel;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: { selectedLabel, isCorrect }
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8" ref={topRef}>
      {data.questions.map((q) => {
        const userAnswer = userAnswers[q.question_id];
        // Lấy đáp án đúng theo question_number (1-indexed) 
        const correctLabel = correctAnswers[q.question_number - 1] || "";
        
        const questionPrompt = q.displayOrders[0]; // Item đầu là câu hỏi
        const options = q.displayOrders.slice(1, 5); // 4 options tiếp theo

        return (
          <motion.div 
            key={q.question_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            {/* 1. Câu nhận định */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Câu {q.question_number}</h3>
              {questionPrompt ? (
                <div className="text-lg font-medium text-primary">
                  <ContentFactory displayOrder={questionPrompt} />
                </div>
              ) : (
                <p className="text-sm text-slate-500">Chưa có nội dung câu hỏi.</p>
              )}
            </div>

            {/* 2. 4 Button đáp án */}
            <div className="grid gap-3">
              {options.map((opt, idx) => {
                const label = String.fromCharCode(65 + idx); // A, B, C, D
                const rawText = 
                            (typeof opt.content_path === "string" ? opt.content_path : "") ||
                            opt.description || 
                            "Nội dung đáp án";
                const text = cleanUrlContent(rawText);
                
                let status: 'idle' | 'correct' | 'wrong' | 'disabled' = 'idle';
                
                if (userAnswer) {
                  if (label === correctLabel) {
                    status = 'correct'; // Đáp án đúng luôn hiển thị màu xanh
                  } else if (label === userAnswer.selectedLabel) {
                    status = userAnswer.isCorrect ? 'correct' : 'wrong'; // Đáp án user chọn
                  } else {
                    status = 'disabled'; // Các đáp án khác
                  }
                }

                return (
                  <OptionButton
                    key={opt.display_order_id}
                    label={label}
                    text={text}
                    status={status}
                    onClick={() => handleSelect(q.question_id, label, correctLabel)} 
                  />
                );
              })}
            </div>

            {/* 3. Giải thích */}
            <AnimatePresence>
              {userAnswer && !userAnswer.isCorrect && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3"
                >
                  <Info className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-orange-800 text-sm">Giải thích:</p>
                    <p className="text-orange-700 text-sm mt-1">
                      {q.description || "Hãy xem lại ngữ cảnh của từ này nhé."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Summary khi đã trả lời hết - Đặt sau câu hỏi cuối */}
      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-3xl border-2 border-indigo-200 shadow-xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-1">Kết quả làm bài</h3>
                <p className="text-indigo-700 text-lg">
                  Bạn đã trả lời đúng <span className="font-bold text-2xl text-purple-600">{correctCount}/{questions.length}</span> câu
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-300 rounded-2xl font-bold hover:bg-indigo-50 hover:scale-105 transition-all shadow-md hover:shadow-xl"
            >
              <RotateCcw className="w-5 h-5" />
              Làm lại
            </button>
          </div>
        </motion.div>
      )}

      {/* Nút Next */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onNext}
          disabled={!isCompleted}
          className={cn(
            "px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all",
            isCompleted 
              ? "bg-primary text-white hover:scale-105 shadow-lg" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
            Qua Phần 2 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
