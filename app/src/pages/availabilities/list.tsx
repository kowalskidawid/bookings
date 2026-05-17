import { DeleteButton, EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { CopyOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Form, Modal, Select, Space, Table, TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { DAY_LABELS, DAYS } from ".";

const FORMAT = "HH:mm";

interface AvailabilityResponse {
  id: number;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

interface AvailabilityFilter {
  dayOfWeek?: string;
  startAtFrom?: dayjs.Dayjs;
  startAtTo?: dayjs.Dayjs;
}

export const AvailabilityList = () => {
  const { tableProps, setFilters } = useTable<AvailabilityResponse>({
    syncWithLocation: true,
  });
  const [form] = Form.useForm<AvailabilityFilter>();
  const { mutateAsync: createAvailability } = useCreate();
  const { notification } = App.useApp();

  const [copyRecord, setCopyRecord] = useState<AvailabilityResponse | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [copying, setCopying] = useState(false);

  const applyFilters = (values: AvailabilityFilter) => {
    setFilters(
      [
        { field: "dayOfWeek", operator: "eq", value: values.dayOfWeek },
        { field: "startAtFrom", operator: "eq", value: values.startAtFrom?.format("HH:mm:ss") },
        { field: "startAtTo", operator: "eq", value: values.startAtTo?.format("HH:mm:ss") },
      ],
      "replace"
    );
  };

  const openCopyModal = (record: AvailabilityResponse) => {
    setCopyRecord(record);
    setSelectedDays([]);
    setCopying(false);
  };

  const handleCopy = async () => {
    if (!copyRecord || selectedDays.length === 0) return;
    setCopying(true);
    try {
      for (const day of selectedDays) {
        await createAvailability({
          resource: "availabilities",
          values: {
            dayOfWeek: day,
            startAt: copyRecord.startAt,
            endAt: copyRecord.endAt,
          },
          successNotification: false,
          errorNotification: false,
        });
      }
      notification.success({
        message: `Skopiowano dostępność na ${selectedDays.length} ${selectedDays.length === 1 ? "dzień" : "dni"}`,
      });
      setCopyRecord(null);
    } catch {
      notification.error({ message: "Błąd podczas kopiowania dostępności" });
    } finally {
      setCopying(false);
    }
  };

  return (
    <List title="Dostępności">
      <Form form={form} layout="inline" onFinish={applyFilters} style={{ marginBottom: 16 }}>
        <Form.Item name="dayOfWeek">
          <Select placeholder="Dzień tygodnia" allowClear style={{ width: 160 }}>
            {DAYS.map((d) => <Select.Option key={d} value={d}>{DAY_LABELS[d]}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="startAtFrom">
          <TimePicker placeholder="Od godziny" format={FORMAT} />
        </Form.Item>
        <Form.Item name="startAtTo">
          <TimePicker placeholder="Do godziny" format={FORMAT} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Filtruj</Button>
            <Button onClick={() => { form.resetFields(); setFilters([], "replace"); }}>Resetuj</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="dayOfWeek" title="Dzień tygodnia" render={(v) => DAY_LABELS[v] ?? v} />
        <Table.Column dataIndex="startAt" title="Od" render={(v) => v?.slice(0, 5)} />
        <Table.Column dataIndex="endAt" title="Do" render={(v) => v?.slice(0, 5)} />
        <Table.Column
          title="Akcje"
          render={(_, record: AvailabilityResponse) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
              <Button
                icon={<CopyOutlined />}
                size="small"
                title="Kopiuj"
                onClick={() => openCopyModal(record)}
              />
            </Space>
          )}
        />
      </Table>

      <Modal
        title={
          copyRecord
            ? `Kopiuj dostępność: ${DAY_LABELS[copyRecord.dayOfWeek]} ${copyRecord.startAt?.slice(0, 5)}–${copyRecord.endAt?.slice(0, 5)}`
            : "Kopiuj dostępność"
        }
        open={!!copyRecord}
        onCancel={() => setCopyRecord(null)}
        onOk={handleCopy}
        okText="Kopiuj"
        cancelText="Anuluj"
        okButtonProps={{ disabled: selectedDays.length === 0, loading: copying }}
      >
        <p style={{ marginBottom: 12 }}>Wybierz dni, na które chcesz skopiować tę dostępność:</p>
        <Checkbox.Group
          value={selectedDays}
          onChange={(vals) => setSelectedDays(vals as string[])}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {DAYS.filter((d) => d !== copyRecord?.dayOfWeek).map((d) => (
            <Checkbox key={d} value={d}>{DAY_LABELS[d]}</Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
    </List>
  );
};
