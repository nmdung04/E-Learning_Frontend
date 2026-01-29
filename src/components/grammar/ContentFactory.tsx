import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DisplayOrder } from "@/services/grammar/types";
import type { JSX } from "react/jsx-runtime";

const placeholderImg = "https://via.placeholder.com/640x360?text=Preview";

const cleanUrlContent = (path: string): string => {
  try {
    // Nếu không phải link (không có http), trả về nguyên gốc
    if (!path.startsWith("http")) return path;

    const url = new URL(path);
    // Lấy phần cuối cùng của đường dẫn
    const lastPart = url.pathname.split("/").pop();
    
    // Giải mã ký tự URL (ví dụ %20 thành dấu cách)
    return decodeURIComponent(lastPart || "");
  } catch {
    return path;
  }
};

// 2. Kiểm tra xem có phải file .txt chuẩn không (để quyết định có cần fetch không)
const isTrueTxtFile = (path: string) => {
  try {
    const url = new URL(path);
    return url.pathname.toLowerCase().endsWith(".txt");
  } catch {
    return false;
  }
};

              

// --- COMPONENTS ---

const TextBlock = memo(({ path }: { path: string }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TRƯỜNG HỢP 1: Là file .txt thực sự -> Cần Fetch nội dung bên trong
    if (isTrueTxtFile(path)) {
      let cancelled = false;
      const fetchText = async () => {
        try {
          setLoading(true);
          const res = await fetch(path);
          if (!res.ok) throw new Error("Fetch failed");
          const text = await res.text();
          if (!cancelled) setContent(text);
        } catch {
          // Nếu fetch lỗi, fallback về việc làm sạch URL để lấy text
          if (!cancelled) setContent(cleanUrlContent(path));
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      fetchText();
      return () => { cancelled = true; };
    } 
    
    // TRƯỜNG HỢP 2: Là URL "rác" (chứa text trong link) hoặc Text thuần
    // -> Xử lý ngay lập tức, không cần fetch
    else {
      setContent(cleanUrlContent(path));
    }
  }, [path]);

  if (loading) {
    return (
      <div className="p-3 bg-gray-100 rounded-lg animate-pulse w-full">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // Parse content to handle bullet points
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let bulletItems: string[] = [];
    let currentIndex = 0;

    const flushBullets = () => {
      if (bulletItems.length > 0) {
        elements.push(
          <ul key={`bullets-${currentIndex}`} className="list-disc list-inside space-y-1 my-3 text-slate-800">
            {bulletItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
        bulletItems = [];
        currentIndex++;
      }
    };

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      
      // Check if line starts with bullet indicators: -, •, *, or number followed by dot
      const bulletMatch = trimmedLine.match(/^[-•*]\s+(.+)$/) || trimmedLine.match(/^\d+\.\s+(.+)$/);
      
      if (bulletMatch) {
        bulletItems.push(bulletMatch[1]);
      } else if (trimmedLine) {
        flushBullets();
        elements.push(
          <p key={`text-${idx}`} className="my-2 text-slate-800 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
    });

    flushBullets(); // Flush any remaining bullets
    return elements.length > 0 ? elements : <p className="text-slate-800">{text}</p>;
  };

  return (
    <div className="bg-white/60 border border-slate-200 rounded-lg p-4 shadow-sm my-2">
      <div className="prose prose-sm max-w-none">
        {renderContent(content)}
      </div>
    </div>
  );
});
TextBlock.displayName = "TextBlock";

// ... GIỮ NGUYÊN CÁC COMPONENT MEDIA KHÁC (Image, Audio, Video, PDF) ...
// (Bạn copy lại phần MediaImage, MediaAudio, MediaVideo, PdfViewer cũ vào đây nhé)


const MediaImage = memo(({ src, alt }: { src: string; alt?: string | null }) => {
  const [fallback, setFallback] = useState(false);
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/40 shadow-sm bg-gray-50">
      <img
        src={fallback ? placeholderImg : src}
        alt={alt ?? "Hình ảnh"}
        className="w-full h-auto max-h-[500px] object-contain mx-auto"
        onError={() => setFallback(true)}
      />
      {alt && <p className="text-center text-xs text-text-muted py-2 bg-white/50 italic">{alt}</p>}
    </div>
  );
});

const MediaAudio = memo(({ src }: { src: string }) => (
  <div className="rounded-xl border border-border bg-gray-50 p-4 flex items-center justify-center">
    <audio controls preload="metadata" className="w-full max-w-md">
      <source src={src} />
      Trình duyệt không hỗ trợ audio.
    </audio>
  </div>
));

const MediaVideo = memo(({ src }: { src: string }) => (
  <div className="rounded-xl border border-border bg-black overflow-hidden">
    <video controls preload="metadata" className="w-full aspect-video" style={{ maxHeight: 480 }}>
      <source src={src} />
      Trình duyệt không hỗ trợ video.
    </video>
  </div>
));

const PdfViewer = memo(({ src }: { src: string }) => (
  <div className="rounded-xl border border-border bg-white overflow-hidden shadow-sm">
    <object data={src} type="application/pdf" width="100%" height="500" className="w-full">
      <div className="flex flex-col items-center justify-center h-48 bg-gray-50 gap-3">
        <p className="text-text-muted">Trình duyệt không hỗ trợ xem trực tiếp PDF.</p>
        <a className="text-primary underline font-semibold" href={src} target="_blank" rel="noreferrer">
          Tải file PDF
        </a>
      </div>
    </object>
  </div>
));

// --- MAIN COMPONENT ---

const getExt = (path: string) => {
  try {
    const url = new URL(path);
    return url.pathname.split(".").pop()?.toLowerCase();
  } catch {
    return path.split(".").pop()?.toLowerCase();
  }
};

export const ContentFactory = memo(({ displayOrder }: { displayOrder: DisplayOrder }) => {
  const paths = Array.isArray(displayOrder.content_path)
    ? displayOrder.content_path
    : [displayOrder.content_path];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 mb-6"
    >
      {displayOrder.description && (
        <h3 className="text-md font-bold text-gray-800 mt-4 border-l-4 border-primary pl-3">
          {displayOrder.description}
        </h3>
      )}

      {paths.map((path, idx) => {
        if (!path) return null;
        const key = `${displayOrder.display_order_id}-${idx}`;
        const ext = getExt(path);
        const type = displayOrder.content_type?.toLowerCase();

        // LOGIC HIỂN THỊ
        if (type === "text") return <TextBlock key={key} path={path} />;
        if (type === "image") return <MediaImage key={key} src={path} alt={displayOrder.description} />;
        if (type === "audio") return <MediaAudio key={key} src={path} />;
        if (type === "video") return <MediaVideo key={key} src={path} />;
        if (type === "pdf" || ext === "pdf") return <PdfViewer key={key} src={path} />;

        // Fallback: Mặc định coi là TextBlock để cố gắng extract text từ URL lạ
        return <TextBlock key={key} path={path} />;
      })}
    </motion.div>
  );
});
ContentFactory.displayName = "ContentFactory";

export default ContentFactory;
