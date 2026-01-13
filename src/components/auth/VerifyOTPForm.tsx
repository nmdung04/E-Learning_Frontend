import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { authService } from "@/modules/auth/auth.service";
import { readResetFlowSession, updateResetFlowSession } from "@/modules/auth/resetFlowSession";
import type { ResetFlowSession } from "@/modules/auth/resetFlowSession";

const schema = z.object({
  otpCode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "OTP code must contain exactly 6 digits"),
});

type FormFields = z.infer<typeof schema>;

const VerifyOTPForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormFields>({
      resolver: zodResolver(schema),
      mode: 'onTouched',
    });

    const navigate = useNavigate();
    const [sessionState, setSessionState] = useState<ResetFlowSession | null>(() => readResetFlowSession());
    const email = sessionState?.email;

    useEffect(() => {
      if (!sessionState?.email) {
        navigate("/forgot-password", { replace: true });
      }
    }, [sessionState, navigate]);
  
    const onSubmit = async (data: FormFields) => {

      if (!sessionState?.email) {
        setError('root', { message: 'Unable to find a valid reset request to verify.' });
        return;
      }
      try {
        const { resetToken } = await authService.verifyOtp({
          email: sessionState.email,
          otp: data.otpCode,
        });

        const updatedSession: ResetFlowSession = {
          email: sessionState.email,
          resetToken,
        };

        updateResetFlowSession(updatedSession);
        setSessionState(updatedSession);
  
        // Assume success then navigate to reset password
        navigate("/reset-password");
  
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          const message = error.response.data?.message as string | undefined;
          if (status === 400) {
            setError('otpCode', { type: 'manual', message: message ?? 'OTP không hợp lệ hoặc đã hết hạn.' });
          } else {
            setError('root', { message: message ?? 'The system is experiencing issues. Please try again later.' });
          }
        } else {
          const fallbackMessage = error instanceof Error ? error.message : 'Unable to reach the server. Please check your internet connection.';
          setError('root', { message: fallbackMessage });
        }
      }
  }
  
    const handleBackToLogin = () => {
      navigate("/login");
    };
  
    return (
      <div className="min-h-screen w-[100vw] bg-white-97 flex items-center justify-center p-4 lg:p-8 font-sans">
        <div className="w-full max-w-[560px] bg-white-99 rounded-3xl lg:rounded-[40px] shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="text-center pt-8 pb-6 px-6 lg:pt-10 lg:pb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-15 mb-2">
              Verify OTP Code
            </h2>
            <p className="text-gray-30 text-sm lg:text-base font-medium">
              {email ? `Enter the 6-digit code sent to ${email}.` : "Redirecting..."}
            </p>
          </div>
  
          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 lg:px-16 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-15 uppercase tracking-wider mb-2 ml-1">
                OTP Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="[0-9]{6}"
                {...register('otpCode')}
                onInput={(event) => {
                  const target = event.currentTarget;
                  target.value = target.value.replace(/\D/g, '').slice(0, 6);
                }}
                placeholder="123456"
                className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl outline-none focus:border-gray-30 focus:ring-4 focus:ring-white-95 transition-all duration-300 text-sm tracking-[0.6em] text-center text-gray-15 placeholder:text-gray-40"
              />
            </div>
            {errors.otpCode && <p className="text-xs text-red-500 mt-1">{errors.otpCode.message}</p>}
            {errors.root && <p className="text-xs text-red-500 mt-1">{errors.root.message}</p>}

            <button
              className="w-full bg-mint-50 hover:bg-mint-75 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-[0_20px_45px_rgba(70,206,131,0.25)] cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Confirm Code'}
            </button>
          </form>
  
          {/* Back to Login Section */}
          <div className="px-6 lg:px-16 pt-6 pb-8 lg:pb-10">
            <button
              onClick={handleBackToLogin}
              className="w-[30%] flex items-center justify-center gap-2 text-gray-30 hover:text-gray-15 font-semibold py-3 rounded-xl hover:bg-white-95 transition-all duration-300 text-sm group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
}

export default VerifyOTPForm
