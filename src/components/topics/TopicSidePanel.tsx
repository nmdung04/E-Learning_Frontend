import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, BookOpen, Sparkles, Zap, CheckCircle2, Circle } from "lucide-react";
import type { TopicRecord } from "@/services/topics/mockTopics";
import { cn } from "@/lib/cn";
import { useMemo } from "react";
import type { JSX } from "react";


export type TopicSidePanelProps = {
  isOpen: boolean;
  topic: TopicRecord | null;
  onClose: () => void;
  onStartStudy: (topic: TopicRecord) => void;
};

const panelVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: "0%", opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

const statusColor: Record<TopicRecord["status"], string> = {
  "in-progress": "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  locked: "bg-locked/10 text-locked",
  recommended: "bg-primary/10 text-primary",
};

const taskIconMap: Record<string, JSX.Element> = {
  Reading: <BookOpen className="w-4 h-4" />,
  "Detailed Analysis": <Zap className="w-4 h-4" />,
  Vocabulary: <Sparkles className="w-4 h-4" />,
};

export const TopicSidePanel = ({ isOpen, topic, onClose, onStartStudy }: TopicSidePanelProps) => {
  const isLocked = topic?.status === "locked";
  const effectiveProgress = topic ? Math.max(0, Math.min(100, topic.progress)) : 0;
  const ctaLabel = effectiveProgress > 0 ? "Học tiếp" : "Bắt đầu học";

  const renderTasks = useMemo(() => {
    if (!topic?.tasks?.length) return null;
    return topic.tasks.map((task, index) => {
      const icon = taskIconMap[task.type] ?? <Circle className="w-4 h-4" />;
      const done = Boolean(topic.progress >= 100 || index < topic.sessionsCompleted);
      return (
        <div
          key={task.id}
          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-border/40 transition"
        >
          <span className={cn("p-2 rounded-full bg-border text-text-muted")}>{icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-main truncate">{task.title}</p>
            <p className="text-xs text-text-muted truncate">{task.focus}</p>
          </div>
          {done ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Circle className="w-5 h-5 text-border" />
          )}
        </div>
      );
    });
  }, [topic]);

  return (
    <AnimatePresence>
      {isOpen && topic ? (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <motion.div
            className="flex-1 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="relative h-full w-full md:w-[400px] lg:w-[450px] bg-background shadow-2xl flex flex-col border border-border rounded-lg"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <header className="p-5 border-b border-border flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Topic</p>
                <h2 className="text-2xl font-bold text-text-main leading-tight line-clamp-2">{topic.title}</h2>
                <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-semibold", statusColor[topic.status])}>
                  {topic.status === "in-progress"
                    ? "Đang học"
                    : topic.status === "completed"
                    ? "Hoàn tất"
                    : topic.status === "locked"
                    ? "Khóa"
                    : "Gợi ý"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-border text-text-muted transition"
                aria-label="Đóng panel"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <section className="rounded-lg bg-primary/5 border border-border p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Learning Focus</p>
                <ul className="list-disc list-inside text-sm text-text-main space-y-1">
                  {topic.learningFocus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">Learning Tasks</p>
                <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                  {renderTasks}
                </div>
              </section>
            </div>

            <div className="p-5 border-t border-border">
              <button
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-3 transition-colors disabled:opacity-60"
                onClick={() => topic && onStartStudy(topic)}
                disabled={isLocked}
              >
                <ArrowRight className="w-5 h-5" />
                {ctaLabel}
              </button>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default TopicSidePanel;
