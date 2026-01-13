import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { authService } from "@/modules/auth/auth.service";
import { clearResetFlowSession, readResetFlowSession } from "@/modules/auth/resetFlowSession";
import type { ResetFlowSession } from "@/modules/auth/resetFlowSession";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character");

const schema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .superRefine((values, ctx) => {
    if (values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

type FormFields = z.infer<typeof schema>;

const maskEmail = (value: string) => {
  const [local, domain] = value.split("@");
  if (!domain) return value;
  const visible = local.slice(0, 2);
  const tail = local.length > 3 ? local.slice(-1) : "";
  return `${visible}***${tail}@${domain}`;
};

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const navigate = useNavigate();
  const [sessionState] = useState<ResetFlowSession | null>(() => readResetFlowSession());
  const email = sessionState?.email;
  const resetToken = sessionState?.resetToken;

  useEffect(() => {
    if (!email || !resetToken) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, resetToken, navigate]);

  const maskedEmail = useMemo(() => (email ? maskEmail(email) : ""), [email]);

  const onSubmit = async (data: FormFields) => {
    if (!email || !resetToken) {
      setError("root", { message: "Unable to reset password without a valid token." });
      return;
    }

    try {
      await authService.resetPassword({
        resetToken,
        newPassword: data.newPassword,
      });

      clearResetFlowSession();
      navigate("/login", { replace: true, state: { resetSuccess: true } });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message as string | undefined;

        if (status === 400) {
          setError("root", { message: message ?? "Reset token is invalid or expired." });
        } else {
          setError("root", { message: "The system is experiencing issues. Please try again later." });
        }
      } else {
        setError("root", { message: "Unable to reach the server. Please check your internet connection." });
      }
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-[100vw] bg-white-97 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-[560px] bg-white-99 rounded-3xl lg:rounded-[40px] shadow-2xl overflow-hidden">
        <div className="text-center pt-8 pb-6 px-6 lg:pt-10 lg:pb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-mint-50 font-semibold mb-3">Step 3 of 3</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-15 mb-2">Create a new password</h2>
          <p className="text-gray-30 text-sm lg:text-base font-medium">
            {email ? `You are resetting the password for ${maskedEmail}.` : "Redirecting..."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="px-6 lg:px-16 space-y-6 pb-6">
          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {errors.root.message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-15 uppercase tracking-wider mb-2 ml-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                {...register("newPassword", {
                  onChange: () => clearErrors("root"),
                })}
                placeholder="Enter a strong password"
                className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl outline-none focus:border-gray-30 focus:ring-4 focus:ring-white-95 transition-all duration-300 text-sm text-gray-15 placeholder:text-gray-40"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-40 hover:text-gray-30"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
            )}
            <ul className="mt-2 text-[11px] text-gray-30 space-y-1 ml-1">
              <li>At least 8 characters</li>
              <li>Includes uppercase, lowercase, number, and symbol</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-15 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="off"
                {...register("confirmPassword", {
                  onChange: () => clearErrors("root"),
                })}
                placeholder="Re-enter the password"
                className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl outline-none focus:border-gray-30 focus:ring-4 focus:ring-white-95 transition-all duration-300 text-sm text-gray-15 placeholder:text-gray-40"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-40 hover:text-gray-30"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            className="w-full bg-mint-50 hover:bg-mint-75 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-[0_20px_45px_rgba(70,206,131,0.25)] cursor-pointer disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting password..." : "Save new password"}
          </button>
        </form>

        <div className="px-6 lg:px-16 pb-8 lg:pb-10">
          <button
            onClick={handleBackToLogin}
            className="w-[40%] flex items-center justify-center gap-2 text-gray-30 hover:text-gray-15 font-semibold py-3 rounded-xl hover:bg-white-95 transition-all duration-300 text-sm group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
