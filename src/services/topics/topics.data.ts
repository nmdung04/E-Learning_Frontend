export type ToeicLevel =
  | "toeic-0-450"
  | "toeic-455-600"
  | "toeic-605-850"
  | "toeic-850-990";

export type TopicStatus = "recommended" | "in-progress" | "locked";

export type ScoreRange = {
  min: number;
  max: number;
  label: string;
};

export type RelatedExercise = {
  id: string;
  title: string;
  type: "quiz" | "listening" | "writing" | "speaking" | "project" | "reading";
  duration: string;
  link: string;
  targetScoreRange: ScoreRange;
};

export type InteractiveMcq = {
  id: string;
  question: string;
  options: Array<{
    id: string;
    label: string;
  }>;
  answer: string;
  rationale: string;
};

export type ClozeExample = {
  id: string;
  prompt: string;
  sentence: string;
  answer: string;
  hint: string;
  rationale: string;
};

export type TopicTask = {
  id: string;
  title: string;
  type: string;
  duration: string;
  focus: string;
};

export type TopicRecord = {
  id: string;
  title: string;
  level: ToeicLevel;
  track: string;
  description: string;
  tags: string[];
  learningFocus: string[];
  progress: number;
  durationMinutes: number;
  sessionsCompleted: number;
  status: TopicStatus;
  accentClass: string;
  heroSentence: string;
  objective: string;
  successMetric: string;
  grammarFocus: {
    explanation: string;
    rules: string[];
    pitfalls: string[];
  };
  interactiveExamples: {
    mcq: InteractiveMcq;
    cloze: ClozeExample;
  };
  relatedExercises: RelatedExercise[];
  tasks: TopicTask[];
};



export const TOEIC_LEVEL_LABELS: Record<ToeicLevel, string> = {
  "toeic-0-450": "TOEIC 0–450",
  "toeic-455-600": "TOEIC 455–600",
  "toeic-605-850": "TOEIC 605–850",
  "toeic-850-990": "TOEIC 850–990",
};

export const TOPIC_LIBRARY: TopicRecord[] = [
  {
    id: "toeic-basics-svo",
    title: "Cấu trúc câu TOEIC cơ bản",
    level: "toeic-0-450",
    track: "Foundation",
    description:
      "Ghép S–V–O rõ ràng cho Part 5/6, tránh sai trật tự từ và chia động từ sai.",
    tags: ["part 5", "word order", "accuracy"],
    learningFocus: [
      "Nhận diện chủ ngữ, động từ, tân ngữ trong câu dài",
      "Chia động từ theo thì cơ bản trong thông báo nội bộ",
      "Dùng trạng từ/tính từ đúng vị trí để không mất điểm ngữ pháp",
    ],
    progress: 28,
    durationMinutes: 30,
    sessionsCompleted: 1,
    status: "recommended",
    accentClass: "from-sky-200/50 via-blue-100 to-transparent",
    heroSentence: "The team submitted the travel forms this morning.",
    objective: "Viết đúng 8/10 câu SVO cho email và thông báo đơn giản.",
    successMetric: "Hoàn thành 10 câu Part 5 với ≤1 lỗi trật tự từ.",
    grammarFocus: {
      explanation:
        "TOEIC Part 5/6 thường kiểm tra vị trí tính từ, trạng từ và chia động từ. Giữ S–V–O rõ ràng giúp tránh bẫy.",
      rules: [
        "Đặt trạng từ chỉ tần suất trước động từ thường, sau be (often check / is often checked).",
        "Tính từ đứng trước danh từ; trạng từ bổ nghĩa cho động từ hoặc cả câu.",
        "Chủ ngữ số ít đi với động từ số ít ở hiện tại đơn (she reports).",
      ],
      pitfalls: [
        "Nhầm lẫn giữa be + adj và be + adv",
        "Bỏ -s cho ngôi thứ 3 số ít",
        "Đặt trạng từ sai chỗ làm vỡ cấu trúc SVO",
      ],
    },
    interactiveExamples: {
      mcq: {
        id: "svo-mcq",
        question:
          "Chọn đáp án đúng cho Part 5: The technician ____ the report before lunch.",
        options: [
          { id: "a", label: "submit" },
          { id: "b", label: "submitting" },
          { id: "c", label: "submitted" },
          { id: "d", label: "is submit" },
        ],
        answer: "c",
        rationale:
          "Có mốc thời gian quá khứ (before lunch) nên dùng past simple: submitted.",
      },
      cloze: {
        id: "svo-cloze",
        prompt: "Điền phrasal verb đúng:",
        sentence: "The interns ____ the forms and sent them to HR.",
        answer: "filled out",
        hint: "Phrasal verb nghĩa là hoàn thành mẫu",
        rationale:
          "Fill out là cụm động từ thường gặp trong Part 5 liên quan giấy tờ / form.",
      },
    },
    relatedExercises: [
      {
        id: "part5-basics",
        title: "10 câu Part 5 nền tảng",
        type: "quiz",
        duration: "10 min",
        link: "/dashboard?module=part5-basics",
        targetScoreRange: { min: 0, max: 450, label: "TOEIC 0–450" },
      },
      {
        id: "mini-email",
        title: "Email ngắn 50 từ",
        type: "writing",
        duration: "8 min",
        link: "/dashboard?module=mini-email",
        targetScoreRange: { min: 0, max: 450, label: "TOEIC 0–450" },
      },
      {
        id: "adverb-spot",
        title: "Vị trí trạng từ",
        type: "quiz",
        duration: "6 min",
        link: "/dashboard?module=adverb-spot",
        targetScoreRange: { min: 0, max: 450, label: "TOEIC 0–450" },
      },
    ],
    tasks: [
      {
        id: "svo-task-01",
        title: "Đánh dấu S–V–O",
        type: "Listening",
        duration: "5 min",
        focus: "Nghe câu ngắn và xác định chủ ngữ – động từ",
      },
      {
        id: "svo-task-02",
        title: "Part 5 Mini-drill",
        type: "Quiz",
        duration: "7 min",
        focus: "Chọn động từ đúng ở thì quá khứ/hiện tại",
      },
      {
        id: "svo-task-03",
        title: "Email 3 câu",
        type: "Writing",
        duration: "10 min",
        focus: "Ghép 3 câu SVO đúng chuẩn TOEIC",
      },
    ],
  },
  {
    id: "perfect-vs-past-status",
    title: "Hiện tại hoàn thành vs Quá khứ đơn trong báo cáo",
    level: "toeic-455-600",
    track: "Grammar & Usage",
    description:
      "Phân biệt kết quả ảnh hưởng hiện tại và hành động đã kết thúc để viết update mạch lạc.",
    tags: ["part 5", "timeline", "status"],
    learningFocus: [
      "Signal words: already, just, recently, ago",
      "Mở báo cáo bằng hiện tại hoàn thành, bổ trợ bằng quá khứ đơn",
      "Nhận bẫy thì trong Part 3/4 (nghe) và Part 7 (đọc)",
    ],
    progress: 54,
    durationMinutes: 35,
    sessionsCompleted: 2,
    status: "in-progress",
    accentClass: "from-mint-50/10 via-mint-50/5 to-transparent",
    heroSentence: "We have finished the QA checks, but the rollout started only yesterday.",
    objective: "Tường thuật 3 mốc tiến độ dùng đúng cả hai thì.",
    successMetric: "Đạt 8/10 câu Part 5 về thì với ≤1 lỗi.",
    grammarFocus: {
      explanation:
        "Hiện tại hoàn thành nhấn mạnh kết quả liên quan hiện tại; quá khứ đơn gắn với mốc thời gian rõ ràng.",
      rules: [
        "Dùng have/has + V3 với thời gian chưa kết thúc (this week, recently).",
        "Dùng V2 với mốc quá khứ rõ (yesterday, in 2022, last night).",
        "Mở báo cáo bằng hiện tại hoàn thành, sau đó thêm chi tiết bằng quá khứ đơn.",
      ],
      pitfalls: [
        "Dùng ago với hiện tại hoàn thành",
        "Quên have/has trong câu dài",
        "Nhầm lẫn giữa since/for",
      ],
    },
    interactiveExamples: {
      mcq: {
        id: "perfect-past-mcq",
        question:
          "Chọn đáp án đúng: We ____ the onboarding emails, but the campaign ____ last Friday.",
        options: [
          { id: "a", label: "have finalised / launched" },
          { id: "b", label: "finalised / has launched" },
          { id: "c", label: "have finalised / launched" },
          { id: "d", label: "finalised / have launched" },
        ],
        answer: "c",
        rationale:
          "Kết quả còn ảnh hưởng hiện tại: have finalised; chiến dịch đã diễn ra với mốc thời gian: launched.",
      },
      cloze: {
        id: "perfect-past-cloze",
        prompt: "Chọn have/has + V3 hay V2:",
        sentence: "The vendor ____ the documents, but we signed the contract yesterday.",
        answer: "has sent",
        hint: "Kết quả liên quan hiện tại",
        rationale:
          "Tài liệu đang được xem, nên dùng hiện tại hoàn thành cho mệnh đề đầu.",
      },
    },
    relatedExercises: [
      {
        id: "timeline-drills",
        title: "Sắp xếp dòng thời gian",
        type: "quiz",
        duration: "10 min",
        link: "/dashboard?module=timeline",
        targetScoreRange: { min: 455, max: 600, label: "TOEIC 455–600" },
      },
      {
        id: "standup-retell",
        title: "Thu âm recap 60s",
        type: "speaking",
        duration: "12 min",
        link: "/dashboard?module=retell",
        targetScoreRange: { min: 455, max: 600, label: "TOEIC 455–600" },
      },
      {
        id: "error-hunt",
        title: "Sửa lỗi thì trong email",
        type: "writing",
        duration: "8 min",
        link: "/dashboard?module=error-hunt",
        targetScoreRange: { min: 455, max: 600, label: "TOEIC 455–600" },
      },
    ],
    tasks: [
      {
        id: "perfect-task-01",
        title: "Nghe & gạch chân mốc thời gian",
        type: "Listening Lab",
        duration: "6 min",
        focus: "Nhận biết thì qua tín hiệu thời gian",
      },
      {
        id: "perfect-task-02",
        title: "Viết lại QA update",
        type: "Writing Sprint",
        duration: "9 min",
        focus: "Phối hợp 2 thì trong 1 đoạn",
      },
      {
        id: "perfect-task-03",
        title: "Mini presentation",
        type: "Speaking",
        duration: "12 min",
        focus: "Thuyết trình 3 mốc tiến độ",
      },
    ],
  },
  {
    id: "reported-speech-recap",
    title: "Câu tường thuật trong recap meeting",
    level: "toeic-455-600",
    track: "Collaboration",
    description:
      "Tường thuật lời đồng đội đúng thì, đúng đại từ để viết recap/email không lệch ý.",
    tags: ["communication", "feedback", "meetings"],
    learningFocus: [
      "Backshift thì khi động từ tường thuật ở quá khứ",
      "Chọn reporting verbs lịch sự: say, tell, mention, explain",
      "Đổi thì/đại từ/thời gian (today → that day) đúng chuẩn TOEIC",
    ],
    progress: 68,
    durationMinutes: 32,
    sessionsCompleted: 3,
    status: "in-progress",
    accentClass: "from-amber-200/40 via-orange-100 to-transparent",
    heroSentence: "Sara said the API team was drafting the monitoring plan.",
    objective: "Ghi lại 3 ý chính của team mà không sai thì/đại từ.",
    successMetric: "Viết recap 120 từ với 0 lỗi backshift.",
    grammarFocus: {
      explanation:
        "Khi động từ tường thuật ở quá khứ, lùi thì cho mệnh đề được trích dẫn trừ khi thông tin vẫn đúng.",
      rules: [
        "Hiện tại đơn → Quá khứ đơn (is → was)",
        "Will → would; can → could",
        "Giữ thì nguyên nếu sự thật vẫn đúng (The sun rises in the east)",
      ],
      pitfalls: [
        "Quên đổi thời gian (today → that day)",
        "Nhầm lẫn giữa say và tell",
        "Bỏ that khiến câu cụt, thiếu mạch",
      ],
    },
    interactiveExamples: {
      mcq: {
        id: "reported-mcq",
        question:
          "Chọn đáp án tốt nhất: The manager said, 'We will review the contract tomorrow.'",
        options: [
          { id: "a", label: "The manager said we review the contract tomorrow." },
          { id: "b", label: "The manager said we would review the contract the next day." },
          { id: "c", label: "The manager said that we will review the contract the next day." },
          { id: "d", label: "The manager says we would review the contract tomorrow." },
        ],
        answer: "b",
        rationale:
          "Will → would và tomorrow → the next day khi backshift từ quá khứ.",
      },
      cloze: {
        id: "reported-cloze",
        prompt: "Điền đúng dạng backshift:",
        sentence:
          "She said the vendor ____ the files the next day.",
        answer: "would deliver",
        hint: "Will → would",
        rationale:
          "Câu gốc ở tương lai đơn nên lùi về would + V nguyên mẫu.",
      },
    },
    relatedExercises: [
      {
        id: "recap-email",
        title: "Mẫu recap 120 từ",
        type: "writing",
        duration: "11 min",
        link: "/dashboard?module=recap",
        targetScoreRange: { min: 455, max: 600, label: "TOEIC 455–600" },
      },
      {
        id: "listening-sync",
        title: "Audio team sync",
        type: "listening",
        duration: "9 min",
        link: "/dashboard?module=sync-audio",
        targetScoreRange: { min: 455, max: 600, label: "TOEIC 455–600" },
      },
      {
        id: "verb-quiz",
        title: "Reporting verb ladder",
        type: "quiz",
        duration: "7 min",
        link: "/dashboard?module=verb-ladder",
        targetScoreRange: { min: 455, max: 600, label: "TOEIC 455–600" },
      },
    ],
    tasks: [
      {
        id: "reported-task-01",
        title: "Gạch chân động từ cần lùi",
        type: "Listening",
        duration: "5 min",
        focus: "Nhận biết thì cần backshift trong audio",
      },
      {
        id: "reported-task-02",
        title: "Viết recap 3 câu",
        type: "Writing",
        duration: "10 min",
        focus: "Đổi đại từ/thời gian đúng chuẩn",
      },
      {
        id: "reported-task-03",
        title: "Peer review",
        type: "Collaboration",
        duration: "8 min",
        focus: "Soát lỗi backshift",
      },
    ],
  },
  {
    id: "second-conditional-risk",
    title: "Câu điều kiện loại 2 cho cảnh báo rủi ro",
    level: "toeic-605-850",
    track: "Decision Making",
    description:
      "Dùng if + past simple, would + V để nêu rủi ro, đề xuất phương án trong meeting.",
    tags: ["risk", "negotiation", "strategy"],
    learningFocus: [
      "If-clause ở past simple dù nói về hiện tại",
      "Would/could/might để diễn đạt mức độ tác động",
      "Cân bằng mệnh đề nguyên nhân – kết quả",
    ],
    progress: 22,
    durationMinutes: 40,
    sessionsCompleted: 1,
    status: "recommended",
    accentClass: "from-emerald-200/50 via-teal-100 to-transparent",
    heroSentence: "If the vendor missed another sprint, we would trigger the backup plan immediately.",
    objective: "Nói/viết 3 cảnh báo rủi ro dùng would rõ ràng.",
    successMetric: "Slide risk có 3 câu điều kiện, không dùng will sai chỗ.",
    grammarFocus: {
      explanation:
        "Câu điều kiện loại 2 giả định tình huống ít có thật; if + past simple, mệnh đề chính dùng would/could/might + V.",
      rules: [
        "If + past simple (If the feature slipped...).",
        "Mệnh đề kết quả dùng would/could/might + V nguyên mẫu.",
        "Đảo vị trí hai mệnh đề vẫn giữ dấu phẩy khi if đứng trước.",
      ],
      pitfalls: [
        "Dùng will ở mệnh đề if",
        "Dùng hiện tại đơn thay vì past simple",
        "Quên dấu phẩy khi đảo mệnh đề",
      ],
    },
    interactiveExamples: {
      mcq: {
        id: "conditional-mcq",
        question:
          "Chọn đáp án tốt nhất: If logistics (be) late again, we ____ penalties.",
        options: [
          { id: "a", label: "will face" },
          { id: "b", label: "would face" },
          { id: "c", label: "face" },
          { id: "d", label: "are facing" },
        ],
        answer: "b",
        rationale:
          "Câu điều kiện loại 2: if + past simple (were), mệnh đề chính dùng would face.",
      },
      cloze: {
        id: "conditional-cloze",
        prompt: "Điền động từ đúng:",
        sentence: "If the client ____ earlier, we would launch on time.",
        answer: "approved",
        hint: "Past simple sau if",
        rationale:
          "If-clause dùng past simple dù nói về hiện tại/giả định.",
      },
    },
    relatedExercises: [
      {
        id: "risk-canvas",
        title: "Bản đồ rủi ro",
        type: "writing",
        duration: "15 min",
        link: "/dashboard?module=risk-canvas",
        targetScoreRange: { min: 605, max: 850, label: "TOEIC 605–850" },
      },
      {
        id: "meeting-roleplay",
        title: "Role-play họp stakeholder",
        type: "speaking",
        duration: "14 min",
        link: "/dashboard?module=roleplay",
        targetScoreRange: { min: 605, max: 850, label: "TOEIC 605–850" },
      },
      {
        id: "grammar-drills",
        title: "Flashcard cấu trúc",
        type: "quiz",
        duration: "7 min",
        link: "/dashboard?module=flashcards",
        targetScoreRange: { min: 605, max: 850, label: "TOEIC 605–850" },
      },
    ],
    tasks: [
      {
        id: "conditional-task-01",
        title: "Brainstorm if-clause",
        type: "Canvas",
        duration: "10 min",
        focus: "Liệt kê rủi ro + hậu quả",
      },
      {
        id: "conditional-task-02",
        title: "Voice note cảnh báo",
        type: "Speaking",
        duration: "6 min",
        focus: "Giữ tông bình tĩnh, dùng would",
      },
      {
        id: "conditional-task-03",
        title: "Slide copy",
        type: "Writing",
        duration: "9 min",
        focus: "Tóm tắt phương án giảm thiểu",
      },
    ],
  },
  {
    id: "phrasal-verbs-ops",
    title: "Phrasal verbs cho ops update",
    level: "toeic-605-850",
    track: "Fluency",
    description:
      "Dùng phrasal verb tự nhiên trong báo cáo sự cố, tránh dịch word-by-word.",
    tags: ["fluency", "idioms", "operations"],
    learningFocus: [
      "Chia động từ tách/không tách tân ngữ",
      "Chọn sắc thái trang trọng phù hợp email/meeting",
      "Nhấn trọng âm đúng ở particle khi nói",
    ],
    progress: 12,
    durationMinutes: 28,
    sessionsCompleted: 0,
    status: "recommended",
    accentClass: "from-purple-200/40 via-fuchsia-100 to-transparent",
    heroSentence: "We rolled out the fix and rolled back the faulty build within an hour.",
    objective: "Thêm 5 phrasal verb đúng ngữ cảnh vào update ngày mai.",
    successMetric: "Thu âm 60s dùng đủ 5 phrasal verb, không sai ngữ pháp.",
    grammarFocus: {
      explanation:
        "Phrasal verb là động từ + particle; nghĩa có thể khác hoàn toàn. Kiểm tra xem tân ngữ có chen vào giữa được không.",
      rules: [
        "Phrasal verb tách được: turn off the lights / turn the lights off.",
        "Particle nhấn âm khi nói để người nghe bắt kịp (roll OUT).",
        "Tránh phrasal quá casual trong email trang trọng (start vs kick off).",
      ],
      pitfalls: [
        "Dịch từng từ gây sai nghĩa",
        "Bỏ tân ngữ làm câu mơ hồ",
        "Dùng phrasal informal trong báo cáo formal",
      ],
    },
    interactiveExamples: {
      mcq: {
        id: "phrasal-mcq",
        question:
          "Chọn phrasal verb phù hợp: We need to ____ the old access badges by Friday.",
        options: [
          { id: "a", label: "phase out" },
          { id: "b", label: "break down" },
          { id: "c", label: "bring over" },
          { id: "d", label: "hand in" },
        ],
        answer: "a",
        rationale:
          "Phase out = loại bỏ dần, đúng cho thẻ cũ; các đáp án khác không hợp ngữ cảnh.",
      },
      cloze: {
        id: "phrasal-cloze",
        prompt: "Điền phrasal verb",
        sentence: "The ops squad ____ the incident within 20 minutes, so downtime stayed low.",
        answer: "sorted out",
        hint: "Cụm nghĩa là 'resolve'",
        rationale:
          "Sorted out diễn tả xử lý gọn vấn đề, thường gặp trong báo cáo sự cố.",
      },
    },
    relatedExercises: [
      {
        id: "verb-drill",
        title: "Bảng kéo thả phrasal",
        type: "quiz",
        duration: "6 min",
        link: "/dashboard?module=phrasal-drill",
        targetScoreRange: { min: 605, max: 850, label: "TOEIC 605–850" },
      },
      {
        id: "shadowing",
        title: "Shadowing native clip",
        type: "speaking",
        duration: "12 min",
        link: "/dashboard?module=shadowing",
        targetScoreRange: { min: 605, max: 850, label: "TOEIC 605–850" },
      },
      {
        id: "update-template",
        title: "Template update ops",
        type: "writing",
        duration: "9 min",
        link: "/dashboard?module=ops-template",
        targetScoreRange: { min: 605, max: 850, label: "TOEIC 605–850" },
      },
    ],
    tasks: [
      {
        id: "phrasal-task-01",
        title: "Phân loại phrasal",
        type: "Vocabulary",
        duration: "7 min",
        focus: "Chọn particle đúng ngữ cảnh",
      },
      {
        id: "phrasal-task-02",
        title: "Shadow audio",
        type: "Speaking",
        duration: "8 min",
        focus: "Bắt nhịp và trọng âm particle",
      },
      {
        id: "phrasal-task-03",
        title: "Rewrite ops update",
        type: "Writing",
        duration: "10 min",
        focus: "Đổi động từ thường sang phrasal tự nhiên",
      },
    ],
  },
  {
    id: "reduced-clauses-briefing",
    title: "Mệnh đề rút gọn cho briefing ngắn gọn",
    level: "toeic-850-990",
    track: "Advanced Clarity",
    description:
      "Rút gọn mệnh đề quan hệ để Part 7 dễ đọc, email/report gọn mà vẫn rõ nghĩa.",
    tags: ["part 7", "conciseness", "style"],
    learningFocus: [
      "Rút gọn chủ động (which + V-ing) và bị động (which + V3)",
      "Đặt mệnh đề rút gọn đúng vị trí để tránh mơ hồ",
      "Phối hợp với mệnh đề chính cho flow mượt trong briefing",
    ],
    progress: 8,
    durationMinutes: 34,
    sessionsCompleted: 0,
    status: "recommended",
    accentClass: "from-indigo-200/50 via-indigo-100 to-transparent",
    heroSentence: "The attached documents list the specs for Q3.",
    objective: "Viết briefing 150 từ dùng 3 mệnh đề rút gọn rõ ràng.",
    successMetric: "Đáp đúng 8/10 câu Part 7 về mệnh đề rút gọn.",
    grammarFocus: {
      explanation:
        "Mệnh đề rút gọn giúp câu ngắn hơn: chủ động dùng V-ing, bị động dùng V3/ed. Đặt ngay sau danh từ được bổ nghĩa.",
      rules: [
        "Which/that + be + V-ing → V-ing (documents that are pending → documents pending)",
        "Which/that + be + V3 → V3/ed (files that are attached → files attached)",
        "Chủ ngữ của mệnh đề rút gọn phải trùng với danh từ đứng trước",
      ],
      pitfalls: [
        "Rút gọn sai chủ ngữ gây hiểu nhầm",
        "Giữ be khiến câu dài không cần thiết",
        "Đặt mệnh đề rút gọn quá xa danh từ",
      ],
    },
    interactiveExamples: {
      mcq: {
        id: "reduced-mcq",
        question:
          "Chọn câu rút gọn đúng: The documents that are attached list the specs.",
        options: [
          { id: "a", label: "The documents attaching list the specs." },
          { id: "b", label: "The attached documents list the specs." },
          { id: "c", label: "The documents attached are listing the specs." },
          { id: "d", label: "The documents which attached list the specs." },
        ],
        answer: "b",
        rationale:
          "Bị động rút gọn: be + V3 → V3; 'attached documents' gọn, đúng nghĩa.",
      },
      cloze: {
        id: "reduced-cloze",
        prompt: "Điền dạng rút gọn:",
        sentence: "The slides, ____ yesterday, summarize the roadmap.",
        answer: "prepared",
        hint: "Bị động rút gọn, bỏ be",
        rationale:
          "Which were prepared → prepared; đặt ngay sau danh từ slides.",
      },
    },
    relatedExercises: [
      {
        id: "part7-reduced",
        title: "Part 7: tìm mệnh đề rút gọn",
        type: "reading",
        duration: "12 min",
        link: "/dashboard?module=reduced-reading",
        targetScoreRange: { min: 850, max: 990, label: "TOEIC 850–990" },
      },
      {
        id: "brevity-email",
        title: "Email ngắn gọn 150 từ",
        type: "writing",
        duration: "14 min",
        link: "/dashboard?module=brevity-email",
        targetScoreRange: { min: 850, max: 990, label: "TOEIC 850–990" },
      },
      {
        id: "audio-brief",
        title: "Shadowing briefing 60s",
        type: "speaking",
        duration: "8 min",
        link: "/dashboard?module=audio-brief",
        targetScoreRange: { min: 850, max: 990, label: "TOEIC 850–990" },
      },
    ],
    tasks: [
      {
        id: "reduced-task-01",
        title: "Highlight mệnh đề rút gọn",
        type: "Reading",
        duration: "7 min",
        focus: "Nhận dạng V-ing/V3 rút gọn",
      },
      {
        id: "reduced-task-02",
        title: "Rút gọn câu trong brief",
        type: "Writing",
        duration: "10 min",
        focus: "Đặt mệnh đề rút gọn sát danh từ",
      },
      {
        id: "reduced-task-03",
        title: "Voice note 60s",
        type: "Speaking",
        duration: "9 min",
        focus: "Đọc brief mạch lạc, nhấn thông tin chính",
      },
    ],
  },
];

export const getTopicById = (id: string) => TOPIC_LIBRARY.find((topic) => topic.id === id) ?? null;
