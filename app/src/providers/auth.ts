import { AuthProvider } from "@refinedev/core";

const API_URL = "http://localhost:8080/api/auth";

export const authProvider: AuthProvider = {

  login: async ({ email, password }) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_name", `${data.firstName} ${data.lastName}`);

      const randomDarkColor = `hsl(${Math.random() * 360}, 70%, 35%)`;
      localStorage.setItem("user_avatar_color", randomDarkColor);

      window.location.href = data.role === "ADMIN" ? "/users" : "/services";
      return { success: true};
    }

    const errorData = await response.json();
    return {
      success: false,
      error: {
        name: " ",
        message: errorData.message || "Błędne dane logowania",
      },
    };
  },

  register: async ({ email, password, firstName, lastName, phoneNumber }) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, phoneNumber, role: "CUSTOMER" }),
    });

    if (response.ok) {
      return { success: true, redirectTo: "/login" };
    }

    const errorData = await response.json();
    return {
      success: false,
      error: {
        name: "RegisterError",
        message: errorData.message || "Błąd rejestracji",
      },
    };
  },

  logout: async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_avatar_color");

    window.location.href = "/login"

    return { success: true};
  },

  check: async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("auth_token");
      return { logout: true };
    }
    return { error };
  },
};