'use client'
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AuthBanner from './AuthBanner';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useAuth } from '@/modules/auth/useAuth';


const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must be at most 30 characters' })
    .regex(/^[a-z0-9_.-]+$/i, {
      message: 'Username can only contain letters, numbers, dot, dash, underscore',
    })
    .trim(),

  email: z
    .string()
    .min(1, { message: 'Email is required' }) 
    .trim() 
    .email({ message: 'Invalid email format' })
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
    
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),

  numberPhone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, { message: 'Phone number must start with 0 and be exactly 10 digits' }),

  accept: z.literal(true, { message: 'You must accept the terms and conditions' }),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      path: ['confirmPassword'],
      message: "Passwords don't match",
    });
  }
});

type FormFields = z.infer<typeof schema>;


const SignUp = () => {

  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();

   const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormFields>({
      resolver: zodResolver(schema),
      mode: 'onTouched',
    });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const googleAuthUrl = (import.meta.env.VITE_API_BASE_URL ?? '/api') + '/auth/google';
  const handleGoogleSignUp = () => {
    window.location.href = googleAuthUrl;
  };

  const deriveErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const payload = error.response?.data as { message?: string | string[] } | undefined;
      if (Array.isArray(payload?.message)) return payload?.message.join('\n');
      return payload?.message ?? 'Không thể tạo tài khoản. Vui lòng thử lại.';
    }
    if (error instanceof Error) return error.message;
    return 'Không thể tạo tài khoản. Vui lòng thử lại.';
  };

  const onSubmit: SubmitHandler<FormFields> = async data => {
      try {
        await registerAccount({
          email: data.email,
          username: data.username,
          password: data.password,
          number_phone: data.numberPhone || undefined,
        });
        navigate('/login');
      } catch (error) {
        setError('root', { type: 'manual', message: deriveErrorMessage(error) });
      }
    }
  
  return (
    <div className="min-h-screen w-[100vw] bg-white-97 flex items-center justify-center p-4 lg:p-10 font-sans">
      {/* Main Container */}
      <div className="w-full max-w-[1100px] bg-white-99 rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[750px]">
        
        {/* LEFT SECTION: Testimonials */}
        <AuthBanner />

        {/* RIGHT SECTION: Sign Up Form */}
        <div className="lg:w-1/2 bg-white-99 p-8 lg:p-16 flex flex-col justify-center items-center">
          <div className="w-full max-w-[400px]">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-15 mb-2">Sign Up</h1>
              <p className="text-gray-30 text-sm font-medium">Create an account to unlock exclusive features.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-15 uppercase tracking-wider ml-1">Username</label>
                <input
                  {...register('username')}
                  type="text"
                  name="username"
                  placeholder="e.g. nguyenvana"
                  className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl focus:bg-white focus:border-gray-30 focus:ring-4 focus:ring-white-95 outline-none transition-all text-sm text-gray-15 placeholder:text-gray-40"
                />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-15 uppercase tracking-wider ml-1">Email</label>
                <input
                  {...register('email')}
                  type="email" name="email"
                  placeholder="test@example.com"
                  className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl focus:bg-white focus:border-gray-30 focus:ring-4 focus:ring-white-95 outline-none transition-all text-sm text-gray-15 placeholder:text-gray-40"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-15 uppercase tracking-wider ml-1">Phone Number</label>
                <input
                  {...register('numberPhone', {
                    setValueAs: (value) => (value ? value.replace(/\D/g, '').slice(0, 10) : ''),
                    onChange: (event) => {
                      const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
                      event.target.value = digitsOnly;
                    },
                  })}
                  type="text"
                  name="numberPhone"
                  placeholder="0905123456"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl focus:bg-white focus:border-gray-30 focus:ring-4 focus:ring-white-95 outline-none transition-all text-sm text-gray-15 placeholder:text-gray-40"
                />
                {errors.numberPhone && <p className="text-red-500 text-xs mt-1">{errors.numberPhone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-15 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your Password"
                    className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl focus:bg-white focus:border-gray-30 focus:ring-4 focus:ring-white-95 outline-none transition-all text-sm text-gray-15 placeholder:text-gray-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-40 hover:text-gray-30 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-15 uppercase tracking-wider ml-1">Return Password</label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Enter your Password"
                    className="w-full px-4 py-3.5 bg-white-99 border border-white-90 rounded-xl focus:bg-white focus:border-gray-30 focus:ring-4 focus:ring-white-95 outline-none transition-all text-sm text-gray-15 placeholder:text-gray-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-40 hover:text-gray-30 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-1 ml-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  {...register('accept')}
                  className="w-4 h-4 accent-mint-50 border-white-90 rounded" 
                />
                <label htmlFor="terms" className="text-xs text-gray-30">
                  I agree with <span className="text-gray-15 font-bold underline cursor-pointer">Terms of Use</span> and <span className="text-gray-15 font-bold underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              {errors.accept && <p className="text-red-500 text-xs mt-1">{errors.accept.message}</p>}
              {errors.root && <p className="text-red-500 text-xs mt-1 text-start">{errors.root.message}</p>}
              

              <button disabled={isSubmitting} className="w-full bg-mint-50 hover:bg-mint-75 text-white font-bold py-4 rounded-xl shadow-[0_20px_45px_rgba(70,206,131,0.25)] transition-all transform active:scale-[0.98] mt-2 cursor-pointer disabled:opacity-60">
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white-90"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white-99 px-3 text-gray-40">OR</span></div>
            </div>
            
            <div>
              <button type="button" onClick={handleGoogleSignUp} className="w-full flex items-center justify-center gap-3 cursor-pointer bg-white-99 hover:bg-white-95 border border-white-90 text-gray-15 font-bold py-3.5 rounded-xl transition-all text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                </svg>
                Sign Up with Google
              </button>
            </div>

            <p className="text-center mt-8 text-sm text-gray-30">
              Already have an account? <Link to="/login" className="text-gray-15 font-bold hover:underline transition-all cursor-pointer">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
