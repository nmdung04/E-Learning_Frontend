import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Check, ArrowLeft } from "lucide-react";
import type { Part } from "@/services/grammar/types";
import ContentFactory from "@/components/grammar/ContentFactory";
import { cn } from "@/lib/utils";
import { fetchAndParseAnswers } from "@/utils/answerParser";
import { cleanUrlContent } from "@/utils/textHelpers";
import { soundEffects } from "@/utils/soundEffects";

interface Props {
  data: Part;
  onFinish: () => void;
  onBack: () => void;
}

export const FillInBlankPart = ({ data, onFinish, onBack }: Props) => {
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, { value: string; isCorrect: boolean | null; showHint: boolean }>
  >({});

  // Load đáp án từ file
  useEffect(() => {
    if (data.correct_answer_path) {
      fetchAndParseAnswers(data.correct_answer_path, "FILL_IN_BLANK").then((parsedData) => {
        if (Array.isArray(parsedData)) setCorrectAnswers(parsedData);
      });
    }
  }, [data]);

  const questions = useMemo(() => data?.questions ?? [], [data]);

  // Kiểm tra hoàn thành: Tất cả câu đều đúng
  const isCompleted = useMemo(() => {
    return (
      questions.length > 0 &&
      questions.every((q) => userAnswers[q.question_id]?.isCorrect === true)
    );
  }, [userAnswers, questions]);

  const handleInputChange = (questionId: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        value,
        isCorrect: null,
      },
    }));
  };

  const handleCheckAnswer = (questionId: number, questionNumber: number) => {
    const userValue = userAnswers[questionId]?.value?.trim().toLowerCase() || "";
    const rawCorrectAnswer = correctAnswers[questionNumber - 1] || "";
    const correctAnswer = cleanUrlContent(rawCorrectAnswer).toLowerCase();
    const isCorrect = userValue === correctAnswer;

    // Play sound effect
    if (isCorrect) {
      soundEffects.playCorrect();
    } else {
      soundEffects.playWrong();
    }

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        isCorrect,
      },
    }));
  };

  const handleShowHint = (questionId: number) => {
    soundEffects.playHint();
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        showHint: true,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Xem lại Phần 2
      </button>

      {/* Questions */}
      {questions.map((q) => {
        const userAnswer = userAnswers[q.question_id] || {
          value: "",
          isCorrect: null,
          showHint: false,
        };
        const rawCorrectAnswer = correctAnswers[q.question_number - 1] || "";
        const correctAnswer = cleanUrlContent(rawCorrectAnswer);

        const questionPrompt = q.displayOrders[0];

        return (
          <motion.div
            key={q.question_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header câu hỏi */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                  {q.question_number}
                </span>
                <h3 className="text-lg font-bold text-slate-800">Điền từ vào chỗ trống</h3>
              </div>
              {questionPrompt ? (
                <div className="text-base text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <ContentFactory displayOrder={questionPrompt} />
                </div>
              ) : (
                <p className="text-sm text-slate-500">Chưa có nội dung câu hỏi.</p>
              )}
            </div>

            {/* Input và Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={userAnswer.value}
                  onChange={(e) => handleInputChange(q.question_id, e.target.value)}
                  disabled={userAnswer.isCorrect === true}
                  placeholder="Nhập câu trả lời của bạn..."
                  className={cn(
                    "flex-1 px-4 py-3 border-2 rounded-xl text-base font-medium transition-all outline-none",
                    userAnswer.isCorrect === true
                      ? "border-green-500 bg-green-50 text-green-800 cursor-not-allowed"
                      : userAnswer.isCorrect === false
                        ? "border-red-400 bg-red-50 text-red-800"
                        : "border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  )}
                />

                {userAnswer.isCorrect === true && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-100 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-semibold text-sm">Chính xác!</span>
                  </div>
                )}

                {userAnswer.isCorrect === false && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-100 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-semibold text-sm">Sai rồi</span>
                  </div>
                )}
              </div>

              {/* Action Buttons - Chỉ hiện khi chưa kiểm tra */}
              {userAnswer.isCorrect !== true && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCheckAnswer(q.question_id, q.question_number)}
                    disabled={!userAnswer.value}
                    className={cn(
                      "flex-1 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                      userAnswer.value
                        ? "bg-primary text-white hover:scale-[1.02] shadow-md hover:shadow-lg"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {userAnswer.isCorrect === false ? "Kiểm tra lại" : "Kiểm tra đáp án"}
                  </button>

                  <button
                    onClick={() => handleShowHint(q.question_id)}
                    disabled={userAnswer.showHint}
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
                      userAnswer.showHint
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200 hover:scale-[1.02] border-2 border-amber-300"
                    )}
                  >
                    <Lightbulb className="w-5 h-5" />
                    Gợi ý
                  </button>
                </div>
              )}

              {/* Hint Box - Hiện khi click nút Gợi ý */}
              <AnimatePresence>
                {userAnswer.showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-900 text-sm mb-1">💡 Gợi ý:</p>
                        <p className="text-amber-800 text-sm">
                          Đáp án đúng là:{" "}
                          <span className="font-bold text-amber-900">{correctAnswer}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              
            </div>
          </motion.div>
        );
      })}

      {/* Celebration & Completion - Chỉ hiện khi hoàn thành HẾT */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl border-2 border-green-200 shadow-xl"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-2">🎉 Xuất sắc!</h2>
            <p className="text-green-700 text-lg mb-6">
              Bạn đã hoàn thành tất cả câu hỏi chính xác!
            </p>
            <button
              onClick={onFinish}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-3 mx-auto text-lg"
            >
              <CheckCircle2 className="w-6 h-6" />
              Hoàn thành bài học
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

