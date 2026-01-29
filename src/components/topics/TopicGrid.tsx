import { AlertCircle } from "lucide-react";
import type { TopicRecord } from "@/services/topics/mockTopics";
import { TopicCard } from "./TopicCard";

export type TopicGridProps = {
  topics: TopicRecord[];
  onTopicSelect: (topic: TopicRecord) => void;
};

export const TopicGrid = ({ topics, onTopicSelect }: TopicGridProps) => {
  if (!topics.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-text-muted gap-3">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm font-medium">Không tìm thấy chủ đề phù hợp. Vui lòng thử bộ lọc khác.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} onSelect={onTopicSelect} />
      ))}
    </div>
  );
};

export default TopicGrid;
