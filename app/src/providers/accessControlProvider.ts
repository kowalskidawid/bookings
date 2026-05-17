import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
    can: async ({ resource, action }) => {
        const role = localStorage.getItem("user_role");

        if (resource === "users") {
            if (role === "ADMIN") return { can: true };
            return { can: false, reason: "No permission" };
        }

        if (resource === "services") {
            if (action === "list" || action === "show") {
                return { can: true };
            }

            if (action === "create" || action === "edit") {
                if (role === "ADMIN" || role === "EMPLOYER") {
                    return { can: true };
                }
            }

            if (action === "delete") {
                if (role === "ADMIN") {
                    return { can: true };
                }
            }

            return { can: false, reason: "No admin permission" };
        }

        return { can: true };
    },
};