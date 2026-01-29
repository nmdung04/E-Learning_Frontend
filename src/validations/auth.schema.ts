import { z } from "zod";

// Primitives shared across auth flows
export const emailSchema = z
	.string()
	.trim()
	.toLowerCase()
	.min(1, { message: "Email is required" })
	.email({ message: "Invalid email format" });

export const usernameSchema = z
	.string()
	.trim()
	.min(3, { message: "Username must be at least 3 characters" })
	.max(30, { message: "Username must be at most 30 characters" })
	.regex(/^[a-z0-9_.-]+$/i, {
		message: "Username can only contain letters, numbers, dot, dash, underscore",
	});

// Strong password rule reused by register/reset
export const strongPasswordSchema = z
	.string()
	.min(8, { message: "Password must be at least 8 characters" })
	.regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
	.regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
	.regex(/[0-9]/, { message: "Password must contain at least one number" })
	.regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

export const otpCodeSchema = z
	.string()
	.trim()
	.regex(/^\d{6}$/, { message: "OTP code must contain exactly 6 digits" });

export const phoneSchema = z
	.string()
	.trim()
	.regex(/^0\d{9}$/, { message: "Phone number must start with 0 and be exactly 10 digits" });

// Screens
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, { message: "Password is required" }),
	rememberMe: z.boolean().optional(),
});

export const registerSchema = z
	.object({
		username: usernameSchema,
		email: emailSchema,
		password: strongPasswordSchema,
		confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
		numberPhone: phoneSchema,
		accept: z.literal(true, { message: "You must accept the terms and conditions" }),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmPassword"],
				message: "Passwords don't match",
			});
		}
	});

export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export const verifyOtpSchema = z.object({
	otpCode: otpCodeSchema,
});

export const resetPasswordSchema = z
	.object({
		newPassword: strongPasswordSchema,
		confirmPassword: z.string().min(1, { message: "Please confirm your new password" }),
	})
	.superRefine((data, ctx) => {
		if (data.newPassword !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmPassword"],
				message: "Passwords do not match",
			});
		}
	});

// Types for forms
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpForm = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
