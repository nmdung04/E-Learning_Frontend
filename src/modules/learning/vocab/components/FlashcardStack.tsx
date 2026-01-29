import { useState, useEffect, useCallback } from "react";
import Flashcard from "./Flashcard";
import { Frown, Meh, Smile, Zap } from "lucide-react";
import type { VocabEntry } from "@/services/vocab/vocab.service";

type FlashcardStackProps = {
  words: VocabEntry[];
  onNext?: (wordKey: string, quality: number) => void;
};

const FlashcardStack = ({ words, onNext }: FlashcardStackProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const current = words[0];

  const handleRate = useCallback(
    (quality: number) => {
      if (current?.wordKey) {
        onNext?.(current.wordKey, quality);
        setIsFlipped(false);
      }
    },
    [current, onNext]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFlipped) return;
      switch (e.key) {
        case "1":
          handleRate(1);
          break;
        case "2":
          handleRate(2);
          break;
        case "3":
          handleRate(3);
          break;
        case "4":
          handleRate(4);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, handleRate]);

  if (!current) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">Bạn đã hoàn thành phiên học!</div>
        <div className="text-mint-50 text-6xl mb-4">🎉</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 bg-white-99 rounded-2xl border border-white-90 p-6">
      <Flashcard
        key={current.wordKey || current.word}
        word={current.word}
        entries={current.entries}
        onFlip={setIsFlipped}
      />

      <div className="w-75pc max-w-3xl px-4 min-h-35 flex items-center justify-center">
        {!isFlipped ? (
          <div className="text-white font-medium italic animate-pulse flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full">
            <span>👆</span>
            Tap the card to reveal the meaning
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <button
              onClick={() => handleRate(4)}
              className="group flex flex-col items-center gap-3 p-4 bg-red-500 rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-sm hover:shadow-md text-white"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <Frown size={28} />
              </div>
              <div className="text-center">
                <div className="font-bold">Khó nhớ</div>
                <div className="text-xs font-mono mt-1 font-bold border border-white/40 rounded px-1.5 py-0.5 inline-block">
                  4
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRate(2)}
              className="group flex flex-col items-center gap-3 p-4 bg-orange-500 rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-sm hover:shadow-md text-white"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <Meh size={28} />
              </div>
              <div className="text-center">
                <div className="font-bold">Hơi khó</div>
                <div className="text-xs font-mono mt-1 font-bold border border-white/40 rounded px-1.5 py-0.5 inline-block">
                  3
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRate(2)}
              className="group flex flex-col items-center gap-3 p-4 bg-yellow-500 rounded-2xl hover:bg-yellow-600 transition-all active:scale-95 shadow-sm hover:shadow-md text-white"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <Smile size={28} />
              </div>
              <div className="text-center">
                <div className="font-bold">Bình thường</div>
                <div className="text-xs font-mono mt-1 font-bold border border-white/40 rounded px-1.5 py-0.5 inline-block">
                  2
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRate(1)}
              className="group flex flex-col items-center gap-3 p-4 bg-mint-50 rounded-2xl hover:bg-mint-75 transition-all active:scale-95 shadow-sm hover:shadow-md text-white"
            >
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <div className="text-center">
                <div className="font-bold">Dễ nhớ</div>
                <div className="text-xs font-mono mt-1 font-bold border border-white/40 rounded px-1.5 py-0.5 inline-block">
                  1
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-40 font-medium tracking-wide">{words.length} từ còn lại</div>
    </div>
  );
};

export default FlashcardStack;
