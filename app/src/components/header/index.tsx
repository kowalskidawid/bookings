import {Layout, Space, Typography, Avatar, Switch} from "antd";
import { ColorModeContext } from "../../contexts/color-mode";
import { useContext } from "react";
const { Text } = Typography;

export const Header = () => {

  const { mode, setMode } = useContext(ColorModeContext);

  const userName = localStorage.getItem("user_name") || "Użytkownik";
  const userRole = localStorage.getItem("user_role") || "ROLE";

  const savedAvatarColor = localStorage.getItem("user_avatar_color") || "#1890ff";

  return (
      <Layout.Header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 24px",
            background: mode === "dark" ? "#141414" : "#ffffff",
            boxShadow: "0 1px 4px rgba(0, 21, 41, 0.08)",
            height: "64px",
          }}
      >
        <Space size="middle">
          <Switch
              checked={mode === "dark"}
              onChange={(checked) => setMode(checked ? "dark" : "light")}
              checkedChildren="Ciemny"
              unCheckedChildren="Jasny"
          />

          <div style={{ display: "flex", flexDirection: "column", textAlign: "right", lineHeight: "1.2" }}>
            <Text strong style={{ fontSize: "14px" }}>
              {userName}
            </Text>

            <Text
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  color: userRole === "ADMIN" ? "#ff4d4f" : (mode === "dark" ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)")
                }}
            >
              {userRole}
            </Text>
          </div>

          <Avatar
              style={{
                backgroundColor: savedAvatarColor,
                verticalAlign: "middle"
              }}
              size="large"
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
        </Space>
      </Layout.Header>
  );
};