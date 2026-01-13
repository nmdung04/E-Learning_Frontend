import '../../styles/global.css'
import * as React from "react";


export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "icon";


export type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    loading?: boolean;
  };


export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  {
    variant = "primary",
    loading = false,
    disabled,
    className = "",
    children,
    ...props
  },
  ref
) {
  
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-mint-50 text-white border border-mint-50 hover:bg-mint-70 focus:ring-mint-50",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-400 text-gray-900",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    icon: 
        "bg-transparent text-gray-900 p-2",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
});
