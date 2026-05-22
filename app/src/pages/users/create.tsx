import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="firstName" label="Imię" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Nazwisko" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Telefon">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
