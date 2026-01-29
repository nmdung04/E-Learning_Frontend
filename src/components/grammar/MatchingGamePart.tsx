import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Part } from '@/services/grammar/types';
import { cn, shuffleArray } from '@/lib/utils';
import { fetchAndParseAnswers } from '@/utils/answerParser';
import { cleanUrlContent, detectLanguage, normalizeText } from '@/utils/textHelpers';
import { soundEffects } from '@/utils/soundEffects';

interface CardItem {
  id: string;
  text: string;
  type: 'en' | 'vi';
}

interface Props {
  data: Part;
  onFinish: () => void;
  onBack: () => void;
}

export const MatchingGamePart = ({ data, onFinish, onBack }: Props) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedTexts, setMatchedTexts] = useState<string[]>([]); // Lưu text của các thẻ đã match
  const [isProcessing, setIsProcessing] = useState(false);
  const [answerMap, setAnswerMap] = useState<Record<string, string>>({}); // Map từ file answer

  // 1. Load answer file và khởi tạo cards
  useEffect(() => {
    const initializeGame = async () => {
      if (!data?.questions || !data.correct_answer_path) return;

    // Fetch đáp án từ file
    fetchAndParseAnswers(data.correct_answer_path, "MATCHING").then((parsedMap) => {
      if (parsedMap) {
        setAnswerMap(parsedMap as Record<string, string>);
      }
    });
    
    // Khởi tạo cards từ displayOrders
    const rawCards: CardItem[] = data.questions.flatMap((q) => {
      return q.displayOrders.map((d) => {
        // Extract text từ URL hoặc lấy trực tiếp từ description field
        const rawText = d.description || (typeof d.content_path === "string" ? d.content_path : "");
        const cleanText = cleanUrlContent(rawText);
        
        // Tự động detect ngôn ngữ thực sự
        const language = detectLanguage(cleanText) as 'en' | 'vi';
        
        return {
          id: `${q.question_id}-${d.display_order_id}`,
          text: cleanText.trim(),
          type: language
        };
      });
    });
    const shuffledCards = shuffleArray(rawCards) as CardItem[];
    setCards(shuffledCards);
    };
    initializeGame();
  }, [data]);

  // 2. Xử lý khi click vào thẻ
  const handleCardClick = (card: CardItem) => {
    if (isProcessing || matchedTexts.includes(card.text) || selectedCards.find(c => c.id === card.id)) {
      return;
    }

    // Không cho chọn 2 thẻ cùng loại (2 tiếng Anh hoặc 2 tiếng Việt)
    if (selectedCards.length === 1 && selectedCards[0].type === card.type) {
      return;
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [first, second] = newSelected;

      // CHECK: Sử dụng answerMap để validate
      const firstKey = normalizeText(first.text);
      const secondKey = normalizeText(second.text);
      
      console.log("🔍 Checking match:", {
        first: firstKey,
        second: secondKey,
        firstType: first.type,
        secondType: second.type,
        firstInMap: answerMap[firstKey],
        secondInMap: answerMap[secondKey],
        answerMap
      });
      
      const isMatch = answerMap[firstKey] === secondKey || answerMap[secondKey] === firstKey;
      console.log(isMatch ? "✅ MATCH!" : "❌ NO MATCH");

      if (isMatch) {
        soundEffects.playCorrect();
        setTimeout(() => {
          setMatchedTexts(prev => [...prev, first.text, second.text]);
          setSelectedCards([]);
          setIsProcessing(false);
        }, 500);
      } else {
        soundEffects.playWrong();
        setTimeout(() => {
          setSelectedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  // Tính toán chính xác số cặp
  const totalPairs = useMemo(() => {
    return Math.floor(cards.length / 2);
  }, [cards.length]);
  
  const matchedPairs = useMemo(() => {
    return Math.floor(matchedTexts.length / 2);
  }, [matchedTexts.length]);
  
  const isGameFinished = useMemo(() => {
    console.log("🎯 Progress:", { matchedPairs, totalPairs, matchedTexts, cardsLength: cards.length });
    return totalPairs > 0 && matchedPairs === totalPairs;
  }, [matchedPairs, totalPairs, matchedTexts, cards.length]);

  return (
    <div className="py-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        Xem lại Phần 1
      </button>

      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-800">Nối cặp từ đồng nghĩa</h3>
        <p className="text-slate-500 text-sm">Chọn một từ tiếng Anh và nghĩa tiếng Việt tương ứng.</p>
        <p className="text-xs text-blue-600 mt-2">Đã ghép: {matchedPairs}/{totalPairs} cặp</p>
      </div>

      {/* Grid thẻ bài */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isSelected = selectedCards.some(c => c.id === card.id);
          const isMatched = matchedTexts.includes(card.text);
          const isWrong = isSelected && selectedCards.length === 2 && !isMatched;

          return (
            <motion.button
              key={card.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              disabled={isMatched || isProcessing}
              onClick={() => handleCardClick(card)}
              className={cn(
                "h-24 md:h-32 p-4 rounded-xl border-2 font-semibold text-sm md:text-base flex items-center justify-center text-center transition-all shadow-sm",
                isMatched 
                  ? "bg-green-100 border-green-500 text-green-700 opacity-50 cursor-default"
                  : isWrong
                    ? "bg-red-100 border-red-500 text-red-700 animate-shake"
                    : isSelected
                      ? "bg-primary text-white border-primary shadow-lg scale-105"
                      : "bg-white border-slate-200 hover:border-primary/50 hover:shadow-md"
              )}
            >
              {isMatched ? (
                <div className="flex flex-col items-center">
                  <Check className="w-6 h-6 mb-1"/>
                  {card.text}
                </div>
              ) : card.text}
            </motion.button>
          );
        })}
      </div>

      {/* Nút chuyển phần 3 - CHỈ hiện khi hoàn thành hết */}
      {isGameFinished && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 p-8 bg-green-50 rounded-3xl border border-green-200 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Xuất sắc!</h2>
          <p className="text-green-700 mb-6">Bạn đã hoàn thành bài luyện tập ghép từ.</p>
          <button 
            onClick={onFinish} 
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-3 mx-auto text-lg"
          >
            Qua Phần 3 <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
