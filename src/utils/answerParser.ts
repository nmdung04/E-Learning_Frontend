// src/utils/answerParser.ts

/**
 * Hàm tải và xử lý đáp án dựa trên loại bài tập
 */
export const fetchAndParseAnswers = async (
  url: string, 
  partType: string
): Promise<unknown> => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Không tải được file đáp án");
    
    // Lấy text với UTF-8 encoding đúng
    const arrayBuffer = await res.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const rawText = decoder.decode(arrayBuffer);
    const cleanText = rawText.trim();
    
    console.log("📄 Raw text from file:", cleanText);

    switch (partType) {
      case "MULTIPLE_CHOICE":
        return parseMCQ(cleanText);
      case "MATCHING":
        return parseMatching(cleanText);
      case "FILL_IN_BLANK":
        return parseFillBlank(cleanText);
      default:
        console.warn("Unknown part type:", partType);
        return null;
    }
  } catch (error) {
    console.error("Error fetching answers:", error);
    return null;
  }
};

// --- LOGIC PARSE CHI TIẾT ---

/**
 * Loại 1: Trắc nghiệm (A, B, C, D...)
 * Input: "D,C,B,A,D,A"
 * Output: ["D", "C", "B", "A", "D", "A"] (Mảng string, index tương ứng câu hỏi)
 */
const parseMCQ = (text: string) => {
  // 1. Nếu có dấu phẩy hoặc xuống dòng -> Cắt theo mảng
  if (text.includes(",") || text.includes("\n")) {
    return text.split(/[\n,]+/).map(item => item.trim().toUpperCase());
  }
  
  // 2. Trường hợp chuỗi liền (Ví dụ: "AAABA") -> Cắt từng ký tự
  return text.replace(/\s/g, '').split('').map(c => c.toUpperCase());
};

/**
 * Loại 2: Nối từ (digital-kỹ thuật số)
 * Input: "digital-kỹ thuật số,network-mạng lưới..."
 * Output: { "digital": "kỹ thuật số", "network": "mạng lưới", ... }
 */
const parseMatching = (text: string) => {
  const map: Record<string, string> = {};
  
  console.log("📄 Raw matching text:", text);
  
  // Tách các cặp bằng dấu phẩy
  const pairs = text.split(',');
  console.log("📋 Pairs:", pairs);
  
  pairs.forEach((pair, index) => {
    // Tách key-value bằng dấu gạch ngang đầu tiên tìm thấy
    const separatorIndex = pair.indexOf('-');
    if (separatorIndex !== -1) {
      const key = pair.substring(0, separatorIndex).trim();
      const value = pair.substring(separatorIndex + 1).trim();
      
      // Normalize: lowercase và xóa khoảng trắng thừa
      const normalizedKey = key.toLowerCase().replace(/\s+/g, ' ');
      const normalizedValue = value.toLowerCase().replace(/\s+/g, ' ');
      
      console.log(`  Pair ${index + 1}: "${normalizedKey}" <=> "${normalizedValue}"`);
      
      // Lưu 2 chiều để dễ tra cứu (Anh -> Việt hoặc Việt -> Anh)
      map[normalizedKey] = normalizedValue;
      map[normalizedValue] = normalizedKey;
    } else {
      console.warn(`⚠️ Invalid pair format (no '-'): "${pair}"`);
    }
  });
  
  console.log("✅ Final answer map:", map);
  return map;
};

/**
 * Loại 3: Điền từ
 * Input: "hardware,profile"
 * Output: ["hardware", "profile"]
 */
const parseFillBlank = (text: string) => {
  return text.split(/[\n,]+/).map(item => item.trim().toLowerCase());
};
