import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { writeResetFlowSession } from "@/modules/auth/resetFlowSession";
import { authService } from "@/modules/auth/auth.service";

const schema = z.object({
  email: z.string().min(1, 'Email is required').trim().email('Invalid email format'),
});

type FormFields = z.infer<typeof schema>;



const ForgotPasswordForm = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: FormFields) => {
    try {
      await authService.forgotPassword({ email: data.email });

      writeResetFlowSession({ email: data.email });

      navigate("/verify-otp");

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message as string | undefined;
        if (status === 404) {
          setError('email', { message: message ?? 'Email này không tồn tại trong hệ thống.' });
        } else {
          setError('root', { message: message ?? 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.' });
        }
      } else {
        setError('root', { message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra internet.' });
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
          <div>
            <label className="block text-xs font-bold text-gray-15 uppercase tracking-wider mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="Enter your Email"
              className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl outline-none focus:border-gray-30 focus:ring-4 focus:ring-white-95 transition-all duration-300 text-sm text-gray-15 placeholder:text-gray-40"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          {errors.root && <p className="text-xs text-red-500 mt-1">{errors.root.message}</p>}

          <button
            className="w-full bg-mint-50 hover:bg-mint-75 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-[0_20px_45px_rgba(70,206,131,0.25)] cursor-pointer"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Verification Code'}
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
};

export default ForgotPasswordForm;
