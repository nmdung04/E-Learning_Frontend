import { lazy, Suspense } from "react";
const ForgotPasswordForm = lazy(() => import("@/modules/auth/ForgotPasswordForm"));

const AuthForgotPasswordPage = () => {
	return (
    <Suspense fallback={<div className="p-6 text-gray-40">Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
};

export default AuthForgotPasswordPage;
