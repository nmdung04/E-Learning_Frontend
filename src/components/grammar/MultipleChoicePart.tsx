import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, Check, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import type { Part } from '@/services/grammar/types';
import ContentFactory from '@/components/grammar/ContentFactory';
import { cn } from '@/lib/utils';
import { fetchAndParseAnswers } from '@/utils/answerParser';
import { soundEffects } from '@/utils/soundEffects';

interface Props {
  data: Part;
  onComplete: (answer: string) => void;
  onBack: () => void;
}

interface QuestionState {
  selectedOption: number | null;
  isCorrect: boolean | null;
  showExplanation: boolean;
}

export const MultipleChoicePart = ({ data, onComplete, onBack }: Props) => {
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Ref để scroll về đầu trang

  const questions = useMemo(() => data?.questions ?? [], [data]);

  // Khởi tạo state cho tất cả câu hỏi
  const initialQuestionStates = useMemo(() => {
    const initialStates: Record<number, QuestionState> = {};
    questions.forEach((q) => {
      initialStates[q.question_id] = {
        selectedOption: null,
        isCorrect: null,
        showExplanation: false,
      };
    });
    return initialStates;
  }, [questions]);

  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>(initialQuestionStates);

  // Cập nhật questionStates khi questions thay đổi
  useEffect(() => {
    setQuestionStates(initialQuestionStates);
  }, [initialQuestionStates]);

  // Load đáp án từ file
  useEffect(() => {
    if (data.correct_answer_path) {
      fetchAndParseAnswers(data.correct_answer_path, 'MULTIPLE_CHOICE').then((parsedData) => {
        if (Array.isArray(parsedData)) {
          setCorrectAnswers(parsedData);
        }
      });
    }
  }, [data]);

  // Scroll về đầu trang khi component mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Kiểm tra xem tất cả câu hỏi đã được trả lời chưa
  const allAnswered = useMemo(() => {
    return questions.every((q) => questionStates[q.question_id]?.selectedOption !== null);
  }, [questions, questionStates]);

  // Tính số câu đúng
  const correctCount = useMemo(() => {
    if (!isChecked) return 0;
    return questions.filter(
      (q) => questionStates[q.question_id]?.isCorrect === true
    ).length;
  }, [questions, questionStates, isChecked]);

  // Tính điểm
  const score = Math.round((correctCount / questions.length) * 100);
  const isPerfectScore = score === 100;

  // Xử lý chọn đáp án
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isChecked) return; // Không cho đổi đáp án sau khi đã kiểm tra

    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOption: optionIndex,
        isCorrect: null,
        showExplanation: false,
      },
    }));
  };

  // Xử lý kiểm tra đáp án
  const handleCheck = () => {
    const newStates = { ...questionStates };
    let hasWrong = false;

    questions.forEach((q, index) => {
      const state = newStates[q.question_id];
      if (state.selectedOption !== null) {
        const correctAnswer = correctAnswers[index] || '';
        const optionLetter = String.fromCharCode(64 + state.selectedOption);
        const isCorrect = optionLetter === correctAnswer.toUpperCase();

        if (!isCorrect) hasWrong = true;

        newStates[q.question_id] = {
          ...state,
          isCorrect,
          // Nếu sai thì tự động hiện giải thích luôn để user học
          showExplanation: !isCorrect, 
        };
      }
    });

    setQuestionStates(newStates);
    setIsChecked(true);

    if (!hasWrong) {
      soundEffects.playCorrect();
    } else {
      soundEffects.playWrong();
    }
  };

  // Xử lý làm lại (Reset)
  const handleRetry = () => {
    setQuestionStates(initialQuestionStates);
    setIsChecked(false);
    
    // Scroll về đầu trang sau khi reset
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  // Xử lý hiển thị giải thích thủ công
  const handleShowExplanation = (questionId: number) => {
    soundEffects.playHint();
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        showExplanation: true,
      },
    }));
  };

  // Xử lý hoàn thành (Chỉ gọi khi đúng hết)
  const handleComplete = () => {
    if (!isPerfectScore) return;

    const answerString = questions
      .map((q) => {
        const state = questionStates[q.question_id];
        if (state && state.selectedOption) {
          return String.fromCharCode(64 + state.selectedOption);
        }
        return "";
      })
      .join("");

    console.log("📤 Chuỗi đáp án gửi lên server:", answerString);
    onComplete(answerString);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Chưa có câu hỏi trắc nghiệm.</p>
      </div>
    );
    
  }
  

  return (
    <div  ref={containerRef}
          className="max-w-4xl mx-auto py-6 space-y-6 scroll-mt-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Xem lại Phần {data.part_number - 1}
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Phần {data.part_number}: Trắc nghiệm
        </h3>
        <p className="text-slate-500 text-sm">
          Chọn đáp án đúng cho mỗi câu hỏi. Bạn cần đạt 100% để hoàn thành.
        </p>
        
        {isChecked && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-full border-2",
              isPerfectScore 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-amber-50 border-amber-200 text-amber-700"
            )}
          >
            {isPerfectScore ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Xuất sắc! 100/100 điểm</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span className="font-bold">Bạn đạt {score}/100 điểm. Hãy thử lại!</span>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Questions */}
      {questions.map((question, qIndex) => {
        const state = questionStates[question.question_id] || {
          selectedOption: null,
          isCorrect: null,
          showExplanation: false,
        };

        const questionPrompt = question.displayOrders[0];
        const options = question.displayOrders.slice(1);
        
        // Lấy đáp án đúng của câu hiện tại (A, B, C...)
        const correctAnswerLetter = correctAnswers[qIndex] || ''; 

        return (
          <motion.div
            key={question.question_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qIndex * 0.1 }}
            className={cn(
              'bg-white p-6 rounded-2xl border-2 shadow-sm transition-all',
              state.isCorrect === true
                ? 'border-green-400 shadow-green-100'
                : state.isCorrect === false
                  ? 'border-red-400 shadow-red-100'
                  : 'border-slate-200 hover:shadow-md'
            )}
          >
            {/* Question Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#46ce83] to-[#3ab56f] text-white font-bold flex items-center justify-center text-sm shadow-md flex-shrink-0">
                {question.question_number}
              </div>
              <div className="flex-1">
                {questionPrompt ? (
                  <div className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <ContentFactory displayOrder={questionPrompt} />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Chưa có nội dung câu hỏi.</p>
                )}
              </div>

              {/* Status Icon */}
              {state.isCorrect === true && (
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              )}
              {state.isCorrect === false && (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              )}
            </div>

            {/* Options */}
            <div className="space-y-2 ml-11">
              {options.map((option, optionIndex) => {
                const actualIndex = optionIndex + 1;
                const isSelected = state.selectedOption === actualIndex;
                const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
                
                // Logic kiểm tra xem đây có phải là đáp án đúng không
                const isThisTheCorrectAnswer = optionLetter === correctAnswerLetter;

                // Xác định style cho từng trạng thái
                let optionStyle = 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'; // Mặc định
                let circleStyle = 'bg-slate-100 text-slate-700 group-hover:bg-blue-500 group-hover:text-white'; // Mặc định

                if (isChecked) {
                  if (isSelected) {
                    // Người dùng chọn câu này
                    if (state.isCorrect) {
                      // Chọn ĐÚNG
                      optionStyle = 'border-green-500 bg-green-50 ring-1 ring-green-500';
                      circleStyle = 'bg-green-500 text-white';
                    } else {
                      // Chọn SAI
                      optionStyle = 'border-red-500 bg-red-50';
                      circleStyle = 'bg-red-500 text-white';
                    }
                  } else if (isThisTheCorrectAnswer) {
                    // Người dùng không chọn câu này, NHƯNG đây là đáp án đúng -> Highlight lên
                    optionStyle = 'border-green-400 bg-white ring-green-200';
                    circleStyle = 'bg-green-100 text-green-700 font-bold border border-green-300';
                  } else {
                    // Các câu còn lại (không chọn và cũng không đúng) -> Làm mờ đi
                    optionStyle = 'border-slate-200 bg-slate-50 opacity-60';
                  }
                } else if (isSelected) {
                  // Đang chọn (chưa check)
                  optionStyle = 'border-blue-500 bg-blue-50';
                  circleStyle = 'bg-blue-500 text-white';
                }

                return (
                  <motion.button
                    key={option.display_order_id}
                    onClick={() => handleSelectOption(question.question_id, actualIndex)}
                    disabled={isChecked}
                    whileHover={!isChecked ? { scale: 1.01 } : {}}
                    whileTap={!isChecked ? { scale: 0.99 } : {}}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3 group relative overflow-hidden',
                      optionStyle,
                      isChecked && 'cursor-default'
                    )}
                  >
                    <span
                      className={cn(
                        'w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors',
                        circleStyle
                      )}
                    >
                      {optionLetter}
                    </span>
                    <span className="flex-1 text-sm text-slate-800">
                      <ContentFactory displayOrder={option} />
                    </span>
                    
                    {/* Icon chỉ dẫn kết quả */}
                    {isChecked && isSelected && state.isCorrect === true && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {isChecked && isSelected && state.isCorrect === false && (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-14 mt-4"
                >
                  {state.showExplanation ? (
                    <div className={cn(
                      "p-4 border-2 rounded-xl",
                      state.isCorrect ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                    )}>
                      <div className="flex items-start gap-3">
                        <Lightbulb className={cn("w-5 h-5 flex-shrink-0 mt-0.5", state.isCorrect ? "text-green-600" : "text-amber-600")} />
                        <div>
                          <h4 className={cn("font-bold mb-2", state.isCorrect ? "text-green-900" : "text-amber-900")}>
                            Giải thích:
                          </h4>
                          <p className={cn("text-sm whitespace-pre-wrap", state.isCorrect ? "text-green-800" : "text-amber-800")}>
                            {questionPrompt?.description || 'Chưa có giải thích cho câu này.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleShowExplanation(question.question_id)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all text-sm"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Xem giải thích
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Action Buttons Area */}
      <div className="bottom-4 z-10 flex flex-col items-center gap-3 pt-4 pb-2">
        {/* Trường hợp 1: Chưa bấm Check */}
        {!isChecked && (
          <button
            onClick={handleCheck}
            disabled={!allAnswered}
            className={cn(
              'flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg max-w-sm justify-center',
              allAnswered
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 hover:scale-105 hover:shadow-xl'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            )}
          >
            <Check className="w-6 h-6" />
            Kiểm tra đáp án
          </button>
        )}

        {/* Trường hợp 2: Đã Check và Đúng hết (100%) */}
        {isChecked && isPerfectScore && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleComplete}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all shadow-lg hover:shadow-xl w-full max-w-sm justify-center"
          >
            <CheckCircle2 className="w-6 h-6" />
            Nộp bài
          </motion.button>
        )}

        {/* Trường hợp 3: Đã Check nhưng chưa đúng hết (<100%) */}
        {isChecked && !isPerfectScore && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center gap-2 w-full"
          >
             <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium shadow-sm mb-2">
                Bạn cần trả lời đúng tất cả câu hỏi để nộp bài.
             </div>
             
             <button
              onClick={handleRetry }
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
              Làm lại bài tập
            </button>
          </motion.div>
        )}
      </div>

      {/* Progress Info Footer */}
      {!isChecked && (
        <div className="text-center text-sm text-slate-500 pb-8">
          Đã trả lời: <span className="font-bold text-slate-700">{questions.filter((q) => questionStates[q.question_id]?.selectedOption !== null).length}</span>
          <span className="mx-1">/</span>
          {questions.length} câu
        </div>
      )}
    </div>
  );
};

export default MultipleChoicePart;
