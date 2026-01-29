// Helper functions cho text processing

/**
 * Extract text từ URL hoặc trả về text gốc
 */
export const cleanUrlContent = (path: string): string => {
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

/**
 * Detect ngôn ngữ của text (English hoặc Vietnamese)
 */
export const detectLanguage = (text: string): 'en' | 'vi' => {
  // Remove whitespace
  const trimmed = text.trim();
  
  // Vietnamese characters: à, á, ả, ã, ạ, ă, ằ, ắ, ẳ, ẵ, ặ, â, ầ, ấ, ẩ, ẫ, ậ, etc.
  const vietnameseRegex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]/;
  
  // Nếu có ký tự tiếng Việt
  if (vietnameseRegex.test(trimmed)) {
    return 'vi';
  }
  
  // Default: English
  return 'en';
};

/**
 * Normalize text để so sánh
 */
export const normalizeText = (text: string): string => {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
};
