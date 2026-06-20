import { apiClient } from "./apiClient";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE" | "KITCHEN";
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await apiClient.post<LoginResponse>("/auth/register", data);
    return response.data;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },

  async getCurrentUser() {
    const response = await apiClient.get<{ user: any }>("/auth/me");
    return response.data.user;
  },
};
