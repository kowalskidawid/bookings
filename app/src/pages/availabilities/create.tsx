import { Create, useForm } from "@refinedev/antd";
import { Form, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import { DAY_LABELS, DAYS } from ".";

const FORMAT = "HH:mm:ss";

export const AvailabilityCreate = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        onFinish={(values: any) => onFinish({
          ...values,
          startAt: values.startAt ? dayjs(values.startAt).format(FORMAT) : undefined,
          endAt: values.endAt ? dayjs(values.endAt).format(FORMAT) : undefined,
        })}
        layout="vertical"
      >
        <Form.Item name="dayOfWeek" label="Dzień tygodnia" rules={[{ required: true }]}>
          <Select>
            {DAYS.map((d) => <Select.Option key={d} value={d}>{DAY_LABELS[d]}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="startAt" label="Od" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="endAt" label="Do" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Create>
  );
};
