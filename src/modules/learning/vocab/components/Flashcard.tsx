import { useState } from "react";
import { LuAudioLines } from "react-icons/lu";

type Entry = {
  word_vi?: string;
  definition_vi?: string;
  definition_en?: string;
  phonetic?: string;
  audio?: string;
  example?: string;
  class?: string;
  cefr?: string;
};

type FlashcardProps = {
  word: string;
  entries?: Entry[];
  onFlip?: (flipped: boolean) => void;
};

const Flashcard = ({ word, entries = [], onFlip }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);
  const entry = entries[0];

  const toggleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  const playAudio = () => {
    const src = entry?.audio;
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch(() => {});
  };

  return (
    <div className="w-75pc max-w-xl h-auto perspective-1000">
      <div
        className={`relative transform-style-3d transition-transform duration-500 ${flipped ? "rotate-y-180" : ""}`}
        onClick={toggleFlip}
      >
        {/* Front */}
        <div className="relative backface-hidden bg-white rounded-2xl border border-white-90 shadow-md p-6">
          <div className="flex flex-col items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-15 p-3">{word}</h2>
            {entry?.phonetic && <div className="mt-2 text-gray-40 p-2">{entry.phonetic}</div>}
            <button
              className="p-2 w-8 h-8 rounded-lg bg-mint-50 text-white font-bold hover:bg-mint-75 transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
            >
              <LuAudioLines className="w-8 h-8 inline-block mr-1" />
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="absolute h-auto inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl border border-white-90 shadow-md p-6">
          <div className="text-lg text-gray-15 flex flex-col items-center justify-center">
            <div className="font-bold mb-2 text-2xl">{entry?.word_vi}</div>
            <div className="text-gray-40">{entry?.definition_vi}</div>
            {entry?.example && <div className="mt-3 italic text-gray-50">Ví dụ: {entry.example}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

