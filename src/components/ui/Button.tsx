import '../../styles/global.css'
import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "icon" | "ghost";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md", 
    loading = false,
    disabled,
    className = "",
    children,
    type,
    ...props
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-mint-50 text-white border border-mint-50 hover:bg-mint-70 focus:ring-2 focus:ring-mint-50",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 text-gray-900",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500",
    icon: "bg-transparent text-gray-900",
    ghost: "bg-transparent text-gray-30 hover:text-gray-15 hover:bg-white-95 focus:ring-2 focus:ring-gray-200",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
});
