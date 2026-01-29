import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FlashcardStack from "../components/FlashcardStack";
import { vocabService, type VocabEntry } from "@/services/vocab/vocab.service";

const StudyPage = () => {
  const [searchParams] = useSearchParams();
  const topic = useMemo(() => searchParams.get("topic") ?? undefined, [searchParams]);
  const level = useMemo(() => searchParams.get("level") ?? undefined, [searchParams]);
  const [words, setWords] = useState<VocabEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learned, setLearned] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (!topic) return;

    vocabService
      .getNewWords({ topic, level, limit: 10 })
      .then((data) => {
        if (!mounted) return;
        setWords(data ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Không tải được danh sách từ mới. Vui lòng thử lại.");
      })
      .finally(() => {
        if (!mounted) return;
        setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, [topic, level]);

  const handleNextWord = async (wordKey: string, quality: number) => {
    try {
      await vocabService.submitAnswer({ wordKey, quality });
      setLearned((v) => v + 1);
      setWords((prev) => prev.slice(1));
    } catch {
      alert("Cập nhật tiến độ thất bại. Vui lòng thử lại.");
    }
  };

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Vui lòng chọn chủ đề để học.</div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-40">Đang tải từ vựng...</div>
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

  return (
    <div className="min-h-screen bg-white-97 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-15">Học từ vựng</h1>
          {topic && <div className="text-gray-40 mt-1">Chủ đề: {topic}</div>}
        </div>

        <FlashcardStack words={words} onNext={handleNextWord} />

        <div className="mt-6 text-center text-gray-40">
          Đã học: <span className="font-bold text-gray-15">{learned}</span> / 10
        </div>
      </div>
    </div>
  );
};

export default StudyPage;
