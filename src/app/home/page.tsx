import { useNavigate } from "react-router-dom";
import { BookOpen, RefreshCw, BarChart3 } from "lucide-react";
import { useAuth } from "@/services/auth/useAuth";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) navigate("/vocab");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white-97">
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-mint-50 font-semibold">
              Chào mừng đến với English Learning App
            </p>
            <h1 className="mt-2 text-3xl md:text-5xl font-bold text-gray-15 leading-tight">
              Học tiếng Anh hiệu quả và bền vững
            </h1>
            <p className="mt-4 text-gray-40">
              Luyện từ vựng theo ngữ cảnh, ôn tập thông minh, theo dõi tiến độ rõ ràng. Bắt đầu hành trình nâng cấp tiếng Anh của bạn ngay hôm nay.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleGetStarted}
                className="px-5 py-3 rounded-xl bg-mint-50 text-white font-bold hover:bg-mint-75 transition-colors"
              >
                Bắt đầu học
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-3 rounded-xl bg-white border border-white-90 text-gray-15 font-bold hover:bg-white-95 transition-colors"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-white-90 shadow-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-mint-50/15 text-mint-50 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-15">Học từ vựng thông minh</h3>
                <p className="mt-1 text-sm text-gray-40">Từ vựng kèm nghĩa, ví dụ, ngữ âm và ngữ cảnh sử dụng.</p>
              </div>
              <div className="flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-mint-50/15 text-mint-50 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-15">Ôn tập chủ động</h3>
                <p className="mt-1 text-sm text-gray-40">Cơ chế gợi ý theo số lần sai giúp ghi nhớ nhanh và chính xác.</p>
              </div>
              <div className="flex flex-col items-start">
                <div className="w-10 h-10 rounded-lg bg-mint-50/15 text-mint-50 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-15">Theo dõi tiến độ</h3>
                <p className="mt-1 text-sm text-gray-40">Nắm bắt số lượng từ đã học và hiệu quả ôn tập theo chủ đề.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl border border-white-90 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-15">Tại sao chọn chúng tôi?</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-white-99 border border-white-90">
              <p className="text-gray-15 font-semibold">Trải nghiệm mượt mà</p>
              <p className="mt-1 text-sm text-gray-40">Giao diện thân thiện, phản hồi nhanh và tối ưu cho mọi thiết bị.</p>
            </div>
            <div className="p-4 rounded-xl bg-white-99 border border-white-90">
              <p className="text-gray-15 font-semibold">Nội dung chất lượng</p>
              <p className="mt-1 text-sm text-gray-40">Từ vựng kèm ví dụ thực tế giúp ghi nhớ bền vững.</p>
            </div>
            <div className="p-4 rounded-xl bg-white-99 border border-white-90">
              <p className="text-gray-15 font-semibold">Lộ trình cá nhân hoá</p>
              <p className="mt-1 text-sm text-gray-40">Chọn chủ đề phù hợp và theo dõi tiến độ học tập của riêng bạn.</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGetStarted}
              className="px-5 py-3 rounded-xl bg-mint-50 text-white font-bold hover:bg-mint-75 transition-colors"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
