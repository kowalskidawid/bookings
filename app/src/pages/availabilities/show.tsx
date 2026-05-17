import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Descriptions } from "antd";
import { DAY_LABELS } from ".";

export const AvailabilityShow = () => {
  const { query } = useShow();
  const record = query?.data?.data;

  return (
    <Show isLoading={query?.isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Dzień tygodnia">{record?.dayOfWeek ? DAY_LABELS[record.dayOfWeek] ?? record.dayOfWeek : ""}</Descriptions.Item>
        <Descriptions.Item label="Od">{record?.startAt?.slice(0, 5)}</Descriptions.Item>
        <Descriptions.Item label="Do">{record?.endAt?.slice(0, 5)}</Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
