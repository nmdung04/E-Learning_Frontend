import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { authService } from "@/modules/auth/auth.service";
import { clearResetFlowSession, readResetFlowSession } from "@/modules/auth/resetFlowSession";
import type { ResetFlowSession } from "@/modules/auth/resetFlowSession";
import { PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { resetPasswordSchema, type ResetPasswordForm } from "@/validations/auth.schema";


const maskEmail = (value: string) => {
  const [local, domain] = value.split("@");
  if (!domain) return value;
  const visible = local.slice(0, 2);
  const tail = local.length > 3 ? local.slice(-1) : "";
  return `${visible}***${tail}@${domain}`;
};

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
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

  const onSubmit = async (data: ResetPasswordForm) => {
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

          <PasswordInput
            label="New Password"
            placeholder="Enter a strong password"
            autoComplete="off"
            {...register("newPassword", {
              onChange: () => clearErrors("root"),
            })}
            error={errors.newPassword?.message}
            revealLabel="Show password"
            hideLabel="Hide password"
          />
          <ul className="mt-2 text-[11px] text-gray-30 space-y-1 ml-1">
            <li>At least 8 characters</li>
            <li>Includes uppercase, lowercase, number, and symbol</li>
          </ul>

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter the password"
            autoComplete="off"
            {...register("confirmPassword", {
              onChange: () => clearErrors("root"),
            })}
            error={errors.confirmPassword?.message}
            revealLabel="Show password"
            hideLabel="Hide password"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 rounded-xl shadow-[0_20px_45px_rgba(70,206,131,0.25)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting password..." : "Save new password"}
          </Button>
        </form>

        <div className="px-6 lg:px-16 pb-8 lg:pb-10">
          <div className="flex justify-start">
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2 font-semibold py-3 px-0 text-sm group"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to login</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
