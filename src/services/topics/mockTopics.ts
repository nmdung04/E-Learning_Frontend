// Mock topics data split for easier management
// Types are exported for reuse across components/services
export type ToeicLevel =
  | "toeic-0-450"
  | "toeic-455-600"
  | "toeic-605-850"
  | "toeic-850-990";

export type TopicStatus =
  | "recommended"
  | "in-progress"
  | "locked"
  | "completed";

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
  initialLessonId: number;
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
  thumbnail?: string;
  accentClass: string;
  heroSentence: string;
  objective: string;
  grammarFocus: {
    explanation: string;
    rules: string[];
    pitfalls: string[];
  };
  tasks: TopicTask[];
};

export const TOEIC_LEVEL_LABELS: Record<ToeicLevel, string> = {
  "toeic-0-450": "TOEIC 0–450",
  "toeic-455-600": "TOEIC 455–600",
  "toeic-605-850": "TOEIC 605–850",
  "toeic-850-990": "TOEIC 850–990",
};

export const mockTopics: TopicRecord[] = [
  {
    id: "office-email-basics",
    title: "Office emails: basic accuracy",
    initialLessonId: 169,
    level: "toeic-0-450",
    track: "Foundation",
    description: "Viết email nội bộ ngắn gọn, đúng S–V–O, tránh lỗi thì cơ bản.",
    tags: ["office", "part 5", "word order"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Spot subject–verb agreement in short notices",
      "Place adverbs and adjectives correctly in updates",
    ],
    progress: 20,
    durationMinutes: 28,
    sessionsCompleted: 1,
    status: "in-progress",
    thumbnail: "/images/topics/officeEmails.webp",
    accentClass: "from-sky-200/50 via-blue-100 to-transparent",
    heroSentence: "The team completed the checklist before noon.",
    objective: "Soạn 2 email nội bộ 60 từ không lỗi chia động từ.",
    grammarFocus: {
      explanation: "Giữ trục S–V–O rõ ràng giúp tránh bẫy trật tự từ trong Part 5/6.",
      rules: [
        "Đặt trạng từ tần suất trước động từ thường, sau be.",
        "Tính từ đứng trước danh từ; trạng từ bổ nghĩa cho động từ/câu.",
        "Ngôi thứ 3 số ít cần -s ở hiện tại đơn.",
      ],
      pitfalls: ["Quên -s", "Nhầm adj/adv", "Đặt trạng từ sai vị trí"],
    },
    
    tasks: [
      {
        id: "office-task-skim",
        title: "Skimming email headers",
        type: "Skimming",
        duration: "4 min",
        focus: "Đọc nhanh subject line để xác định động từ chính",
      },
      {
        id: "office-task-analyze",
        title: "Detailed analysis of notices",
        type: "Detailed Analysis",
        duration: "6 min",
        focus: "Khoanh S–V–O và trạng từ trong 5 câu thông báo",
      },
      {
        id: "office-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Ôn 10 động từ văn phòng phổ biến",
      },
    ],
  },
  {
    id: "travel-itinerary",
    initialLessonId: 170,
    title: "Travel itinerary confirmations",
    level: "toeic-0-450",
    track: "Foundation",
    description: "Đọc hiểu và xác nhận lịch công tác, tránh nhầm giờ và địa điểm.",
    tags: ["travel", "schedule", "part 7"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Identify time/date cues in itineraries",
      "Clarify prepositions of time and place",
    ],
    progress: 0,
    durationMinutes: 26,
    sessionsCompleted: 0,
    status: "locked",
    thumbnail: "/images/topics/travelItineraryConfirmations.webp",
    accentClass: "from-cyan-200/40 via-blue-100 to-transparent",
    heroSentence: "The flight departs at 7:45 a.m. from Gate 18.",
    objective: "Xác nhận 3 lịch trình mà không bỏ sót giờ bay.",
    grammarFocus: {
      explanation: "Giới từ thời gian/địa điểm và thì hiện tại đơn cho lịch trình.",
      rules: ["Dùng at cho giờ, on cho ngày cụ thể, in cho tháng/năm.", "Hiện tại đơn mô tả thời khóa biểu.", "Gắn địa điểm với from/to correctly."],
      pitfalls: ["Nhầm at/on/in", "Bỏ múi giờ", "Hiểu sai gate vs terminal"],
    },
    tasks: [
      {
        id: "travel-task-skim",
        title: "Skimming itineraries",
        type: "Skimming",
        duration: "4 min",
        focus: "Quét nhanh giờ bay và số cổng",
      },
      {
        id: "travel-task-analyze",
        title: "Detailed analysis of notices",
        type: "Detailed Analysis",
        duration: "6 min",
        focus: "Xác định ngày/giờ và điều kiện đổi vé",
      },
      {
        id: "travel-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Học 12 từ về chuyến bay và khách sạn",
      },
    ],
  },
  {
    id: "shipping-updates",
    initialLessonId: 171,
    title: "Shipping updates for clients",
    level: "toeic-0-450",
    track: "Operations",
    description: "Đọc và phản hồi cập nhật giao hàng, tránh nhầm lịch và số kiện.",
    tags: ["shipping", "ops", "part 6"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Track quantities and dates in shipment notes",
      "Use present simple for routine logistics",
    ],
    progress: 100,
    durationMinutes: 25,
    sessionsCompleted: 2,
    status: "completed",
    thumbnail: "/images/topics/Shipping_updates_for_clients.webp",
    accentClass: "from-lime-200/40 via-green-100 to-transparent",
    heroSentence: "The crates will arrive on Wednesday and be stored in Bay C.",
    objective: "Phản hồi 2 email giao hàng mà không sai số kiện.",
    grammarFocus: {
      explanation: "Thì tương lai đơn và hiện tại đơn cho lịch giao hàng; bị động mô tả quy trình.",
      rules: ["Dùng will cho lịch giao hàng mới thông báo.", "Bị động để nhấn quy trình (will be stored).", "Hiện tại đơn cho lịch lặp lại."],
      pitfalls: ["Nhầm thì với lịch cố định", "Bỏ mạo từ trước địa điểm", "Sai số nhiều/ít"],
    },
    tasks: [
      {
        id: "ship-task-skim",
        title: "Skimming delivery notes",
        type: "Skimming",
        duration: "3 min",
        focus: "Quét ngày đến và vị trí kho",
      },
      {
        id: "ship-task-analyze",
        title: "Detailed analysis of manifests",
        type: "Detailed Analysis",
        duration: "6 min",
        focus: "Đếm số kiện và đối chiếu với PO",
      },
      {
        id: "ship-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Thuộc 8 thuật ngữ logistics (pallet, crate, bay...)",
      },
    ],
  },
  {
    id: "contract-terms-review",
    initialLessonId: 172,
    title: "Contract terms review",
    level: "toeic-455-600",
    track: "Compliance",
    description: "Đọc điều khoản hợp đồng, phân biệt nghĩa vụ và thời hạn.",
    tags: ["contract", "part 7", "legal"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Distinguish obligations vs conditions in clauses",
      "Clarify modal verbs for requirements",
    ],
    progress: 35,
    durationMinutes: 32,
    sessionsCompleted: 1,
    status: "in-progress",
    thumbnail: "/images/topics/Contract_terms_review.webp",
    accentClass: "from-amber-200/40 via-yellow-100 to-transparent",
    heroSentence: "The vendor shall deliver the components within 30 days of signing.",
    objective: "Đánh dấu 5 nghĩa vụ và 3 điều kiện trong hợp đồng mẫu.",
    grammarFocus: {
      explanation: "Modal verbs diễn tả nghĩa vụ; mệnh đề điều kiện chỉ kích hoạt nghĩa vụ.",
      rules: ["Shall/must diễn tả bắt buộc; should khuyến nghị.", "If-clause hiện tại đơn + will/shall cho kết quả.", "Phân biệt unless/except when trong điều kiện."],
      pitfalls: ["Nhầm shall/should", "Bỏ điều kiện phụ", "Hiểu sai within/by"],
    },
    tasks: [
      {
        id: "contract-task-skim",
        title: "Skimming clauses",
        type: "Skimming",
        duration: "4 min",
        focus: "Quét shall/must để định vị nghĩa vụ",
      },
      {
        id: "contract-task-analyze",
        title: "Detailed analysis of conditions",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Tách điều kiện if/unless và nghĩa vụ kèm theo",
      },
      {
        id: "contract-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Học 12 thuật ngữ hợp đồng (liability, indemnity...)",
      },
    ],
  },
  {
    id: "marketing-campaign-updates",
    initialLessonId: 173,
    title: "Marketing campaign updates",
    level: "toeic-455-600",
    track: "Marketing",
    description: "Tường thuật tiến độ chiến dịch, so sánh mốc đã đạt và sắp tới.",
    tags: ["marketing", "status", "timeline"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Narrate progress using present perfect vs past simple",
      "Highlight KPIs with concise language",
    ],
    progress: 70,
    durationMinutes: 34,
    sessionsCompleted: 2,
    status: "completed",
    thumbnail: "/images/topics/Marketing_campaign_updates.webp",
    accentClass: "from-pink-200/30 via-rose-100 to-transparent",
    heroSentence: "We have launched the teaser ads, and the main rollout started yesterday.",
    objective: "Tóm tắt 3 mốc chiến dịch bằng 2 thì chính xác.",
    grammarFocus: {
      explanation: "Hiện tại hoàn thành cho kết quả liên quan hiện tại; quá khứ đơn cho mốc cụ thể.",
      rules: ["Have/has + V3 với thời gian chưa kết thúc.", "V2 với mốc rõ ràng (yesterday, last week).", "Đặt KPI sau động từ để rõ nghĩa."],
      pitfalls: ["Lẫn have/has", "Dùng ago với present perfect", "Nhầm since/for"],
    },
    tasks: [
      {
        id: "marketing-task-skim",
        title: "Skimming KPI tables",
        type: "Skimming",
        duration: "4 min",
        focus: "Quét nhanh KPI chính (CTR, CVR, spend)",
      },
      {
        id: "marketing-task-analyze",
        title: "Detailed analysis of progress",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Đặt thì đúng cho mốc đạt/đang diễn ra",
      },
      {
        id: "marketing-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Nhớ 10 thuật ngữ marketing (teaser, rollout, CTR...)",
      },
    ],
  },
  {
    id: "personnel-briefings",
    initialLessonId: 174,
    title: "Personnel briefing notes",
    level: "toeic-455-600",
    track: "HR",
    description: "Tóm tắt thay đổi nhân sự, ghi chú chuyển bộ phận và lịch onboarding.",
    tags: ["personnel", "briefing", "hr"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Summarize personnel moves with clarity",
      "Use passive voice to highlight actions",
    ],
    progress: 10,
    durationMinutes: 30,
    sessionsCompleted: 0,
    status: "locked",
    thumbnail: "/images/topics/Personnel_briefing_notes.webp",
    accentClass: "from-emerald-200/40 via-teal-100 to-transparent",
    heroSentence: "Two analysts were reassigned to the product team last week.",
    objective: "Viết briefing 120 từ về thay đổi nhân sự.",
    grammarFocus: {
      explanation: "Bị động nhấn hành động hơn chủ thể, phù hợp thông báo nhân sự.",
      rules: ["Be + V3 theo thì (were reassigned).", "Dùng by + agent khi cần rõ nguồn.", "Giữ trật tự thời gian rõ ràng."],
      pitfalls: ["Thiếu be", "Nhầm V3/V-ed", "Lặp chủ ngữ gây dư thừa"],
    },
    tasks: [
      {
        id: "hr-task-skim",
        title: "Skimming HR memos",
        type: "Skimming",
        duration: "4 min",
        focus: "Quét thay đổi vị trí và ngày hiệu lực",
      },
      {
        id: "hr-task-analyze",
        title: "Detailed analysis of changes",
        type: "Detailed Analysis",
        duration: "6 min",
        focus: "Xác định thì và agent trong câu bị động",
      },
      {
        id: "hr-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Học 10 từ HR (reassign, onboard, tenure...)",
      },
    ],
  },
  {
    id: "office-negotiation",
    initialLessonId: 175,
    title: "Office resource negotiation",
    level: "toeic-605-850",
    track: "Negotiation",
    description: "Đề xuất và thương lượng tài nguyên, dùng câu điều kiện và cấu trúc lịch sự.",
    tags: ["office", "negotiation", "conditional"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Use second conditionals to discuss risks",
      "Balance polite requests with clear outcomes",
    ],
    progress: 45,
    durationMinutes: 38,
    sessionsCompleted: 1,
    status: "in-progress",
    thumbnail: "/images/topics/Office_resource_negotiation.webp",
    accentClass: "from-indigo-200/40 via-slate-100 to-transparent",
    heroSentence: "If the vendor missed another sprint, we would trigger the backup plan.",
    objective: "Viết 3 đề xuất dùng would/could rõ ràng.",
    grammarFocus: {
      explanation: "Điều kiện loại 2 giả định hiện tại; if + past simple, main clause dùng would/could.",
      rules: ["If + past simple cho mệnh đề giả định.", "Main clause dùng would/could + V.", "Đảo mệnh đề cần dấu phẩy sau if-clause."],
      pitfalls: ["Dùng will sau if", "Dùng hiện tại đơn ở main clause", "Thiếu dấu phẩy"],
    },
    tasks: [
      {
        id: "negotiation-task-skim",
        title: "Skimming risk bullets",
        type: "Skimming",
        duration: "4 min",
        focus: "Quét rủi ro để ghép với if-clause",
      },
      {
        id: "negotiation-task-analyze",
        title: "Detailed analysis of scenarios",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Chọn động từ past simple và would/could phù hợp",
      },
      {
        id: "negotiation-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Thuộc 10 cụm negotiation (leverage, concession...)",
      },
    ],
  },
  {
    id: "travel-incident-report",
    initialLessonId: 176,
    title: "Travel incident reports",
    level: "toeic-605-850",
    track: "Operations",
    description: "Viết báo cáo sự cố chuyến đi, mô tả hậu quả và hành động khắc phục.",
    tags: ["travel", "incident", "report"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Sequence events using past simple and past perfect",
      "Highlight mitigation steps concisely",
    ],
    progress: 0,
    durationMinutes: 36,
    sessionsCompleted: 0,
    status: "locked",
    thumbnail: "/images/topics/Travel_incident_reports.webp",
    accentClass: "from-orange-200/30 via-amber-100 to-transparent",
    heroSentence: "The flight had been delayed, so we arranged hotel vouchers immediately.",
    objective: "Soạn báo cáo 150 từ với mốc thời gian rõ.",
    grammarFocus: {
      explanation: "Past perfect nêu sự kiện xảy ra trước mốc quá khứ; past simple cho chuỗi sự kiện.",
      rules: ["Had + V3 cho sự kiện xảy ra trước.", "Past simple cho hành động chính sau đó.", "Dùng connectors (so, because) để rõ quan hệ."],
      pitfalls: ["Lạm dụng past perfect", "Thiếu mốc thời gian", "Nhầm had + V2"],
    },
    tasks: [
      {
        id: "incident-task-skim",
        title: "Skimming timeline",
        type: "Skimming",
        duration: "4 min",
        focus: "Gạch chân mốc giờ chính trong báo cáo",
      },
      {
        id: "incident-task-analyze",
        title: "Detailed analysis of causes",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Chọn past perfect cho sự kiện xảy ra trước",
      },
      {
        id: "incident-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Học 12 từ sự cố (voucher, reroute, compensate...)",
      },
    ],
  },
  {
    id: "marketing-presentation",
    initialLessonId: 177,
    title: "Marketing presentation rehearsal",
    level: "toeic-605-850",
    track: "Speaking",
    description: "Luyện trình bày deck marketing, nhấn điểm chính và xử lý Q&A.",
    tags: ["marketing", "presentation", "speaking"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Use signposting language to guide listeners",
      "Handle clarifying questions concisely",
    ],
    progress: 90,
    durationMinutes: 33,
    sessionsCompleted: 3,
    status: "completed",
    thumbnail: "/images/topics/Marketing_presentation_rehearsal.webp",
    accentClass: "from-purple-200/40 via-fuchsia-100 to-transparent",
    heroSentence: "First, we'll review the funnel, then highlight the top-performing channels.",
    objective: "Trình bày deck 6 slide trong 3 phút, rõ signpost.",
    grammarFocus: {
      explanation: "Dùng linking devices và thì hiện tại đơn/tiếp diễn để mô tả slide và hành động đang diễn ra.",
      rules: ["Dùng first, next, finally để signpost.", "Hiện tại đơn mô tả nội dung slide.", "Hiện tại tiếp diễn cho hoạt động đang diễn ra."],
      pitfalls: ["Thiếu signpost", "Câu quá dài", "Lẫn thì không cần thiết"],
    },
    tasks: [
      {
        id: "presentation-task-skim",
        title: "Skimming slide headers",
        type: "Skimming",
        duration: "3 min",
        focus: "Chọn signpost phù hợp từng slide",
      },
      {
        id: "presentation-task-analyze",
        title: "Detailed analysis of flow",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Sắp xếp thứ tự luận điểm và đặt signpost",
      },
      {
        id: "presentation-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Học 10 cụm chuyển ý (to begin, moving on...)",
      },
    ],
  },
  {
    id: "contract-change-order",
    initialLessonId: 178,
    title: "Contract change orders",
    level: "toeic-850-990",
    track: "Advanced Clarity",
    description: "Soạn và phản hồi change order, dùng mệnh đề rút gọn và ngôn ngữ chính xác.",
    tags: ["contract", "change order", "legal"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Streamline clauses with reduced relatives",
      "Use hedging to maintain tone",
    ],
    progress: 60,
    durationMinutes: 35,
    sessionsCompleted: 2,
    status: "in-progress",
    thumbnail: "/images/topics/Contract_change_orders.webp",
    accentClass: "from-indigo-200/50 via-indigo-100 to-transparent",
    heroSentence: "The attached addendum outlines the scope revised last week.",
    objective: "Viết change order 180 từ, rút gọn 3 mệnh đề quan hệ.",
    grammarFocus: {
      explanation: "Mệnh đề rút gọn giúp hợp đồng gọn, rõ: chủ động dùng V-ing, bị động dùng V3.",
      rules: ["Which/that + be + V-ing → V-ing.", "Which/that + be + V3 → V3/ed.", "Đặt mệnh đề rút gọn sát danh từ được bổ nghĩa."],
      pitfalls: ["Sai chủ ngữ rút gọn", "Giữ be dư thừa", "Đặt xa danh từ"],
    },
    tasks: [
      {
        id: "changeorder-task-skim",
        title: "Skimming addenda",
        type: "Skimming",
        duration: "4 min",
        focus: "Nhận diện mệnh đề có thể rút gọn",
      },
      {
        id: "changeorder-task-analyze",
        title: "Detailed analysis of clauses",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Rút gọn which/that + be + V3/V-ing",
      },
      {
        id: "changeorder-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Ôn 12 thuật ngữ change order (addendum, amendment...)",
      },
    ],
  },
  {
    id: "shipping-escalations",
    initialLessonId: 179,
    title: "Shipping escalation emails",
    level: "toeic-850-990",
    track: "Risk Comms",
    description: "Soạn email leo thang khi giao hàng trễ, giữ tông trang trọng và đề xuất giải pháp.",
    tags: ["shipping", "risk", "email"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Layer politeness with firm requests",
      "Use inversions and emphatic structures for clarity",
    ],
    progress: 25,
    durationMinutes: 37,
    sessionsCompleted: 1,
    status: "recommended",
    thumbnail: "/images/topics/Shipping_escalation_emails.webp",
    accentClass: "from-red-200/40 via-rose-100 to-transparent",
    heroSentence: "Should the shipment slip again, we will activate the penalty clause.",
    objective: "Viết email escalation 180 từ, nêu 2 hành động và deadline.",
    grammarFocus: {
      explanation: "Đảo Should/If giúp câu trang trọng; dùng will/can cho yêu cầu rõ.",
      rules: ["Should + S + V, main clause + will/can.", "Giữ tông lịch sự bằng could/would khi đề xuất.", "Đặt deadline rõ ràng với by/end of day."],
      pitfalls: ["Dùng slang", "Thiếu deadline", "Không nêu giải pháp cụ thể"],
    },
    tasks: [
      {
        id: "escalation-task-skim",
        title: "Skimming delay reports",
        type: "Skimming",
        duration: "4 min",
        focus: "Nhận trigger để leo thang (delay, stockout)",
      },
      {
        id: "escalation-task-analyze",
        title: "Detailed analysis of tone",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Chèn cấu trúc Should/If và yêu cầu rõ ràng",
      },
      {
        id: "escalation-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Ôn 10 cụm lịch sự (we request that, kindly expedite...)",
      },
    ],
  },
  {
    id: "personnel-policy-brief",
    initialLessonId: 180,
    title: "Personnel policy brief",
    level: "toeic-850-990",
    track: "Executive Comms",
    description: "Tóm lược chính sách nhân sự mới cho lãnh đạo, đảm bảo mạch lạc và súc tích.",
    tags: ["personnel", "policy", "executive"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Condense policies using parallel structures",
      "Signal exceptions and scope precisely",
    ],
    progress: 80,
    durationMinutes: 31,
    sessionsCompleted: 2,
    status: "completed",
    thumbnail: "/images/topics/Personnel_policy_brief.webp",
    accentClass: "from-green-200/40 via-lime-100 to-transparent",
    heroSentence: "Remote work is approved for teams meeting the readiness criteria.",
    objective: "Viết policy brief 200 từ, rõ phạm vi và ngoại lệ.",
    grammarFocus: {
      explanation: "Song song cấu trúc giúp chính sách dễ đọc; mệnh đề quan hệ rút gọn giữ gọn gàng.",
      rules: ["Dùng parallelism cho danh sách chính sách.", "Rút gọn mệnh đề quan hệ khi chủ ngữ trùng.", "Dùng shall/must cho bắt buộc, may cho tùy chọn."],
      pitfalls: ["Danh sách không song song", "Thiếu phạm vi áp dụng", "Lẫn shall/may"],
    },
    tasks: [
      {
        id: "policy-task-skim",
        title: "Skimming policy bulletins",
        type: "Skimming",
        duration: "4 min",
        focus: "Gạch đầu dòng phạm vi và ngoại lệ",
      },
      {
        id: "policy-task-analyze",
        title: "Detailed analysis of scope",
        type: "Detailed Analysis",
        duration: "7 min",
        focus: "Kiểm tra tính song song và modal verbs",
      },
      {
        id: "policy-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "5 min",
        focus: "Học 10 thuật ngữ policy (scope, exception, enforcement...)",
      },
    ],
  },
  {
    id: "executive-briefing",
    initialLessonId: 177,
    title: "Executive briefing emails",
    level: "toeic-850-990",
    track: "Executive Comms",
    description: "Soạn email ngắn cho lãnh đạo, tóm lược quyết định và next steps rõ.",
    tags: ["executive", "briefing", "summary"],
    learningFocus: [
      "Master scanning techniques for business emails",
      "Front-load decisions for clarity",
      "Use concise action-oriented language",
    ],
    progress: 15,
    durationMinutes: 29,
    sessionsCompleted: 0,
    status: "locked",
    thumbnail: "/images/topics/Executive_briefing_emails.webp",
    accentClass: "from-slate-200/40 via-gray-100 to-transparent",
    heroSentence: "Decision: Proceed with the pilot; Action: finalize vendor shortlist by Thursday.",
    objective: "Viết 3 email brief 120 từ với action rõ.",
    grammarFocus: {
      explanation: "Dùng câu ngắn, chủ động; parallelism cho action list; modal để gợi ý lịch.",
      rules: ["Đặt quyết định lên đầu câu.", "Dùng imperative hoặc should cho hành động.", "Parallel action bullets để dễ đọc."],
      pitfalls: ["Mở đầu lan man", "Thiếu deadline", "Dùng câu bị động dài dòng"],
    },
    tasks: [
      {
        id: "executive-task-skim",
        title: "Skimming decision blocks",
        type: "Skimming",
        duration: "3 min",
        focus: "Xác định decision/action/owner",
      },
      {
        id: "executive-task-analyze",
        title: "Detailed analysis of brevity",
        type: "Detailed Analysis",
        duration: "6 min",
        focus: "Rút gọn câu và giữ hành động rõ",
      },
      {
        id: "executive-task-vocab",
        title: "Vocabulary drill",
        type: "Vocabulary",
        duration: "4 min",
        focus: "Ôn 8 cụm executive (decision, owner, deadline...)",
      },
    ],
  },
];

export default mockTopics;

export const getTopicByLessonId = (lessonId: number): TopicRecord | undefined => {
  return mockTopics.find(topic => topic.initialLessonId === lessonId);
};
