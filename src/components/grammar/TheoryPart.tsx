import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import type { Part } from '@/services/grammar/types';
import { cn } from '@/lib/utils';
import { formatDescription } from '@/utils/formatText';

interface Props {
  data: Part;
  onComplete: () => void;
}

export const TheoryPart = ({ data, onComplete }: Props) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  if (!data?.questions?.[0]?.displayOrders) {
    return <div className="py-12 text-center text-slate-500">Chưa có nội dung lý thuyết.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-6 px-4"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#46ce83] to-[#3ab56f] rounded-full shadow-lg mb-4">
          <BookOpen className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">
            Phần {data.part_number}: Lý thuyết
          </h2>
        </div>
        <p className="text-slate-600 text-sm">
          Hãy đọc kỹ nội dung lý thuyết trước khi làm bài tập
        </p>
      </div>

      {/* Grid Layout cho nội dung Lý thuyết */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {data.questions[0].displayOrders.map((displayOrder, index) => {
          // --- SỬ DỤNG FORMAT Ở ĐÂY ---
          const { title, items } = formatDescription(displayOrder.description ?? '');

          return (
            <motion.div
              key={displayOrder.display_order_id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all group"
            >
              {/* Render Tiêu đề */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Lightbulb size={20} className="text-slate-400 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 uppercase tracking-tight">
                  {title}
                </h3>
              </div>

              {/* Render Danh sách các ý */}
              <ul className="space-y-3">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 group/item">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 group-hover/item:scale-125 transition-transform" />
                    <span className="text-[15px] leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Nút Hoàn thành - Cố định hoặc cuối trang */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={cn(
            'group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl overflow-hidden',
            isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105 hover:shadow-xl cursor-not-allowed'
              : 'bg-slate-300 text-slate-500 hover:bg-green-500 hover:text-white hover:shadow-2xl cursor-pointer'
          )}
        >
          {isCompleted ? <CheckCircle /> : <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />}
          <span>{isCompleted ? 'Đã học xong' : 'Tôi đã hiểu bài'}</span>
        </button>
        
        <p className="text-gray-25 text-xs italic">
          Bấm nút để lưu tiến độ và sang phần tiếp theo
        </p>
      </div>
    </motion.div>
  );
};

export default TheoryPart;
