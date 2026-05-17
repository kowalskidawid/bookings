import { useRegister } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, Space } from "antd";

const { Title } = Typography;

export const Register = () => {
  const { mutate: register, isPending } = useRegister();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    register(values);
  };

  return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
        <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3}>Create account</Title>
          </div>

          <Form form={form} name="register" onFinish={onFinish} layout="vertical" requiredMark={false}>

            <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please provide your first name!" }]}
            >
              <Input placeholder="John" />
            </Form.Item>

            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please provide your last name!" }]}
            >
              <Input placeholder="Smith" />
            </Form.Item>

            <Form.Item
                label="Phone number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please provide your phone number!" },
                  { pattern: /^[0-9+ ]{9,15}$/, message: "Incorrect phone number format" }
                ]}
            >
              <Input placeholder="123 456 789" />
            </Form.Item>

            <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  { type: "email", message: "Provided e-mail address is incorrect!" },
                  { required: true, message: "Please provide your e-mail address" }
                ]}
            >
              <Input placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
                label="Hasło"
                name="password"

                style={{ whiteSpace: "pre-line" }}
                rules={[
                  {
                    required: true,
                    message: "Please provide your password!"
                  },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }

                      const hasMinLength = value.length >= 8;
                      const hasUppercase = /[A-Z]/.test(value);
                      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(value);

                      if (!hasMinLength || !hasUppercase || !hasSpecialChar) {
                        return Promise.reject(
                            new Error("Password must meet requirements:\n- Contains at least 8 characters" +
                                "\n- Contains at least 1 special character \n- Contains at least 1 uppercase letter")
                        );
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
            >
              <Input.Password placeholder="********" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={isPending} block>
               Sign Up
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Space>
              <span>Are you already signed up?</span>
              <a href="/login">Sign In</a>
            </Space>
          </div>
        </Card>
      </div>
  );
};