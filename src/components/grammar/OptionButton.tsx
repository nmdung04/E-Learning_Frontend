import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionProps {
  label: string; // A, B, C, D
  text: string;
  status: 'idle' | 'correct' | 'wrong' | 'disabled';
  onClick: () => void;
}

const OptionButton = ({ label, text, status, onClick }: OptionProps) => {
  const statusStyles = {
    idle: "border-border hover:border-primary hover:bg-primary/5 bg-white",
    correct: "border-green-500 bg-green-50 text-green-700 font-medium",
    wrong: "border-red-500 bg-red-50 text-red-700",
    disabled: "opacity-50 cursor-not-allowed bg-slate-50 border-border"
  };

  return (
    <button
      onClick={onClick}
      disabled={status !== 'idle'}
      className={cn(
        "flex items-center w-full p-4 border-2 rounded-xl transition-all duration-200 text-left group",
        statusStyles[status]
      )}
    >
      <span className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg font-bold mr-4 transition-colors",
        status === 'idle' ? "bg-slate-100 group-hover:bg-primary group-hover:text-white" : "bg-current/10"
      )}>
        {label}
      </span>
      <span className="flex-1 text-sm md:text-base">{text}</span>
      {status === 'correct' && <CheckCircle2 className="w-5 h-5 ml-2" />}
      {status === 'wrong' && <XCircle className="w-5 h-5 ml-2" />}
    </button>
  );
};

export default OptionButton;
