import { memo, type JSX } from "react";
import { cn } from "@/lib/cn";
import { BadgeCheck, Lock, Loader2, Sparkles } from "lucide-react";
import type { TopicRecord, ToeicLevel, TopicStatus } from "@/services/topics/mockTopics";

const levelBadgeClasses: Record<ToeicLevel, string> = {
  "toeic-0-450": "bg-secondary text-text-main",
  "toeic-455-600": "bg-secondary text-text-main",
  "toeic-605-850": "bg-secondary text-text-main",
  "toeic-850-990": "bg-secondary text-text-main",
};

const statusMeta: Record<Exclude<TopicStatus, "recommended"> | "recommended", { label: string; icon: JSX.Element; className: string }> = {
  "in-progress": {
    label: "Đang học",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    className: "text-primary bg-primary/10",
  },
  completed: {
    label: "Hoàn tất",
    icon: <BadgeCheck className="w-4 h-4" />,
    className: "text-success bg-success/10",
  },
  locked: {
    label: "Khóa",
    icon: <Lock className="w-4 h-4" />,
    className: "text-locked bg-locked/10",
  },
  recommended: {
    label: "Gợi ý",
    icon: <Sparkles className="w-4 h-4" />,
    className: "text-primary bg-primary/10",
  },
};

const fallbackThumb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='24'%3EThumbnail%3C/text%3E%3C/svg%3E";

export type TopicCardProps = {
  topic: TopicRecord;
  onSelect: (topic: TopicRecord) => void;
};

const TopicCardComponent = ({ topic, onSelect }: TopicCardProps) => {
  const effectiveStatus: TopicStatus = (() => {
    const pct = Math.min(Math.max(topic.progress, 0), 100);
    if (pct >= 90) return "completed";
    return topic.status === "locked" ? "locked" : topic.status === "recommended" ? "recommended" : "in-progress";
  })();

  const meta = statusMeta[effectiveStatus] ?? statusMeta.locked;
  const badgeClass = levelBadgeClasses[topic.level];
  const thumbSrc = (topic as TopicRecord & { thumbnail?: string }).thumbnail ?? fallbackThumb;
  const isLocked = topic.status === "locked";
  const displayProgress = isLocked ? 0 : Math.min(Math.max(topic.progress, 0), 100);

  return (
    <article
      onClick={() => onSelect(topic)}
      className={cn(
        "group rounded-lg border border-border bg-background shadow-sm cursor-pointer overflow-hidden",
        "transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/30",
        isLocked && "opacity-60"
      )}
    >
      <div className="relative aspect-video w-full bg-border overflow-hidden">
        <img
          src={thumbSrc}
          alt={topic.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4 space-y-3">
        <header className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-text-main truncate">{topic.title}</h3>
            <p className="text-sm text-text-muted truncate">{topic.track}</p>
          </div>
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", badgeClass)}>
            {topic.level}
          </span>
        </header>

        <div className={cn("inline-flex items-center gap-2 text-sm px-2.5 py-1 rounded-full font-semibold", meta.className)}>
          {meta.icon}
          <span>{meta.label}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Tiến độ</span>
            <span className="font-semibold text-primary text-[11px]">{`${displayProgress}%`}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-border overflow-hidden" aria-label="Tiến độ">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${displayProgress}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={displayProgress}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export const TopicCard = memo(
  TopicCardComponent,
  (prev, next) =>
    prev.topic.id === next.topic.id &&
    prev.topic.progress === next.topic.progress &&
    prev.topic.status === next.topic.status &&
    prev.topic.thumbnail === next.topic.thumbnail
);

export default TopicCard;
