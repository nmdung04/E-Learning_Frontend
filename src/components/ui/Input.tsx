import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label?: string;
  hint?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
};

const baseInputClasses =
  "w-full px-4 py-3.5 bg-white-99 border rounded-xl outline-none transition-all duration-200 text-sm text-gray-15 placeholder:text-gray-40 focus:bg-white";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    startAdornment,
    endAdornment,
    containerClassName = "",
    inputClassName = "",
    ...props
  },
  ref
) {
  const startPadding = startAdornment ? "pl-12" : "";
  const endPadding = endAdornment ? "pr-12" : "";
  const borderClasses = error
    ? "border-red-300 focus:ring-4 focus:ring-red-100 focus:border-red-300"
    : "border-white-90 focus:border-gray-30 focus:ring-4 focus:ring-white-95";

  return (
    <div className={containerClassName}>
      {label ? (
        <label className="block text-xs font-bold text-gray-15 uppercase tracking-wider mb-2 ml-1">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {startAdornment ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-40">{startAdornment}</span>
        ) : null}
        <input
          ref={ref}
          className={`${baseInputClasses} ${borderClasses} ${startPadding} ${endPadding} ${inputClassName}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${props.name}-error` : undefined}
          {...props}
        />
        {endAdornment ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-40">
            {endAdornment}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={`${props.name}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-gray-40 mt-1">{hint}</p>
      ) : null}
    </div>
  );
});

export type PasswordInputProps = Omit<InputProps, "type" | "endAdornment"> & {
  revealLabel?: string;
  hideLabel?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { revealLabel = "Show", hideLabel = "Hide", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="flex items-center text-gray-40 hover:text-gray-30 transition-colors cursor-pointer"
          aria-label={visible ? hideLabel : revealLabel}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      {...props}
    />
  );
});
