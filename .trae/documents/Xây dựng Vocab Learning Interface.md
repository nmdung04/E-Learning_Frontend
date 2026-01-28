## Mục tiêu
Xây dựng giao diện học từ vựng (Vocab Learning Interface) trong module "learning" với: Flashcard có hiệu ứng lật, ví dụ sử dụng, nút phát âm thanh, điều hướng (tiếp tục/quay lại), đánh dấu đã học; màn ôn tập khi chuyển part.

## Kiến trúc Module
- Thư mục: src/modules/learning
- Tệp chính:
  - VocabularyPage.tsx: Trang chọn Topic theo dạng Accordion, hiển thị các Part (5 phần x 10 từ) của mỗi Topic.
  - LearningSession.tsx: Phiên học flashcard cho 10 từ trong Part.
  - ReviewSession.tsx: Màn ôn tập 10 từ trước khi sang Part tiếp theo (điền nghĩa tiếng Việt tương ứng).
- Thư mục con:
  - components/
    - TopicAccordion.tsx: Accordion danh sách Topic.
    - PartList.tsx: Danh sách các Part của Topic, hiển thị tiến độ.
    - Flashcard.tsx: Thẻ flip (mặt trước/ sau).
    - AudioButton.tsx: Nút phát âm (HTMLAudioElement).
    - NavigationBar.tsx: Điều hướng Next/Prev, nút đánh dấu đã học.
    - ProgressBar.tsx: Hiển thị tiến độ Part/Topic.
  - hooks/
    - useVocabData.ts: Tải dữ liệu từ fakedata.json, phân chia thành 5 Part.
    - useVocabProgress.ts: Lưu/đọc tiến độ (localStorage) theo topic/part/word.
  - types.ts: Kiểu dữ liệu Topic, VocabWord, Part, Progress.
  - utils/partition.ts: Hàm chia mảng 50 từ thành 5 phần x 10.

## Dữ liệu & fakedata
- Tạo public/fakedata.json (dễ fetch):
  - topics: [{ id, name, level }]
  - words: 50 từ mỗi topic: [{ id, termEn, pos, phonetic, audioUrl, definitionEn, meaningVi, examples: ["..."] }]
- Phân chia từ 50 từ thành 5 phần (mỗi phần 10 từ) ở useVocabData.
- audioUrl có thể là đường dẫn giả (public/audios/<topic>/<id>.mp3>) — hiển thị nhưng không bắt buộc phải tồn tại đủ file thật ngay.

## Thành phần UI chi tiết
- TopicAccordion
  - Dùng Tailwind + palette từ global.css (mint-50, white-95, gray-15...) để thống nhất.
  - Mỗi Topic mở ra hiển thị PartList.
- PartList
  - Hiển thị 5 Part, mỗi Part cho biết số từ đã học/10.
  - Nút "Học" để vào LearningSession của Part.
- Flashcard
  - Mặt trước: termEn, pos, phonetic, AudioButton.
  - Mặt sau: meaningVi, examples (>=1).
  - Hiệu ứng flip: container với perspective, inner với transform-style: preserve-3d; state toggles rotate-y-180; Tailwind: transition, transform, backface-hidden.
  - Sự kiện: khi lật sang mặt sau lần đầu => đánh dấu từ là "đã học" (persist).
- AudioButton
  - Tạo và quản lý HTMLAudioElement; play/pause; disabled khi không có audio.
  - Trợ năng: aria-label, keyboard (Enter/Space).
- NavigationBar
  - Prev/Next; trạng thái disabled ở đầu/cuối.
  - Nút "Đã học" (optional) bổ sung cho hành động lật.
- ProgressBar
  - Thanh tiến độ theo số từ đã học/10; màu dùng mint-50.

## Luồng học & lưu tiến độ
- VocabularyPage: chọn Topic -> chọn Part -> vào LearningSession.
- LearningSession:
  - Lặp qua 10 từ, xem flashcard, flip sẽ đánh dấu đã học.
  - Khi tất cả 10 từ đã được flip ít nhất 1 lần => Hiển thị nút "Ôn tập".
- ReviewSession:
  - Hiển thị 10 mục: từ tiếng Anh + definitionEn; input điền meaningVi.
  - Kiểm tra đúng/sai; yêu cầu hoàn thành đủ 10 từ mới cho phép sang Part tiếp theo.
- Tiến độ: useVocabProgress lưu theo key: `vocabProgress:{topicId}:{partIndex}` gồm danh sách wordId đã học và trạng thái reviewDone.

## Trải nghiệm & Trợ năng
- Keyboard hỗ trợ:
  - Flip: Space/Enter.
  - Điều hướng: ArrowLeft/ArrowRight.
- Focus visible, aria-controls cho accordion, aria-expanded, role="button".

## Tích hợp định tuyến
- Tạo route mới: /learning
  - /learning: VocabularyPage
  - /learning/:topicId/part/:partIndex: LearningSession
  - /learning/:topicId/part/:partIndex/review: ReviewSession
- Xuất module từ src/modules/learning/index.ts để dễ import ở router hiện có.

## Kiểu & ràng buộc
- types.ts
  - VocabWord: id, termEn, pos, phonetic, audioUrl, definitionEn, meaningVi, examples: string[]
  - Topic: id, name, level, words: VocabWord[]
  - Part: topicId, index, words: VocabWord[]
  - Progress: learnedWordIds: string[], reviewDone: boolean

## Styling & palette
- Dùng các biến màu từ global.css:
  - Nền thẻ: bg-white-95 / border-white-90
  - Primary: bg-mint-50, hover:bg-mint-70
  - Text: text-gray-15, placeholder: text-gray-40
- Flashcard shadow, focus ring theo mint-50.

## Kiểm thử & xác minh
- Luồng demo với fakedata.json: 2-3 Topic mẫu.
- Xác minh:
  - Flip đánh dấu học; reload vẫn giữ tiến độ (localStorage).
  - Review đúng đủ 10 từ mới cho phép sang Part tiếp.
  - AudioButton không lỗi khi thiếu audio.

## Kế hoạch file
- src/modules/learning/VocabularyPage.tsx
- src/modules/learning/LearningSession.tsx
- src/modules/learning/ReviewSession.tsx
- src/modules/learning/components/TopicAccordion.tsx
- src/modules/learning/components/PartList.tsx
- src/modules/learning/components/Flashcard.tsx
- src/modules/learning/components/AudioButton.tsx
- src/modules/learning/components/NavigationBar.tsx
- src/modules/learning/components/ProgressBar.tsx
- src/modules/learning/hooks/useVocabData.ts
- src/modules/learning/hooks/useVocabProgress.ts
- src/modules/learning/utils/partition.ts
- src/modules/learning/types.ts
- public/fakedata.json