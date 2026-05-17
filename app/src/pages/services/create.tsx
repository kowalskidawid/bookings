import { Create as RefineCreate, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";


export const ServiceCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <RefineCreate saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">

                <Form.Item
                    label="Service name: "
                    name="name"
                    rules={[{ required: true, message: "Service name field cannot be empty." }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Base price in PLN: "
                    name="basePrice"
                    rules={[{ required: true, message: "Base price field cannot be empty" }]}
                >
                    <InputNumber<number>
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => {
                            const parsed = value?.replace(/zł\s?|(,*)/g, "");
                            return parsed ? parseFloat(parsed) : 0;
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Estimated duration in minutes: "
                    name="timeInMinutes"
                    rules={[{ required: true, message: "Estimated duration field cannot be empty" }]}
                >
                    <InputNumber
                        min={1}
                        style={{ width: "100%" }}

                    />
                </Form.Item>
            </Form>
        </RefineCreate>
    );
};