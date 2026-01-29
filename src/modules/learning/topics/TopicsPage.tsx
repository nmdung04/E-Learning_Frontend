import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { mockTopics, TOEIC_LEVEL_LABELS, type TopicRecord, type ToeicLevel } from "@/services/topics/mockTopics";
import { TopicGrid } from "@/components/topics/TopicGrid";
import TopicSidePanel from "@/components/topics/TopicSidePanel";
import { cn } from "@/lib/cn";

const ALL_BAND = "All" as const;
type BandValue = ToeicLevel | typeof ALL_BAND;

const bandOptions: BandValue[] = [ALL_BAND, "toeic-0-450", "toeic-455-600", "toeic-605-850", "toeic-850-990"];

const TopicFilter = ({ currentBand, onSelect }: { currentBand: BandValue; onSelect: (band: BandValue) => void }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-text-main">
        <Filter className="w-4 h-4" />
        <p className="text-sm font-semibold">Chọn Band TOEIC</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {bandOptions.map((band) => (
          <button
            key={band}
            onClick={() => onSelect(band)}
            className={cn(
              "px-4 py-2 rounded-full border text-sm font-semibold transition cursor-pointer",
              band === currentBand
                ? "bg-primary text-white border-primary"
                : "bg-background border-border text-text-main hover:border-primary/40"
            )}
          >
            {band === ALL_BAND ? "All Bands" : TOEIC_LEVEL_LABELS[band]}
          </button>
        ))}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-lg border border-border bg-background shadow-sm animate-pulse overflow-hidden">
    <div className="aspect-video bg-border" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-border rounded w-3/4" />
      <div className="h-3 bg-border rounded w-1/2" />
      <div className="h-2 bg-border rounded w-full" />
    </div>
  </div>
);

export const TopicsPage = () => {
  const [topics] = useState<TopicRecord[]>(mockTopics);
  const [currentBand, setCurrentBand] = useState<BandValue>(ALL_BAND);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicRecord | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  

  const filteredTopics = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return topics.filter((topic) => {
      const matchBand = currentBand === ALL_BAND ? true : topic.level === currentBand;
      const matchSearch = !normalized
        || topic.title.toLowerCase().includes(normalized)
        || topic.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return matchBand && matchSearch;
    });
  }, [topics, currentBand, search]);

  const panelTopic = useMemo(() => {
    if (!selectedTopic) return null;
    if (currentBand !== ALL_BAND && selectedTopic.level !== currentBand) return null;
    return selectedTopic;
  }, [selectedTopic, currentBand]);

  const panelOpen = isPanelOpen && Boolean(panelTopic);

  const handleTopicClick = (topic: TopicRecord) => {
    setSelectedTopic(topic);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedTopic(null);
  };

  const handleStartStudy = (topic: TopicRecord) => {
    setIsPanelOpen(false);
    if (topic.initialLessonId) {
    navigate(`/grammar/lessons/${topic.initialLessonId}`);
  } else {
    console.error("Topic này chưa cấu hình bài học bắt đầu!");
  }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">TOEIC</p>
            <h1 className="text-2xl md:text-3xl font-bold text-text-main">Learning Topics</h1>
            <p className="text-text-muted text-sm mt-1">Chọn band, lọc chủ đề và xem chi tiết để bắt đầu học.</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc tag"
              className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,3fr]">
          <aside className="bg-background rounded-lg border border-border p-4 shadow-sm">
            <TopicFilter currentBand={currentBand} onSelect={setCurrentBand} />
          </aside>

          <main className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            ) : (
              <TopicGrid topics={filteredTopics} onTopicSelect={handleTopicClick} />
            )}
          </main>
        </div>
      </div>

      <TopicSidePanel
        isOpen={panelOpen}
        topic={panelTopic}
        onClose={handleClosePanel}
        onStartStudy={handleStartStudy}
      />
    </div>
  );
};

export default TopicsPage;
