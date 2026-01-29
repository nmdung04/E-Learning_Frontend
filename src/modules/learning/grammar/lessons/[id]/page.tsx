/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchLessonDetail } from "@/services/grammar/api";
import type { Lesson } from "@/services/grammar/types";
import { LessonContainer } from "@/components/grammar/LessonContainer";

const LessonPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Lesson Data ---
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const targetId = id ? Number(id) : 280; // Default to lesson 280 for Grammar
        const data = await fetchLessonDetail(targetId);
        setLesson(data);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định khi tải bài học");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50/30 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // --- No Lesson Found ---
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <p className="text-slate-600">Không tìm thấy bài học</p>
      </div>
    );
  }

  // --- Render with LessonContainer ---
  return (
    <LessonContainer
      lesson={lesson}
      onExit={() => navigate(-1)}
    />
  );
};

export default LessonPage;

