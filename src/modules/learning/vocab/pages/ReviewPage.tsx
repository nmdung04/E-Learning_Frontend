import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { vocabService, type VocabEntry, type TopicProgress } from "@/services/vocab/vocab.service";

type ReviewEntry = {
  definitionVi?: string;
  definition_vi?: string;
  explanation_vi?: string;
  explain_vi?: string;
  word_vi?: string;
  example?: string;
  example_vi?: string;
  exampleVi?: string;
  word_en?: string;
  termEn?: string;
  wordEn?: string;
};
const normalize = (s: string) => s.trim().toLowerCase();

const ReviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = useMemo(() => searchParams.get("topic") ?? undefined, [searchParams]);
  const [deck, setDeck] = useState<VocabEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicProgress[]>([]);

  // current card state
  const current = deck[0];

  useEffect(() => {
    let mounted = true;
    vocabService
      .getReviewDeck(topic)
      .then((data) => {
        if (!mounted) return;
        setDeck(data ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Không tải được danh sách ôn tập. Vui lòng thử lại.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [topic]);

  useEffect(() => {
    let mounted = true;
    vocabService
      .getTopics()
      .then((data) => {
        if (!mounted) return;
        setTopics(data ?? []);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleNext = () => {
    setDeck((prev) => prev.slice(1));
  };

  const handleSelectTopic = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("topic", value);
    else next.delete("topic");
    setSearchParams(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-40">Đang tải bộ ôn tập...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-40">Bạn đã hoàn thành ôn tập 🎉</div>
      </div>
    );
  }

  // no-op

  return (
    <div className="min-h-screen bg-white-97 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-15">Ôn tập từ đã học</h1>
          <div className="mt-3">
            <label className="text-sm text-gray-40">Chọn chủ đề ôn tập</label>
            <select
              value={topic ?? ""}
              onChange={(e) => handleSelectTopic(e.target.value)}
              className="mt-1 w-full md:w-auto px-3 py-2 rounded-lg border border-white-90 bg-white text-gray-15"
            >
              <option value="">Tất cả chủ đề</option>
              {topics.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-white-90 shadow-md p-6">
          <div className="text-lg text-gray-15">
            {(() => {
              const entry = (current.entries?.[0] ?? {}) as ReviewEntry;
              const definitionVi = entry.definitionVi ?? entry.definition_vi ?? entry.explanation_vi ?? entry.explain_vi;
              const example = entry.example ?? entry.example_vi ?? entry.exampleVi;
              return (
                <>
                  <div className="font-bold mb-2">{definitionVi ?? "Không có dữ liệu nghĩa tiếng Việt"}</div>
                  {example && (
                    <div className="mt-3 italic text-gray-50">Ví dụ: {example}</div>
                  )}
                </>
              );
            })()}
          </div>

          <ReviewInteraction key={current.wordKey} current={current} onCorrect={handleNext} />
          
          <div className="mt-4 text-sm text-gray-40">
            Còn lại: <span className="font-semibold text-gray-15">{deck.length}</span> từ
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewInteraction = ({
  current,
  onCorrect,
}: {
  current: VocabEntry;
  onCorrect: () => void;
}) => {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const entry = (current.entries?.[0] ?? {}) as ReviewEntry;
  const target = (current.word ?? entry.word_en ?? entry.termEn ?? entry.wordEn ?? "") as string;
  const revealCount = Math.min(attempts, target.length);
  const revealedChars = Math.min(revealCount, target.length);
  const hint = target.slice(0, revealedChars) + Array(Math.max(target.length - revealedChars, 0)).fill("_").join("");

  const handleCheck = () => {
    if (!target) return;
    if (normalize(answer) === normalize(target)) {
      setIsCorrect(true);
      const quality = attempts === 0 ? 4 : attempts === 1 ? 3 : attempts === 2 ? 2 : 1;
      vocabService
        .submitAnswer({ wordKey: current.wordKey ?? target, quality })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            onCorrect();
          }, 500);
        });
    } else {
      setAttempts((a) => a + 1);
    }
  };

  return (
    <>
      <div className="mt-6">
        <label className="block text-sm text-gray-40 mb-2">Nhập từ tiếng Anh</label>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isCorrect) {
              e.preventDefault();
              handleCheck();
            }
          }}
          disabled={isCorrect}
          className={`w-full px-4 py-3 rounded-lg border text-gray-15 placeholder:text-gray-40 ${
            isCorrect
              ? "border-mint-50 bg-mint-50/10"
              : attempts > 0
              ? "border-red-300 bg-red-50/40 animate-shake"
              : "border-white-90 bg-white-99"
          } focus:outline-none`}
          placeholder={hint}
        />
        {attempts > 0 && !isCorrect && (
          <div className="mt-2 text-sm text-red-500 animate-pulse">Chưa đúng. Gợi ý: {hint}</div>
        )}
        {isCorrect && <div className="mt-2 text-sm text-mint-50">Chính xác!</div>}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleCheck}
          disabled={isCorrect}
          className="px-4 py-2 rounded-lg bg-mint-50 text-white font-bold hover:bg-mint-75 transition-colors disabled:opacity-70"
        >
          Kiểm tra
        </button>
      </div>
    </>
  );
};

export default ReviewPage;
