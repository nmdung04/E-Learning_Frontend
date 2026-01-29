import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/services/auth/useAuth";

const AppProviders = ({ children }: PropsWithChildren) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default AppProviders;
