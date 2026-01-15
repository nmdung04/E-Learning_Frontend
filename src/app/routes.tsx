import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/modules/auth/useAuth";
import LoginPage from "@/app/(guest)/auth/login/page";
import RegisterPage from "@/app/(guest)/auth/register/page";
import ForgotPasswordPage from "@/app/(guest)/auth/forgot-password/page";
import ResetPasswordPage from "@/app/(guest)/auth/reset-password/page";
import VerifyOtpPage from "@/app/(guest)/auth/verify-otp/page";
import GoogleLoginSuccessPage from "@/app/(guest)/auth/login-success/page";
import DashboardPage from "@/app/(auth)/dashboard/page";
import TopicBrowserPage from "@/app/(auth)/topics/page";
import GrammarLearningPage from "@/app/(auth)/grammar/page";
import RequireAuth from "@/components/auth/RequireAuth";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login-success" element={<GoogleLoginSuccessPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/topics"
            element={
              <RequireAuth>
                <TopicBrowserPage />
              </RequireAuth>
            }
          />
          <Route
            path="/grammar/:topicId"
            element={
              <RequireAuth>
                <GrammarLearningPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}
export default AppRoutes

