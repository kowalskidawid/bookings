import { Link } from "react-router";
import { Space, theme, Typography } from "antd";

const { useToken } = theme;

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { token } = useToken();

  return (
    <Link
      to="/"
      style={{
        display: "inline-block",
        textDecoration: "none",
      }}
    >
      <Space size="small" align="center">
        <img
          src="/logo.svg"
          alt="Booking"
          style={{ width: 32, height: 32, display: "block" }}
        />
        {!collapsed && (
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              color: token.colorPrimary,
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            Booking
          </Typography.Title>
        )}
      </Space>
    </Link>
  );
};
