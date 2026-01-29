export type LoginPayload = {
	email: string;
	password: string;
};

export type RegisterPayload = {
	email: string;
	username: string;
	password: string;
	number_phone?: string;
};

export type ForgotPasswordPayload = {
	email: string;
};

export type VerifyOtpPayload = {
	email: string;
	otp: string;
};

export type ResetPasswordPayload = {
	resetToken: string;
	newPassword: string;
};

export type TokenResponse = {
	accessToken: string;
	refreshToken: string;
};

export type ApiMessageResponse<T = unknown> = {
	statusCode?: number;
	status?: number;
	message?: string | string[];
	error?: string;
	result?: T;
	data?: T;
} & Partial<T>;
