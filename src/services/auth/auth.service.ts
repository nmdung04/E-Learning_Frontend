import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import {
	type ForgotPasswordPayload,
	type LoginPayload,
	type RegisterPayload,
	type ResetPasswordPayload,
	type TokenResponse,
	type VerifyOtpPayload,
	type ApiMessageResponse,
} from "./auth.types";
import { clearTokens, readAccessToken, readRefreshToken, writeTokens } from "./tokenStorage";

const DEFAULT_API_BASE_URL = import.meta.env.DEV ? "/api" : "http://api.e-commerces.click/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

const createClient = (): AxiosInstance =>
	axios.create({
		baseURL: API_BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
	});

const publicClient = createClient();
const privateClient = createClient();

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };
let refreshPromise: Promise<string | null> | null = null;

const extractTokens = (payload: unknown): TokenResponse => {
	if (!payload || typeof payload !== "object") {
		throw new Error("Token payload is empty");
	}

	const bucket = payload as Record<string, unknown>;

	const attempt = (candidate?: Record<string, unknown>): TokenResponse | null => {
		if (!candidate) return null;
		const accessTokenCandidate = candidate.accessToken ?? candidate.access_token;
		const refreshTokenCandidate = candidate.refreshToken ?? candidate.refresh_token;
		if (typeof accessTokenCandidate === "string" && typeof refreshTokenCandidate === "string") {
			return {
				accessToken: accessTokenCandidate,
				refreshToken: refreshTokenCandidate,
			};
		}
		return null;
	};

	const sources: Array<Record<string, unknown> | undefined> = [
		bucket,
		bucket.result as Record<string, unknown> | undefined,
		bucket.data as Record<string, unknown> | undefined,
		(bucket.result as { data?: Record<string, unknown> } | undefined)?.data,
	];

	for (const source of sources) {
		const tokens = attempt(source);
		if (tokens) return tokens;
	}

	throw new Error("Tokens are missing in the response");
};

const performRefresh = async (): Promise<string | null> => {
	const refreshToken = readRefreshToken();
	if (!refreshToken) return null;
	const response = await publicClient.post<ApiMessageResponse<TokenResponse>>("/auth/refresh-token", {
		refreshToken,
	});
	const tokens = extractTokens(response.data);
	writeTokens(tokens);
	return tokens.accessToken;
};

const queueRefresh = () => {
	if (!refreshPromise) {
		refreshPromise = performRefresh()
			.catch(() => {
				clearTokens();
				return null;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}
	return refreshPromise;
};

privateClient.interceptors.request.use((config) => {
	const accessToken = readAccessToken();
	if (accessToken) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

privateClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error?.response?.status;
		const originalRequest: RetriableConfig = error?.config ?? {};
		const shouldAttemptRefresh = status === 401 && !originalRequest._retry;

		if (!shouldAttemptRefresh) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;
		try {
			const newAccessToken = await queueRefresh();
			if (!newAccessToken) {
				return Promise.reject(error);
			}
			originalRequest.headers = originalRequest.headers ?? {};
			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
			return privateClient(originalRequest);
		} catch (refreshError) {
			return Promise.reject(refreshError);
		}
	}
);

const defaultErrorMessage = "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";

const unwrapMessage = (response: AxiosResponse<ApiMessageResponse>): string | undefined => {
	const { message } = response.data ?? {};
	if (Array.isArray(message)) {
		return message.join("\n");
	}
	return message;
};

export const authService = {
	login: async (payload: LoginPayload) => {
		const response = await publicClient.post<ApiMessageResponse<TokenResponse>>("/auth/login", payload);
		const tokens = extractTokens(response.data);
		return { tokens, message: unwrapMessage(response) };
	},
	register: async (payload: RegisterPayload) => {
		const response = await publicClient.post<ApiMessageResponse>("/users", payload);
		return { data: response.data, message: unwrapMessage(response) };
	},
	forgotPassword: async (payload: ForgotPasswordPayload) => {
		const response = await publicClient.post<ApiMessageResponse>("/auth/forgot-password", payload);
		return { data: response.data, message: unwrapMessage(response) };
	},
	verifyOtp: async (payload: VerifyOtpPayload) => {
		const response = await publicClient.post<ApiMessageResponse<{ resetToken: string }>>("/auth/verify-otp", payload);
		const rawResetToken =
			(response.data?.result as { resetToken?: string } | undefined)?.resetToken ??
			(response.data?.data as { resetToken?: string } | undefined)?.resetToken ??
			(response.data as { resetToken?: string } | undefined)?.resetToken;

		if (!rawResetToken || typeof rawResetToken !== "string") {
			throw new Error("Không nhận được reset token từ máy chủ.");
		}

		return { resetToken: rawResetToken, message: unwrapMessage(response) };
	},
	resetPassword: async (payload: ResetPasswordPayload) => {
		const response = await publicClient.post<ApiMessageResponse>("/auth/reset-password", payload);
		return { data: response.data, message: unwrapMessage(response) };
	},
	logout: async () => {
		const refreshToken = readRefreshToken();
		if (!refreshToken) {
			throw new Error("Không tìm thấy refresh token để đăng xuất.");
		}
		const response = await privateClient.post<ApiMessageResponse>("/auth/logout", { refreshToken });
		clearTokens();
		return { data: response.data, message: unwrapMessage(response) ?? defaultErrorMessage };
	},
	logoutAll: async () => {
		const response = await privateClient.post<ApiMessageResponse>("/auth/logout-all");
		clearTokens();
		return { data: response.data, message: unwrapMessage(response) ?? defaultErrorMessage };
	},
	exchangeGoogleCode: async (code: string) => {
		const response = await publicClient.post<ApiMessageResponse<TokenResponse>>("/auth/google/exchange", { code });
		const tokens = extractTokens(response.data);
		return { tokens, message: unwrapMessage(response) };
	},
	getHttpClient: () => privateClient,
	getPublicClient: () => publicClient,
};

export type AuthService = typeof authService;
