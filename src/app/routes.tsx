import { Navigate, Route, Routes } from "react-router-dom";
// import { useAuth } from "@/services/auth/useAuth";
import LoginPage from "@/app/(guest)/auth/login/page";
import RegisterPage from "@/app/(guest)/auth/register/page";
import ForgotPasswordPage from "@/app/(guest)/auth/forgot-password/page";
import ResetPasswordPage from "@/app/(guest)/auth/reset-password/page";
import VerifyOtpPage from "@/app/(guest)/auth/verify-otp/page";
import GoogleLoginSuccessPage from "@/app/(guest)/auth/login-success/page";
import HomePage from "@/app/home/page";
import { UserProfilePage } from "@/modules/user/UserProfilePage";
// import TopicBrowserPage from "@/modules/learning/topics/page";
// import GrammarLearningPage from "@/modules/learning/grammar/page";
import RequireAuth from "@/modules/auth/RequireAuth";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";
import TopicListPage from "@/modules/learning/vocab/pages/TopicListPage";
import StudyPage from "@/modules/learning/vocab/pages/StudyPage";
import ReviewPage from "@/modules/learning/vocab/pages/ReviewPage";
import SpeakingLearningPage from "@/modules/learning/speaking/page";

const AppRoutes = () => {
  return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login-success" element={<GoogleLoginSuccessPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <UserProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/topics"
            element={
              <RequireAuth>
                {/* <TopicBrowserPage /> */}
              </RequireAuth>
            }
          />
          <Route
            path="/grammar/:topicId"
            element={
              <RequireAuth>
                {/* <GrammarLearningPage /> */}
              </RequireAuth>
            }
          />
          <Route
            path="/speaking"
            element={
              <RequireAuth>
                <SpeakingLearningPage />
              </RequireAuth>
            }
          />
          <Route
            path="/vocab"
            element={
              <RequireAuth>
                <TopicListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/vocab/review"
            element={
              <RequireAuth>
                <ReviewPage />
              </RequireAuth>
            }
          />
          <Route
            path="/vocab/:topic"
            element={
              <RequireAuth>
                <StudyPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}
export default AppRoutes

