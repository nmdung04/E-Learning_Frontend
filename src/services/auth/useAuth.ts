import {
	createContext,
	createElement,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type PropsWithChildren,
} from "react";
import { authService } from "./auth.service";
import type { LoginPayload, RegisterPayload, TokenResponse } from "./auth.types";
import {
	clearTokens,
	readTokens,
	writeTokens,
	type StoredTokens,
} from "./tokenStorage";
import { userService, type UpdateUserPayload } from "../user/user.service";

export type AuthUser = {
	id?: string;
	username: string;
	email?: string;
	phoneNumber?: string;
	avatarUrl?: string;
	location?: string;
};

type AuthContextValue = {
	isAuthenticated: boolean;
	tokens: StoredTokens | null;
	user: AuthUser | null;
	userLoading: boolean;
	authenticating: boolean;
	login: (payload: LoginPayload) => Promise<TokenResponse>;
	register: (payload: RegisterPayload) => Promise<void>;
	logout: () => Promise<void>;
	setTokens: (tokens: TokenResponse) => void;
	setUser: (user: AuthUser | null) => void;
	refreshUser: () => Promise<void>;
	updateProfile: (payload: UpdateUserPayload) => Promise<void>;
	updateAvatar: (file: File) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const useProvideAuth = () => {
	const [tokens, setTokensState] = useState<StoredTokens | null>(() => readTokens());
	const [user, setUserState] = useState<AuthUser | null>(null);
	const [userLoading, setUserLoading] = useState(false);
	const [authenticating, setAuthenticating] = useState(false);

	const persistTokens = useCallback((next: TokenResponse) => {
		writeTokens(next);
		setTokensState(next);
	}, []);

	const setUser = useCallback((next: AuthUser | null) => {
		setUserState(next);
	}, []);

	const extractUserFromPayload = useCallback((payload: unknown): AuthUser | null => {
		if (!payload || typeof payload !== "object") return null;
		const source = payload as Record<string, unknown>;

		const usernameCandidate =
			(source.username as string | undefined) ??
			(source.userName as string | undefined) ??
			(source.name as string | undefined);

		if (typeof usernameCandidate !== "string" || !usernameCandidate.trim()) {
			return null;
		}

		const phoneCandidate =
			(source.phoneNumber as string | undefined) ??
			(source.number_phone as string | undefined) ??
			(source.numberPhone as string | undefined) ??
			(source.phone_number as string | undefined);

		const avatarCandidate =
			(source.avatarUrl as string | undefined) ??
			(source.avatarURL as string | undefined) ??
			(source.avatar_url as string | undefined) ??
			(source.avatar as string | undefined) ??
			(source.imageUrl as string | undefined) ??
			(source.image_url as string | undefined) ??
			(source.image as string | undefined) ??
			(source.profileImage as string | undefined) ??
			(source.profile_image as string | undefined);

		const locationCandidate =
			(source.location as string | undefined) ??
			(source.address as string | undefined) ??
			(source.city as string | undefined);

		return {
			id: source.id as string | undefined,
			username: usernameCandidate,
			email: source.email as string | undefined,
			phoneNumber: phoneCandidate,
			avatarUrl: avatarCandidate,
			location: locationCandidate,
		};
	}, []);

	const refreshUser = useCallback(async () => {
		if (!tokens?.accessToken) {
			setUserState(null);
			return;
		}
		setUserLoading(true);
		try {
			const res = await authService.getHttpClient().get("/users");
			console.log(res);
			
			const bucket = (res?.data ?? {}) as Record<string, unknown>;
			const source =
				(bucket.result as Record<string, unknown> | undefined) ??
				(bucket.data as Record<string, unknown> | undefined) ??
				bucket;

			const nextUser = extractUserFromPayload(source);
			if (nextUser) {
				setUserState(nextUser);
			}
		} finally {
			setUserLoading(false);
		}
	}, [extractUserFromPayload, tokens?.accessToken]);

	useEffect(() => {
		if (!tokens?.accessToken) {
			setUserState(null);
			return;
		}

		const tokenUser = hydrateUserFromToken(tokens.accessToken);
		if (tokenUser) setUserState(tokenUser);
		refreshUser();
	}, [refreshUser, tokens?.accessToken]);

	const login = useCallback(
		async (payload: LoginPayload) => {
			setAuthenticating(true);
			try {
				const { tokens: freshTokens } = await authService.login(payload);
				persistTokens(freshTokens);
				const tokenUser = hydrateUserFromToken(freshTokens.accessToken);
				if (tokenUser) setUserState(tokenUser);
				return freshTokens;
			} finally {
				setAuthenticating(false);
			}
		},
		[persistTokens]
	);

	const register = useCallback(async (payload: RegisterPayload) => {
		await authService.register(payload);
	}, []);

	const logout = useCallback(async () => {
		try {
			await authService.logout();
		} catch (error) {
			console.error("Logout failed", error);
		} finally {
			clearTokens();
			setTokensState(null);
			setUserState(null);
		}
	}, []);

	const updateProfile = useCallback(
		async (payload: UpdateUserPayload) => {
			await userService.updateProfile(payload);
			await refreshUser();
		},
		[refreshUser]
	);

	const updateAvatar = useCallback(
		async (file: File) => {
			const { data } = await userService.updateAvatar(file);
			const bucket = (data ?? {}) as Record<string, unknown>;
			const source =
				(bucket.result as Record<string, unknown> | undefined) ??
				(bucket.data as Record<string, unknown> | undefined) ??
				bucket;

			const nextUser = extractUserFromPayload(source);
			if (nextUser) {
				setUserState(nextUser);
			} else {
				await refreshUser();
			}
		},
		[extractUserFromPayload, refreshUser]
	);

	const value = useMemo<AuthContextValue>(
		() => ({
			isAuthenticated: Boolean(tokens?.accessToken),
			tokens,
			user,
			userLoading,
			authenticating,
			login,
			register,
			logout,
			setTokens: persistTokens,
			setUser,
			refreshUser,
			updateProfile,
			updateAvatar,
		}),
		[
			authenticating,
			login,
			logout,
			persistTokens,
			refreshUser,
			register,
			setUser,
			tokens,
			updateProfile,
			updateAvatar,
			user,
			userLoading,
		]
	);

	return value;
};

const hydrateUserFromToken = (accessToken: string): AuthUser | null => {
	const payload = decodeJwtPayload(accessToken);
	if (!payload) return null;

	const usernameCandidate =
		(payload.username as string | undefined) ??
		(payload.userName as string | undefined) ??
		(payload.name as string | undefined) ??
		(payload.preferred_username as string | undefined);

	if (typeof usernameCandidate !== "string" || !usernameCandidate.trim()) return null;

	return {
		id:
			(payload.id as string | undefined) ??
			(payload.userId as string | undefined) ??
			(payload.sub as string | undefined),
		username: usernameCandidate,
		email: payload.email as string | undefined,
		phoneNumber:
			(payload.phoneNumber as string | undefined) ??
			(payload.number_phone as string | undefined),
	};
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
	const parts = token.split(".");
	if (parts.length < 2) return null;
	try {
		const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
		const json = atob(padded);
		return JSON.parse(json) as Record<string, unknown>;
	} catch {
		return null;
	}
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const value = useProvideAuth();
	return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
