import type { AuthProvider } from "@refinedev/core";
import { keycloak } from "./keycloak";

export const authProvider: AuthProvider = {
  login: async () => {
    await keycloak.login();
    return { success: true };
  },

  logout: async () => {
    await keycloak.logout({ redirectUri: `${window.location.origin}/login` });
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    if (keycloak.authenticated) {
      // Odśwież token jeśli wygasa w ciągu 30s
      await keycloak.updateToken(30).catch(() => keycloak.login());
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getPermissions: async () => {
    return (keycloak.tokenParsed as any)?.realm_access?.roles ?? [];
  },

  getIdentity: async () => {
    if (!keycloak.tokenParsed) return null;
    const parsed = keycloak.tokenParsed as any;
    return {
      id: parsed.sub,
      name: parsed.name ?? `${parsed.given_name ?? ""} ${parsed.family_name ?? ""}`.trim(),
      email: parsed.email,
      avatar: `https://i.pravatar.cc/300?u=${parsed.sub}`,
    };
  },

  onError: async (error) => {
    return { error };
  },
};
