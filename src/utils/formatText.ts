// src/utils/formatText.ts

export const formatDescription = (text: string) => {
  if (!text) return { title: "", items: [] };

  // Tách văn bản thành các dòng và loại bỏ dòng trống
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== "");
  
  if (lines.length === 0) return { title: "", items: [] };

  return {
    // Dòng đầu tiên là tiêu đề + dấu 2 chấm
    title: `${lines[0]}:`,
    // Các dòng còn lại là mảng để liệt kê
    items: lines.slice(1)
  };
};
