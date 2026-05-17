import { List as RefineList, useTable, EmailField } from "@refinedev/antd";
import { Table } from "antd";

export const UserList = () => {
    const { tableProps } = useTable();

    return (
        <RefineList>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="firstName" title="Imię" />
                <Table.Column dataIndex="lastName" title="Nazwisko" />
                <Table.Column
                    dataIndex="email"
                    title="E-mail"
                    render={(value) => <EmailField value={value} />}
                />
                <Table.Column dataIndex="phoneNumber" title="Telefon" />
            </Table>
        </RefineList>
    );
};