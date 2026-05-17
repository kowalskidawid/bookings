import {
    List as RefineList,
    useTable,
    TextField,
    NumberField,
    EditButton,
    DeleteButton,
    ShowButton
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { useCan } from "@refinedev/core";

export const ServiceList = () => {
    const { tableProps } = useTable();

    const { data: canEditData } = useCan({ resource: "services", action: "edit" });
    const { data: canCreateData } = useCan({ resource: "services", action: "create" });

    return (
        <RefineList createButtonProps={canCreateData?.can ? {} : { style: { display: "none" } }}>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="id"
                    title="ID"
                    width={80}
                    align="center"
                />

                <Table.Column
                    dataIndex="name"
                    title="Service name"
                    render={(value) => <TextField value={value} style={{ fontWeight: "bold" }} />}
                />

                <Table.Column
                    dataIndex="basePrice"
                    title="Base price"
                    render={(value) => (
                        <NumberField
                            value={value}
                            options={{
                                style: "currency",
                                currency: "PLN"
                            }}
                        />
                    )}
                />

                <Table.Column
                    dataIndex="timeInMinutes"
                    title="Duration time"
                    render={(value) => <span>{value} min</span>}
                />

                {canEditData?.can && (
                    <Table.Column
                        title="Actions"
                        fixed="right"
                        dataIndex="actions"
                        render={(_, record: any) => (
                            <Space>
                                <EditButton accessControl={{hideIfUnauthorized: true}} hideText size="small" recordItemId={record.id} />
                                <ShowButton accessControl={{hideIfUnauthorized: true}} hideText size="small" recordItemId={record.id} />
                                <DeleteButton accessControl={{hideIfUnauthorized: true}} hideText size="small" recordItemId={record.id} />
                            </Space>
                        )}
                    />
                )}
            </Table>
        </RefineList>
    );
};