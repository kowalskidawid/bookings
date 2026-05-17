import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import { STATUS_COLORS, STATUS_LABELS } from ".";

export const AppointmentShow = () => {
  const { query } = useShow();
  const record = query?.data?.data;

  return (
    <Show isLoading={query?.isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Identyfikator">{record?.readableId}</Descriptions.Item>
        <Descriptions.Item label="Status">
          {record?.status && <Tag color={STATUS_COLORS[record.status]}>{STATUS_LABELS[record.status] ?? record.status}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Klient">
          {record?.client && `${record.client.firstName} ${record.client.lastName} (${record.client.email})`}
        </Descriptions.Item>
        <Descriptions.Item label="Pracownik">
          {record?.employer && `${record.employer.firstName} ${record.employer.lastName}`}
        </Descriptions.Item>
        <Descriptions.Item label="Usługi">
          {record?.services?.map((s: { id: number; name: string }) => (
            <Tag key={s.id}>{s.name}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Rozpoczęcie">
          {record?.startAt && dayjs(record.startAt).format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Zakończenie">
          {record?.endAt && dayjs(record.endAt).format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
