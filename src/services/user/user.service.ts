import type { ApiMessageResponse } from "../auth/auth.types";
import { authService } from "../auth/auth.service";

export type UpdateUserPayload = {
	username?: string;
	phone_number?: string;
};

export const userService = {
	updateProfile: async (payload: UpdateUserPayload) => {
		const client = authService.getHttpClient();
		const response = await client.patch<ApiMessageResponse>("/users", payload);
		return { data: response.data };
	},
	updateAvatar: async (file: File) => {
		const client = authService.getHttpClient();
		const formData = new FormData();
		formData.append("file", file);
		const response = await client.patch<ApiMessageResponse>("/users/update-avatar", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return { data: response.data };
	},
};

