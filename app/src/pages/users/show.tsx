import { Show as RefineShow, TextField, EmailField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const UserShow = () => {
    const { query: { data, isLoading } } = useShow();
    const record = data?.data;

    return (
        <RefineShow isLoading={isLoading}>

            <Title level={5}>{"Imię i Nazwisko"}</Title>
            <TextField value={`${record?.firstName || ""} ${record?.lastName || ""}`} />

            <Title level={5}>{"E-mail"}</Title>
            <EmailField value={record?.email} />

            <Title level={5}>{"Numer telefonu"}</Title>
            <TextField value={record?.phoneNumber} />
        </RefineShow>
    );
};