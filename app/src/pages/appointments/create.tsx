import { Create, useForm, useSelect } from "@refinedev/antd";
import { DatePicker, Form, Select } from "antd";
import dayjs from "dayjs";

export const AppointmentCreate = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();

  const { selectProps: clientSelectProps } = useSelect({
    resource: "users",
    optionLabel: (item: any) => `${item.firstName} ${item.lastName} (${item.email})`,
    optionValue: "id" as any,
  });

  const { selectProps: employerSelectProps } = useSelect({
    resource: "employers",
    optionLabel: (item: any) => `${item.firstName} ${item.lastName}`,
    optionValue: "id" as any,
  });

  const { selectProps: serviceSelectProps } = useSelect({
    resource: "services",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        onFinish={(values: any) => onFinish({
          ...values,
          startAt: values.startAt ? dayjs(values.startAt).format("YYYY-MM-DDTHH:mm:ss") : undefined,
          endAt: values.endAt ? dayjs(values.endAt).format("YYYY-MM-DDTHH:mm:ss") : undefined,
        })}
        layout="vertical"
      >
        <Form.Item name="clientId" label="Klient" rules={[{ required: true }]}>
          <Select {...clientSelectProps} placeholder="Wybierz klienta" showSearch />
        </Form.Item>
        <Form.Item name="employerId" label="Pracownik" rules={[{ required: true }]}>
          <Select {...employerSelectProps} placeholder="Wybierz pracownika" showSearch />
        </Form.Item>
        <Form.Item name="serviceIds" label="Usługi">
          <Select mode="multiple" {...serviceSelectProps} placeholder="Wybierz usługi" />
        </Form.Item>
        <Form.Item name="startAt" label="Rozpoczęcie" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="endAt" label="Zakończenie" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Create>
  );
};
