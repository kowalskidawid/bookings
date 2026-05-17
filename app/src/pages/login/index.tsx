import { useEffect } from "react";
import { keycloak } from "../../providers/keycloak";

export const Login = () => {
  useEffect(() => {
    if (!keycloak.authenticated) {
      keycloak.login();
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <span>Przekierowywanie do Keycloak...</span>
    </div>
  );
};
