import { DeleteButton, EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import { Button, Form, Input, Select, Space, Table, Tag } from "antd";

const USER_TYPES = ["ADMIN", "EMPLOYER", "CUSTOMER"];

interface UserResponse {
  id: number;
  userType: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface UserFilter {
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
}

const typeColor: Record<string, string> = {
  ADMIN: "red",
  EMPLOYER: "blue",
  CUSTOMER: "green",
};

export const UserList = () => {
  const { tableProps, setFilters } = useTable<UserResponse>({
    syncWithLocation: true,
  });
  const [form] = Form.useForm<UserFilter>();

  const applyFilters = (values: UserFilter) => {
    setFilters(
      [
        { field: "email", operator: "eq", value: values.email },
        { field: "firstName", operator: "eq", value: values.firstName },
        { field: "lastName", operator: "eq", value: values.lastName },
        { field: "userType", operator: "eq", value: values.userType },
      ],
      "replace"
    );
  };

  return (
    <List title="Użytkownicy">
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
        <Form.Item name="userType">
          <Select placeholder="Typ użytkownika" allowClear style={{ width: 160 }}>
            {USER_TYPES.map((t) => <Select.Option key={t} value={t}>{t}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Filtruj</Button>
            <Button onClick={() => { form.resetFields(); setFilters([], "replace"); }}>Resetuj</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="userType" title="Typ" render={(v) => <Tag color={typeColor[v]}>{v}</Tag>} />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="firstName" title="Imię" />
        <Table.Column dataIndex="lastName" title="Nazwisko" />
        <Table.Column dataIndex="phoneNumber" title="Telefon" />
        <Table.Column
          title="Akcje"
          render={(_, record: UserResponse) => (
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
