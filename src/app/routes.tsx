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
import TopicsPage from "@/modules/learning/topics/TopicsPage";
import LessonPage from "@/modules/learning/grammar/lessons/[id]/page";
import { GrammarDashboardPage } from "@/modules/learning/grammar/GrammarDashboardPage";
import { GrammarLessonsPage } from "@/modules/learning/grammar/GrammarLessonsPage";
import { ReviewLessonPage } from "@/modules/learning/grammar/ReviewLessonPage";
import RequireAuth from "@/modules/auth/RequireAuth";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";
import SpeakingLearningPage from "@/modules/learning/speaking/page";
import { ExamListPage } from "@/modules/exam/pages/ExamListPage";
import { ExamTakingPage } from "@/modules/exam/pages/ExamTakingPage";
import { ExamHistoryPage } from "@/modules/exam/pages/ExamHistoryPage";
import { ExamReviewPage } from "@/modules/exam/pages/ExamReviewPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Nhóm Route cho Guest (Auth) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login-success" element={<GoogleLoginSuccessPage />} />
      </Route>

      {/* Nhóm Route cho App (Cần Login) */}
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
              <TopicsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/grammar/lessons"
          element={
            <RequireAuth>
              <GrammarLessonsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/grammar/dashboard"
          element={
            <RequireAuth>
              <GrammarDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/grammar/lessons/:id"
          element={
            <RequireAuth>
              <LessonPage />
            </RequireAuth>
          }
        />
        <Route
          path="/grammar/lessons/:lessonId/review"
          element={
            <RequireAuth>
              <ReviewLessonPage />
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
           
          {/* Exam Routes */}
          <Route
            path="/exams"
            element={
              <RequireAuth>
                <ExamListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/exams/history"
            element={
              <RequireAuth>
                <ExamHistoryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/exams/:lessonId"
            element={
              <RequireAuth>
                <ExamTakingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/exams/review/:userLessonId"
            element={
              <RequireAuth>
                <ExamReviewPage />
              </RequireAuth>
            }
          />
      </Route> {/* <--- Bổ sung thẻ đóng này */}

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
