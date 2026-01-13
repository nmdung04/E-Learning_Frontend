const DashboardPage = () => {
  return (
    <div className="w-[100vw] min-h-screen bg-white-97 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white-99 rounded-3xl shadow-lg p-8">
          <p className="text-sm uppercase tracking-widest text-mint-50 font-semibold mb-3">
            Trang chính
          </p>
          <h1 className="text-3xl font-bold text-gray-15 mb-4">
            Khu vực chức năng đang được xây dựng
          </h1>
          <p className="text-gray-30 leading-relaxed">
            Bạn đã đăng nhập thành công. Toàn bộ chức năng chính sẽ được bố trí tại đây: quản lý khóa học, lộ trình học tập, tiến độ, v.v. Hãy cho mình biết yêu cầu chi tiết để hoàn thiện trang này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
