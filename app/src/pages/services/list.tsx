import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/antd";
import { useTable } from "@refinedev/antd";
import { Button, Form, Input, InputNumber, Space, Table } from "antd";

interface ServiceResponse {
  id: number;
  name: string;
  timeInMinutes: number;
}

interface ServiceFilter {
  name?: string;
  timeInMinutesMin?: number;
  timeInMinutesMax?: number;
}

export const ServiceList = () => {
  const { tableProps, setFilters } = useTable<ServiceResponse>({
    syncWithLocation: true,
  });
  const [form] = Form.useForm<ServiceFilter>();

  const applyFilters = (values: ServiceFilter) => {
    setFilters(
      [
        { field: "name", operator: "eq", value: values.name },
        { field: "timeInMinutesMin", operator: "eq", value: values.timeInMinutesMin },
        { field: "timeInMinutesMax", operator: "eq", value: values.timeInMinutesMax },
      ],
      "replace"
    );
  };

  return (
    <List title="Usługi">
      <Form form={form} layout="inline" onFinish={applyFilters} style={{ marginBottom: 16 }}>
        <Form.Item name="name">
          <Input placeholder="Nazwa" allowClear />
        </Form.Item>
        <Form.Item name="timeInMinutesMin">
          <InputNumber placeholder="Czas min (min)" style={{ width: 140 }} />
        </Form.Item>
        <Form.Item name="timeInMinutesMax">
          <InputNumber placeholder="Czas max (min)" style={{ width: 140 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Filtruj</Button>
            <Button onClick={() => { form.resetFields(); setFilters([], "replace"); }}>Resetuj</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Nazwa" />
        <Table.Column dataIndex="timeInMinutes" title="Czas (min)" />
        <Table.Column
          title="Akcje"
          render={(_, record: ServiceResponse) => (
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
