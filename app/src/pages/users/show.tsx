import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Descriptions, Tag } from "antd";

const typeColor: Record<string, string> = {
  ADMIN: "red",
  EMPLOYER: "blue",
  CUSTOMER: "green",
};

export const UserShow = () => {
  const { query } = useShow();
  const record = query?.data?.data;

  return (
    <Show isLoading={query?.isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Typ">
          {record?.userType && <Tag color={typeColor[record.userType]}>{record.userType}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="Imię">{record?.firstName}</Descriptions.Item>
        <Descriptions.Item label="Nazwisko">{record?.lastName}</Descriptions.Item>
        <Descriptions.Item label="Telefon">{record?.phoneNumber}</Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
