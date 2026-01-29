import type { PropsWithChildren, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/services/auth/useAuth";

type RequireAuthProps = PropsWithChildren<{
  fallback?: ReactNode;
}>;

const DefaultFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
    Đang xác thực...
  </div>
);

const RequireAuth = ({ children, fallback }: RequireAuthProps) => {
  const location = useLocation();
  const { isAuthenticated, authenticating } = useAuth();

  if (authenticating) {
    return (fallback as ReactNode) ?? <DefaultFallback />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
