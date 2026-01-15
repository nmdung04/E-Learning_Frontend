import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { writeResetFlowSession } from "@/modules/auth/resetFlowSession";
import { authService } from "@/modules/auth/auth.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {forgotPasswordSchema, type ForgotPasswordForm } from "@/validations/auth.schema";



const ForgotPasswordForm = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await authService.forgotPassword({ email: data.email });

      writeResetFlowSession({ email: data.email });

      navigate("/verify-otp");

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message as string | undefined;
        if (status === 404) {
          setError('email', { message: message ?? 'This email does not exist in our system.' });
        } else {
          setError('root', { message: message ?? 'The system is experiencing issues. Please try again later.' });
        }
      } else {
        setError('root', { message: 'Unable to reach the server. Please check your internet connection.' });
      }
    }
  };

  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-[100vw] bg-white-97 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-[560px] bg-white-99 rounded-3xl lg:rounded-[40px] shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="text-center pt-8 pb-6 px-6 lg:pt-10 lg:pb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-15 mb-2">
            Verify Account
          </h2>
          <p className="text-gray-30 text-sm lg:text-base font-medium">
            Enter your email to receive a verification code.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 lg:px-16 space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your Email"
            {...register('email')}
            error={errors.email?.message}
          />
          {errors.root && <p className="text-xs text-red-500 mt-1">{errors.root.message}</p>}

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 rounded-xl shadow-[0_20px_45px_rgba(70,206,131,0.25)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </form>

        {/* Back to Login Section */}
        <div className="px-6 lg:px-16 pt-6 pb-8 lg:pb-10">
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2 font-semibold py-3 px-0 text-sm group"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Login</span>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
