## Tổng Quan

* Xây dựng module học từ vựng gồm trang danh sách chủ đề và trang học theo chủ đề.

* Chỉ người dùng đã đăng nhập được truy cập.

* Theo dõi và cập nhật tiến độ theo từng topic, hiển thị real-time.

## Tích Hợp Đăng Nhập & Bảo Vệ Truy Cập

* Tận dụng AuthContext và axios private client (đã có interceptor token/refresh).

* Thêm các route được bọc bằng RequireAuth:

  * /vocab (Trang chủ đề)

  * /vocab/:topic (Trang học theo chủ đề)

## API & Service Layer

* Tạo services/vocab/vocab.service.ts với các hàm:

  * getTopics(): GET /api/vocabs/topics → trả về \[{ name, totalWords, learnedCount, progressPercentage }].

  * getNewWords(params): GET /api/vocabs/new-words?topic=\&level=\&limit=10 → trả về mảng từ vựng (word, entries...).

  * getReviewDeck(topic?): GET /api/vocabs/review-deck?topic= → danh sách từ cần ôn (để mở rộng SRS).

  * submitAnswer({ wordKey, quality }): POST /api/vocabs/answer → cập nhật tiến độ.

* Chuẩn hóa payload: đọc từ khóa trả về trong data/result để tăng khả năng tương thích.

* Xử lý lỗi (network, 401) theo tiêu chuẩn dự án.

## Routing & Header

* Thay link "Contact" trên Header thành link "Vocabulary" trỏ tới /vocab.

* Thêm hai route mới dưới RequireAuth: /vocab và /vocab/:topic.

## UI & Components

* TopicListPage (pages/vocab/TopicListPage.tsx):

  * Gọi getTopics() và hiển thị lưới TopicCard.

  * TopicCard: name, thanh tiến độ (learnedCount/totalWords), nút "Học" dẫn tới /vocab/:topic.

* StudyPage (pages/vocab/StudyPage.tsx):

  * Gọi getNewWords({ topic, level?, limit: 10 }).

  * FlashcardStack hiển thị 10 từ:

    * Mặt trước: từ tiếng Anh (word, phonetic nếu có, audio optional).

    * Mặt sau: nghĩa tiếng Việt (entries\[].word\_vi, definition\_vi), hiển thị khi click.

  * Khi người dùng lật flashcard để xem nghĩa → gọi submitAnswer({ wordKey, quality: 1 }) và đánh dấu đã học.

  * Đánh dấu rằng từ đó đã học và sẽ không được get khi học ở lần tiếp theo 

* Optional: ReviewDeckPage dùng getReviewDeck() cho ôn tập (có thể triển khai phase sau).

## State & Logic

* Local state cho phiên học: danh sách 10 từ, trạng thái lật từng card, danh sách đã học.

* Sau mỗi submitAnswer:

  * Cập nhật tiến độ local của topic: learnedCount++.

  * Trigger cập nhật global tiến độ bằng refetch getTopics() khi quay lại trang /vocab.

* Nếu API trả sẵn progressPercentage, ưu tiên dùng; nếu không, tính = learnedCount / totalWords.

## Responsive & Hiệu Năng

* Dùng Tailwind responsive; card layout thích ứng mobile/desktop.

* Prefetch dữ liệu chủ đề khi chuyển trang.

* Skeleton loader và memo hóa components; limit=10 tránh cần virtualize.

## Edge Cases

* Hết từ để học: hiển thị trạng thái "Bạn đã học hết từ của topic này" và nút quay lại /vocab hoặc mở Review Deck.

* Lỗi kết nối/API: hiển thị thông báo, nút retry.

* Token hết hạn: rely vào interceptor refresh.

* Dữ liệu thiếu trường: fallback tên/trường hợp null an toàn.

## Kiểm Thử

* Kiểm thử luồng end-to-end:

  * Đăng nhập → vào /vocab → chọn topic → học 10 từ → tiến độ cập nhật.

* Xác minh tính chính xác tiến độ: đối chiếu learnedCount tăng sau mỗi flip.

* Cross-browser: Chrome, Edge, Firefox.

## Điều Chỉnh API (nếu cần)

* Nếu totalWords khác 50, lấy từ API để đảm bảo chính xác.

* Nếu answer cần thang chất lượng (0–5), map nút hành động thành các mức tương ứng; mặc định flip = quality: 1.

## Deliverables

* services/learning/vocab/vocab.service.ts

* pages/learning/vocab/TopicListPage.tsx, pages/vocab/StudyPage.tsx

* components/vocab/TopicCard.tsx, components/vocab/Flashcard.tsx, components/vocab/FlashcardStack.tsx

* Cập nhật Header link → /vocab

* Cập nhật routes: /vocab, /vocab/:topic được bọc RequireAuth

Xác nhận kế hoạch để mình tiến hành triển khai ngay.
