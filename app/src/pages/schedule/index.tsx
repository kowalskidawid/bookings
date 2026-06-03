import { useList, useNavigation } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Radio,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useMemo, useState } from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../appointments";

dayjs.extend(isoWeek);

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 56; // px na godzinę
const GRID_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

// Tła bloków wizyt powiązane z kolorami statusów (WF4).
const STATUS_BG: Record<string, string> = {
  BOOKED: "#e6f4ff",
  CONFIRMED: "#f6ffed",
  FINISHED: "#fafafa",
  CANCELED: "#fff1f0",
  NO_SHOW: "#fff7e6",
};

interface AppointmentDto {
  id: number;
  readableId: string;
  client?: { firstName: string; lastName: string };
  services?: { id: number; name: string }[];
  startAt: string;
  endAt: string;
  status: string;
}

type ViewMode = "day" | "week";

const toLocalDateTime = (d: dayjs.Dayjs) => d.format("YYYY-MM-DDTHH:mm:ss");

export const SchedulePage = () => {
  const { show } = useNavigation();
  const [view, setView] = useState<ViewMode>("week");
  const [anchor, setAnchor] = useState<dayjs.Dayjs>(dayjs());
  const [employerId, setEmployerId] = useState<number | undefined>();

  const { selectProps: employerSelectProps } = useSelect({
    resource: "employers",
    optionLabel: (item: any) => `${item.firstName} ${item.lastName}`,
    optionValue: "id" as any,
  });

  const rangeStart = view === "day" ? anchor.startOf("day") : anchor.startOf("isoWeek");
  const rangeEnd = view === "day" ? anchor.endOf("day") : anchor.endOf("isoWeek");

  const days = useMemo(() => {
    const count = view === "day" ? 1 : 7;
    return Array.from({ length: count }, (_, i) => rangeStart.add(i, "day"));
  }, [view, rangeStart.valueOf()]);

  const { query: appointmentsQuery } = useList<AppointmentDto>({
    resource: "appointments",
    pagination: { pageSize: 500 },
    filters: [
      { field: "employerId", operator: "eq", value: employerId },
      { field: "startAtFrom", operator: "eq", value: toLocalDateTime(rangeStart) },
      { field: "startAtTo", operator: "eq", value: toLocalDateTime(rangeEnd) },
    ],
    queryOptions: { enabled: !!employerId },
  });

  const appointments: AppointmentDto[] = appointmentsQuery.data?.data ?? [];
  const isFetching = appointmentsQuery.isFetching;

  const appointmentsForDay = (day: dayjs.Dayjs) =>
    appointments.filter((a) => dayjs(a.startAt).isSame(day, "day"));

  const blockStyle = (a: AppointmentDto): React.CSSProperties => {
    const start = dayjs(a.startAt);
    const end = dayjs(a.endAt);
    const startMin = Math.max(0, (start.hour() - START_HOUR) * 60 + start.minute());
    const endMin = Math.min((END_HOUR - START_HOUR) * 60, (end.hour() - START_HOUR) * 60 + end.minute());
    const top = (startMin / 60) * HOUR_HEIGHT;
    const height = Math.max(18, ((endMin - startMin) / 60) * HOUR_HEIGHT);
    return {
      position: "absolute",
      top,
      height,
      left: 4,
      right: 4,
      background: STATUS_BG[a.status] ?? "#fafafa",
      borderLeft: `3px solid var(--ant-color-primary, #1677ff)`,
      borderRadius: 4,
      padding: "2px 6px",
      fontSize: 12,
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    };
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  const shift = (dir: number) => {
    setAnchor((prev) => prev.add(dir, view === "day" ? "day" : "week"));
  };

  const rangeLabel =
    view === "day"
      ? anchor.format("dddd, DD.MM.YYYY")
      : `${rangeStart.format("DD.MM")} – ${rangeEnd.format("DD.MM.YYYY")}`;

  return (
    <Card title="Kalendarz wizyt">
      <Space wrap style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Space wrap>
          <Select
            {...(employerSelectProps as any)}
            placeholder="Wybierz pracownika"
            style={{ minWidth: 220 }}
            showSearch
            value={employerId}
            onChange={(v: number) => setEmployerId(v)}
          />
          <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
            <Radio.Button value="day">Dzień</Radio.Button>
            <Radio.Button value="week">Tydzień</Radio.Button>
          </Radio.Group>
        </Space>
        <Space wrap>
          <Button icon={<LeftOutlined />} onClick={() => shift(-1)} />
          <Button onClick={() => setAnchor(dayjs())}>Dziś</Button>
          <Button icon={<RightOutlined />} onClick={() => shift(1)} />
          <DatePicker
            value={anchor}
            onChange={(d) => d && setAnchor(d)}
            format="DD.MM.YYYY"
            allowClear={false}
          />
          <Typography.Text strong>{rangeLabel}</Typography.Text>
        </Space>
      </Space>

      {!employerId ? (
        <Empty description="Wybierz pracownika, aby zobaczyć jego grafik" />
      ) : (
        <Spin spinning={isFetching}>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "flex", minWidth: view === "week" ? 760 : 320 }}>
              {/* Kolumna z godzinami */}
              <div style={{ width: 56, flexShrink: 0 }}>
                <div style={{ height: 32 }} />
                <div style={{ position: "relative", height: GRID_HEIGHT }}>
                  {hours.map((h, i) => (
                    <div
                      key={h}
                      style={{
                        position: "absolute",
                        top: i * HOUR_HEIGHT - 8,
                        right: 6,
                        fontSize: 11,
                        color: "#999",
                      }}
                    >
                      {String(h).padStart(2, "0")}:00
                    </div>
                  ))}
                </div>
              </div>

              {/* Kolumny dni */}
              {days.map((day) => {
                const isToday = day.isSame(dayjs(), "day");
                return (
                  <div key={day.valueOf()} style={{ flex: 1, minWidth: 100, borderLeft: "1px solid #f0f0f0" }}>
                    <div
                      style={{
                        height: 32,
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: 13,
                        color: isToday ? "#1677ff" : undefined,
                        textTransform: "capitalize",
                      }}
                    >
                      {view === "week" ? day.format("ddd DD.MM") : day.format("dddd")}
                    </div>
                    <div
                      style={{
                        position: "relative",
                        height: GRID_HEIGHT,
                        background: isToday ? "#f5faff" : undefined,
                      }}
                    >
                      {hours.map((h, i) => (
                        <div
                          key={h}
                          style={{
                            position: "absolute",
                            top: i * HOUR_HEIGHT,
                            left: 0,
                            right: 0,
                            borderTop: "1px solid #f5f5f5",
                            height: HOUR_HEIGHT,
                          }}
                        />
                      ))}
                      {appointmentsForDay(day).map((a) => (
                        <div
                          key={a.id}
                          style={blockStyle(a)}
                          onClick={() => show("appointments", a.id)}
                          title={`${dayjs(a.startAt).format("HH:mm")}–${dayjs(a.endAt).format("HH:mm")} ${
                            a.client ? `${a.client.firstName} ${a.client.lastName}` : ""
                          }`}
                        >
                          <div style={{ fontWeight: 600 }}>
                            {dayjs(a.startAt).format("HH:mm")} {a.client ? `${a.client.firstName} ${a.client.lastName}` : a.readableId}
                          </div>
                          <div style={{ lineHeight: 1.1 }}>
                            {a.services?.map((s) => s.name).join(", ")}
                          </div>
                          <Tag color={STATUS_COLORS[a.status]} style={{ marginTop: 2 }}>
                            {STATUS_LABELS[a.status] ?? a.status}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Spin>
      )}
    </Card>
  );
};

export default SchedulePage;
