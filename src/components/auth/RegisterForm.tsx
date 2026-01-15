import AuthBanner from './AuthBanner';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useAuth } from '@/modules/auth/useAuth';
import { Input, PasswordInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerSchema, type RegisterForm } from '@/validations/auth.schema';



const SignUp = () => {

  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
      mode: 'onTouched',
    });
    
  const googleAuthUrl = (import.meta.env.VITE_API_BASE_URL ?? '/api') + '/auth/google';
  const handleGoogleSignUp = () => {
    window.location.href = googleAuthUrl;
  };

  const deriveErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const payload = error.response?.data as { message?: string | string[] } | undefined;
      if (Array.isArray(payload?.message)) return payload?.message.join('\n');
      return payload?.message ?? 'Unable to create account. Please try again later.';
    }
    if (error instanceof Error) return error.message;
    return 'Unable to create account. Please try again later.';
  };

  const onSubmit: SubmitHandler<RegisterForm> = async data => {
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
              <Input
                label="Username"
                placeholder="e.g. nguyenvana"
                {...register('username')}
                error={errors.username?.message}
              />

              <Input
                label="Email"
                type="email"
                placeholder="test@example.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Phone Number"
                placeholder="0905123456"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                {...register('numberPhone', {
                  setValueAs: (value) => (value ? value.replace(/\D/g, '').slice(0, 10) : ''),
                  onChange: (event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
                    event.target.value = digitsOnly;
                  },
                })}
                error={errors.numberPhone?.message}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your Password"
                {...register('password')}
                error={errors.password?.message}
                revealLabel="Show password"
                hideLabel="Hide password"
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                revealLabel="Show password"
                hideLabel="Hide password"
              />

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
              

              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 rounded-xl shadow-[0_20px_45px_rgba(70,206,131,0.25)] mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white-90"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white-99 px-3 text-gray-40">OR</span></div>
            </div>
            
            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 border-white-90 py-3.5 rounded-xl text-sm"
                onClick={handleGoogleSignUp}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                </svg>
                Sign Up with Google
              </Button>
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
