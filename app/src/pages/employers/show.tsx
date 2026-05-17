import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Descriptions, Tag } from "antd";
import { DAY_LABELS } from "../availabilities";

export const EmployerShow = () => {
  const { query } = useShow();
  const record = query?.data?.data;

  return (
    <Show isLoading={query?.isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="Imię">{record?.firstName}</Descriptions.Item>
        <Descriptions.Item label="Nazwisko">{record?.lastName}</Descriptions.Item>
        <Descriptions.Item label="Telefon">{record?.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Usługi">
          {record?.services?.map((s: { id: number; name: string }) => (
            <Tag key={s.id}>{s.name}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Dostępności">
          {record?.availabilities?.map((a: { id: number; dayOfWeek: string; startAt: string; endAt: string }) => (
            <Tag key={a.id}>{`${DAY_LABELS[a.dayOfWeek] ?? a.dayOfWeek} ${a.startAt?.slice(0, 5)}–${a.endAt?.slice(0, 5)}`}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
