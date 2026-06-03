import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

export const ServiceEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Nazwa" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="timeInMinutes" label="Czas (minuty)" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="basePrice" label="Cena bazowa (zł)" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} precision={2} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
