import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const UserEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
        <Form.Item name="password" label="Hasło" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Telefon">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
