import { DeleteButton, EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import { Button, Form, Input, InputNumber, Space, Table } from "antd";

interface EmployerResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  services: { id: number; name: string }[];
  availabilities: { id: number; dayOfWeek: string }[];
}

interface EmployerFilter {
  email?: string;
  firstName?: string;
  lastName?: string;
  serviceId?: number;
  availabilityId?: number;
}

export const EmployerList = () => {
  const { tableProps, setFilters } = useTable<EmployerResponse>({
    syncWithLocation: true,
  });
  const [form] = Form.useForm<EmployerFilter>();

  const applyFilters = (values: EmployerFilter) => {
    setFilters(
      [
        { field: "email", operator: "eq", value: values.email },
        { field: "firstName", operator: "eq", value: values.firstName },
        { field: "lastName", operator: "eq", value: values.lastName },
        { field: "serviceId", operator: "eq", value: values.serviceId },
        { field: "availabilityId", operator: "eq", value: values.availabilityId },
      ],
      "replace"
    );
  };

  return (
    <List title="Pracownicy">
      <Form form={form} layout="inline" onFinish={applyFilters} style={{ marginBottom: 16 }}>
        <Form.Item name="email">
          <Input placeholder="Email" allowClear />
        </Form.Item>
        <Form.Item name="firstName">
          <Input placeholder="Imię" allowClear />
        </Form.Item>
        <Form.Item name="lastName">
          <Input placeholder="Nazwisko" allowClear />
        </Form.Item>
        <Form.Item name="serviceId">
          <InputNumber placeholder="ID usługi" style={{ width: 110 }} />
        </Form.Item>
        <Form.Item name="availabilityId">
          <InputNumber placeholder="ID dostępności" style={{ width: 130 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Filtruj</Button>
            <Button onClick={() => { form.resetFields(); setFilters([], "replace"); }}>Resetuj</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="firstName" title="Imię" />
        <Table.Column dataIndex="lastName" title="Nazwisko" />
        <Table.Column dataIndex="phoneNumber" title="Telefon" />
        <Table.Column
          dataIndex="services"
          title="Usługi"
          render={(services: { name: string }[]) => services?.map((s) => s.name).join(", ")}
        />
        <Table.Column
          title="Akcje"
          render={(_, record: EmployerResponse) => (
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
