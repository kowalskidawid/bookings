import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Descriptions, Typography } from "antd";

export const ServiceShow = () => {
  const { query } = useShow();
  const record = query?.data?.data;

  return (
    <Show isLoading={query?.isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Nazwa">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Czas (minuty)">{record?.timeInMinutes}</Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
