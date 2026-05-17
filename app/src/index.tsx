import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { keycloak } from "./providers/keycloak";

keycloak
  .init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
  })
  .then(() => {
    const container = document.getElementById("root") as HTMLElement;
    createRoot(container).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error("Keycloak init failed", err);
  });
