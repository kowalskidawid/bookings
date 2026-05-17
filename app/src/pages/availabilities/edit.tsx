import { Edit, useForm } from "@refinedev/antd";
import { Form, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { DAY_LABELS, DAYS } from ".";

const FORMAT = "HH:mm:ss";

export const AvailabilityEdit = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm();

  const record = query?.data?.data;

  useEffect(() => {
    if (record) {
      formProps.form?.setFieldsValue({
        ...record,
        startAt: record.startAt ? dayjs(record.startAt, FORMAT) : undefined,
        endAt: record.endAt ? dayjs(record.endAt, FORMAT) : undefined,
      });
    }
  }, [record]);

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
    </Edit>
  );
};
