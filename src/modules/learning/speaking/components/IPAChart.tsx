import { useState } from "react";
import { IPA_VOWELS, IPA_CONSONANTS } from "../data/ipa";
import type { IpaSymbol } from "../data/ipa";

export default function IPAChart() {
  const [playing, setPlaying] = useState<string | null>(null);

  const playAudio = (item: IpaSymbol) => {
    const audio = new Audio(item.audio);
    setPlaying(item.symbol);
    audio.play();
    audio.onended = () => setPlaying(null);
  };

  const renderGroup = (title: string, list: IpaSymbol[]) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {list.map((item) => (
          <button
            key={item.symbol}
            onClick={() => playAudio(item)}
            className={`px-3 py-2 rounded border text-sm
              ${
                playing === item.symbol
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }
            `}
          >
            {item.symbol}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {renderGroup("Vowels", IPA_VOWELS)}
      {renderGroup("Consonants", IPA_CONSONANTS)}
    </div>
  );
}
