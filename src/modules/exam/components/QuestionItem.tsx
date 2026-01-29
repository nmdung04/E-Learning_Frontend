import type { Question, DisplayOrder } from "../../../services/exam/exam.types";

interface Props {
  question: Question;
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
  isReview?: boolean;
  correctAnswer?: string; // For review mode
}

const IMAGE_PREFIX = "https://e-learn-backend.s3.ap-southeast-2.amazonaws.com/";

export const QuestionItem = ({ question, selectedAnswer, onSelectAnswer, isReview, correctAnswer }: Props) => {
  // Sort display orders by content_order
  const allContents = [...question.displayOrders].sort((a, b) => a.content_order - b.content_order);

  // Partition logic:
  // - Images/Audio are always "Content"
  // - The FIRST text/introduction is "Content" (Question Stem)
  // - Subsequent text items are "Options"
  
  let questionStemFound = false;
  const contentItems: DisplayOrder[] = [];
  const optionItems: DisplayOrder[] = [];

  allContents.forEach((item) => {
    const type = item.content_type?.toLowerCase() || "";
    
    if (type === "image" || type === "audio") {
        contentItems.push(item);
    } else if (type === "text" || type === "introduction") {
        if (!questionStemFound) {
            questionStemFound = true;
            contentItems.push(item);
        } else {
            optionItems.push(item);
        }
    } else {
        // Fallback for unknown types
        contentItems.push(item);
    }
  });

  const renderContent = (content: DisplayOrder) => {
    const type = content.content_type?.toLowerCase();
    
    if (type === "image") {
      return (
        <img 
          key={content.display_order_id} 
          src={`${IMAGE_PREFIX}${content.content_path}`} 
          alt={`Question ${question.question_number}`} 
          className="max-w-full h-auto my-2 rounded-md border"
        />
      );
    }
    
    // Render text content (using description or content_path)
    const text = content.description || content.content_path;
    if (text) {
        return <p key={content.display_order_id} className="mb-2 text-gray-800 whitespace-pre-wrap">{text}</p>;
    }
    return null;
  };

  const renderOptionButton = (optionLabel: string, optionText?: string) => {
      let btnClass = "bg-white text-gray-15 border-white-90 hover:bg-white-95";
      
      if (isReview) {
          if (optionLabel === correctAnswer) {
              btnClass = "bg-mint-50 text-white border-mint-50";
          } else if (optionLabel === selectedAnswer && optionLabel !== correctAnswer) {
              btnClass = "bg-red-500 text-white border-red-500";
          } else if (optionLabel === selectedAnswer) {
               btnClass = "bg-mint-50 text-white border-mint-50";
          }
      } else {
          if (selectedAnswer === optionLabel) {
              btnClass = "bg-mint-50 text-white border-mint-50";
          }
      }

      return (
        <button
          key={optionLabel}
          onClick={() => !isReview && onSelectAnswer(optionLabel)}
          disabled={isReview}
          className={`flex items-start gap-3 w-full p-3 rounded-lg border text-left transition-colors mb-2 ${btnClass}`}
        >
          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border font-bold ${
            selectedAnswer === optionLabel || (isReview && optionLabel === correctAnswer) 
              ? "bg-white/20 border-white/40" 
              : "bg-white-95 border-white-90 text-gray-40"
          }`}>
            {optionLabel}
          </div>
          {optionText && <div className="flex-1 pt-1">{optionText}</div>}
        </button>
      );
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg border border-white-90 shadow-sm">
      <div className="mb-4">
        <span className="font-bold text-mint-50 mr-2">Question {question.question_number}</span>
        {contentItems.map(renderContent)}
      </div>
      
      <div className="flex flex-col gap-2">
        {optionItems.length > 0 ? (
            // Render text-based options
            optionItems.map((opt, idx) => {
                const label = String.fromCharCode(65 + idx); // A, B, C, D...
                return renderOptionButton(label, opt.description || opt.content_path);
            })
        ) : (
            // Fallback for pure audio/image questions (A, B, C, D)
            <div className="flex gap-4 items-center flex-wrap">
                 {["A", "B", "C", "D"].map((option) => {
                     // Reuse renderOptionButton but styled for horizontal layout if needed
                     // Or just keep the previous circular button style for this case
                     let btnClass = "bg-white text-gray-15 border-white-90 hover:bg-white-95";
            
                    if (isReview) {
                        if (option === correctAnswer) {
                            btnClass = "bg-mint-50 text-white border-mint-50";
                        } else if (option === selectedAnswer && option !== correctAnswer) {
                            btnClass = "bg-red-500 text-white border-red-500";
                        } else if (option === selectedAnswer) {
                            btnClass = "bg-mint-50 text-white border-mint-50";
                        }
                    } else {
                        if (selectedAnswer === option) {
                            btnClass = "bg-mint-50 text-white border-mint-50";
                        }
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => !isReview && onSelectAnswer(option)}
                        disabled={isReview}
                        className={`w-10 h-10 rounded-full font-bold border transition-colors ${btnClass}`}
                      >
                        {option}
                      </button>
                    );
                 })}
            </div>
        )}
        
        {isReview && !selectedAnswer && <span className="text-sm text-gray-40 italic mt-2">(No answer)</span>}
      </div>
    </div>
  );
};
