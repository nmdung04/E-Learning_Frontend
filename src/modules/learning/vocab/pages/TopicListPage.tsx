import { useEffect, useState } from "react";
import { vocabService, type TopicProgress } from "@/services/vocab/vocab.service";
import { useNavigate } from "react-router-dom";

const TopicListPage = () => {
  const [topics, setTopics] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    vocabService
      .getTopics()
      .then((data) => {
        if (!mounted) return;
        setTopics(data ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Không tải được danh sách chủ đề. Vui lòng thử lại.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-40">Đang tải chủ đề...</div>
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
    <div className="min-h-screen bg-white-97 py-10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-15">Vocabulary Topics</h1>
            <p className="text-gray-40 mt-1">Chọn chủ đề bạn muốn học hoặc ôn tập</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/vocab/review")}
              className="px-4 py-2 rounded-lg bg-mint-50 text-white font-bold hover:bg-mint-75 transition-colors"
            >
              Ôn tập từ đã học
            </button>
          </div>
        </div>

        <div className="grid grid-cols-custom gap-6">
          {topics.map((t) => (
            <div
              key={t.name}
              className="group  bg-white rounded-2xl border border-white-90 shadow hover:shadow-lg transition-all px-2 py-1"
            >
              <div className="p-2 flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full">
                  <div className="w-full">
                    <h3 className="text-2xl text-center font-bold text-gray-15">{t.name}</h3>
                    <div className="words w-full mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-40">{t.totalWords} từ</span>
                      <div className="text-sm text-gray-40">
                        Đã học: <span className="font-semibold text-gray-15">{t.learnedCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-2 bg-white-95 rounded-full w-full overflow-hidden">
                  <div
                    className="h-full bg-mint-50 transition-[width] duration-500"
                    style={{ width: `${t.progressPercentage ?? 0}%` }}
                  />
                </div>
                

                <div className="mt-5 flex items-center align-bottom gap-3">
                  <button
                    onClick={() => navigate(`/vocab/study?topic=${encodeURIComponent(t.name)}`)}
                    className="px-4 py-2 mt-4 mb-2 w-full rounded-lg border border-mint-50 text-mint-50 font-bold hover:bg-mint-50 hover:text-white  transition-colors shadow-sm"
                  >
                    Học ngay
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicListPage;
