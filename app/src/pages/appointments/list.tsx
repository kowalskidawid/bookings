import { DeleteButton, EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Button, DatePicker, Form, Input, Select, Space, Table, Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router";
import { STATUSES, STATUS_COLORS, STATUS_LABELS } from ".";

interface AppointmentResponse {
  id: number;
  readableId: string;
  client: { id: number; firstName: string; lastName: string };
  employer: { id: number; firstName: string; lastName: string };
  services: { id: number; name: string }[];
  startAt: string;
  endAt: string;
  status: string;
}

interface AppointmentFilter {
  readableId?: string;
  clientId?: number;
  employerId?: number;
  status?: string;
  startAtFrom?: dayjs.Dayjs;
  startAtTo?: dayjs.Dayjs;
}

export const AppointmentList = () => {
  const { tableProps, setFilters } = useTable<AppointmentResponse>({
    syncWithLocation: true,
  });
  const [form] = Form.useForm<AppointmentFilter>();

  const { query: usersQuery } = useList({ resource: "users", pagination: { pageSize: 500 } });
  const { query: employersQuery } = useList({ resource: "employers", pagination: { pageSize: 500 } });

  const clientOptions = usersQuery.data?.data?.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  })) ?? [];

  const employerOptions = employersQuery.data?.data?.map((e) => ({
    value: e.id,
    label: `${e.firstName} ${e.lastName}`,
  })) ?? [];

  const applyFilters = (values: AppointmentFilter) => {
    setFilters(
      [
        { field: "readableId", operator: "eq", value: values.readableId },
        { field: "clientId", operator: "eq", value: values.clientId },
        { field: "employerId", operator: "eq", value: values.employerId },
        { field: "status", operator: "eq", value: values.status },
        { field: "startAtFrom", operator: "eq", value: values.startAtFrom?.toISOString() },
        { field: "startAtTo", operator: "eq", value: values.startAtTo?.toISOString() },
      ],
      "replace"
    );
  };

  return (
    <List
      title="Wizyty"
      headerButtons={({ defaultButtons }) => (
        <>
          <Link to="/book" target="_blank">
            <Button icon={<CalendarOutlined />}>Strona rezerwacji</Button>
          </Link>
          {defaultButtons}
        </>
      )}
    >
      <Form form={form} layout="inline" onFinish={applyFilters} style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <Form.Item name="readableId">
          <Input placeholder="Identyfikator" allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="clientId">
          <Select
            placeholder="Klient"
            allowClear
            showSearch
            optionFilterProp="label"
            options={clientOptions}
            style={{ width: 180 }}
          />
        </Form.Item>
        <Form.Item name="employerId">
          <Select
            placeholder="Pracownik"
            allowClear
            showSearch
            optionFilterProp="label"
            options={employerOptions}
            style={{ width: 180 }}
          />
        </Form.Item>
        <Form.Item name="status">
          <Select placeholder="Status" allowClear style={{ width: 150 }}>
            {STATUSES.map((s) => <Select.Option key={s} value={s}>{STATUS_LABELS[s]}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="startAtFrom">
          <DatePicker showTime placeholder="Od" format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item name="startAtTo">
          <DatePicker showTime placeholder="Do" format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Filtruj</Button>
            <Button onClick={() => { form.resetFields(); setFilters([], "replace"); }}>Resetuj</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="readableId" title="Identyfikator" />
        <Table.Column
          dataIndex="client"
          title="Klient"
          render={(c) => c ? `${c.firstName} ${c.lastName}` : "-"}
        />
        <Table.Column
          dataIndex="employer"
          title="Pracownik"
          render={(e) => e ? `${e.firstName} ${e.lastName}` : "-"}
        />
        <Table.Column
          dataIndex="services"
          title="Usługi"
          render={(s: { name: string }[]) => s?.map((x) => x.name).join(", ")}
        />
        <Table.Column
          dataIndex="startAt"
          title="Rozpoczęcie"
          render={(v) => v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "-"}
        />
        <Table.Column
          dataIndex="endAt"
          title="Zakończenie"
          render={(v) => v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "-"}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(v) => <Tag color={STATUS_COLORS[v]}>{STATUS_LABELS[v] ?? v}</Tag>}
        />
        <Table.Column
          title="Akcje"
          render={(_, record: AppointmentResponse) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
