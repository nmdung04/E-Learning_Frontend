import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/modules/auth/auth.service";
import { useAuth } from "@/modules/auth/useAuth";
import { Button } from "@/components/ui/Button";

const GoogleLoginSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useAuth();

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const [status, setStatus] = useState<"loading" | "error">(() =>
    code ? "loading" : "error"
  );
  const [message, setMessage] = useState<string>(() =>
    code ? "Signing you in with Google..." : "Missing Google authorization code. Please try again."
  );

  useEffect(() => {
    if (!code) return;

    let isMounted = true;

    authService
      .exchangeGoogleCode(code)
      .then(({ tokens }) => {
        if (!isMounted) return;
        setTokens(tokens);
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus("error");
        if (error instanceof Error) {
          setMessage(error.message || "Failed to sign in with Google.");
        } else {
          setMessage("Failed to sign in with Google.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [code, navigate, setTokens]);

  const handleBackToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen w-[100vw] bg-white-97 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white-99 rounded-3xl shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-15 mb-3">Google Sign In</h1>
        <p className="text-gray-30 text-sm leading-relaxed mb-6">{message}</p>
        {status === "error" && (
          <Button
            type="button"
            variant="primary"
            className="w-full py-3 rounded-2xl"
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
        )}
        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 text-gray-30 text-sm">
            <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-gray-40" />
            Please wait...
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleLoginSuccessPage;
