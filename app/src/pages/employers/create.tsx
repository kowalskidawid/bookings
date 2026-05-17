import { Create, useForm, useSelect } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import { DAY_LABELS } from "../availabilities";

export const EmployerCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  const { selectProps: serviceSelectProps } = useSelect({
    resource: "services",
    optionLabel: "name",
    optionValue: "id",
  });

  const { query: availabilityQuery } = useList({
    resource: "availabilities",
    pagination: { pageSize: 200 },
  });

  const availabilityOptions = availabilityQuery.data?.data?.map((a) => ({
    value: a.id,
    label: `${DAY_LABELS[a.dayOfWeek] ?? a.dayOfWeek}  ${a.startAt?.slice(0, 5)}–${a.endAt?.slice(0, 5)}`,
  })) ?? [];

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
        <Form.Item name="serviceIds" label="Usługi">
          <Select mode="multiple" {...serviceSelectProps} placeholder="Wybierz usługi" />
        </Form.Item>
        <Form.Item name="availabilityIds" label="Dostępności">
          <Select mode="multiple" options={availabilityOptions} placeholder="Wybierz dostępności" />
        </Form.Item>
      </Form>
    </Create>
  );
};
