import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Result,
  Row,
  Space,
  Spin,
  Steps,
  Tag,
  Typography,
} from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface ServiceDto {
  id: number;
  name: string;
  timeInMinutes: number;
}

interface AvailabilityDto {
  id: number;
  dayOfWeek: string;
}

interface EmployerDto {
  id: number;
  firstName: string;
  lastName: string;
  availabilities: AvailabilityDto[];
}

interface TimeSlot {
  startAt: string;
  endAt: string;
}

interface BookingResult {
  readableId: string;
}

const DAY_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const STEPS = [
  { title: "Usługa" },
  { title: "Pracownik" },
  { title: "Termin" },
  { title: "Twoje dane" },
];

export const BookingPage = () => {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [employers, setEmployers] = useState<EmployerDto[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/public/services`)
      .then((r) => r.json())
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const handleServiceSelect = (service: ServiceDto) => {
    setSelectedService(service);
    setSelectedEmployer(null);
    setLoading(true);
    fetch(`${API_URL}/api/public/employers?serviceId=${service.id}`)
      .then((r) => r.json())
      .then(setEmployers)
      .finally(() => setLoading(false));
    setStep(1);
  };

  const handleEmployerSelect = (employer: EmployerDto) => {
    setSelectedEmployer(employer);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setStep(2);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    if (!date || !selectedEmployer || !selectedService) return;
    setSlotsLoading(true);
    fetch(
      `${API_URL}/api/public/slots?employerId=${selectedEmployer.id}&serviceId=${selectedService.id}&date=${date.format("YYYY-MM-DD")}`
    )
      .then((r) => r.json())
      .then(setSlots)
      .finally(() => setSlotsLoading(false));
  };

  const handleSubmit = async (values: { firstName: string; lastName: string; email: string; phoneNumber?: string }) => {
    if (!selectedService || !selectedEmployer || !selectedSlot) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/public/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          employerId: selectedEmployer.id,
          serviceId: selectedService.id,
          startAt: selectedSlot.startAt,
        }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "Błąd rezerwacji");
        throw new Error(msg);
      }
      const data: BookingResult = await res.json();
      setResult(data);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(0);
    setSelectedService(null);
    setSelectedEmployer(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setResult(null);
    form.resetFields();
  };

  const availableDays = selectedEmployer
    ? new Set(selectedEmployer.availabilities.map((a) => DAY_MAP[a.dayOfWeek]))
    : new Set<number>();

  const disabledDate = (current: dayjs.Dayjs) => {
    if (current.isBefore(dayjs().startOf("day"))) return true;
    if (!selectedEmployer) return true;
    return !availableDays.has(current.day());
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 820 }}>
        <Typography.Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
          Umów wizytę
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: "center", marginBottom: 32 }}>
          Wybierz usługę, pracownika i termin — zajmie to chwilę.
        </Typography.Paragraph>

        {step < 4 && (
          <Card style={{ marginBottom: 24 }}>
            <Steps current={step} items={STEPS} />
          </Card>
        )}

        <Card>
          <Spin spinning={loading}>
            {/* Step 0 – Usługa */}
            {step === 0 && (
              <>
                <Typography.Title level={4} style={{ marginTop: 0 }}>
                  Wybierz usługę
                </Typography.Title>
                {services.length === 0 && !loading && (
                  <Typography.Text type="secondary">Brak dostępnych usług.</Typography.Text>
                )}
                <Row gutter={[16, 16]}>
                  {services.map((s) => (
                    <Col key={s.id} xs={24} sm={12} md={8}>
                      <Card
                        hoverable
                        onClick={() => handleServiceSelect(s)}
                        style={{
                          cursor: "pointer",
                          border: selectedService?.id === s.id ? "2px solid #1677ff" : undefined,
                        }}
                      >
                        <Typography.Text strong>{s.name}</Typography.Text>
                        <div style={{ marginTop: 8 }}>
                          <Tag icon={<ClockCircleOutlined />} color="blue">
                            {s.timeInMinutes} min
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* Step 1 – Pracownik */}
            {step === 1 && (
              <>
                <Typography.Title level={4} style={{ marginTop: 0 }}>
                  Wybierz pracownika
                </Typography.Title>
                {employers.length === 0 && !loading && (
                  <Typography.Text type="secondary">
                    Brak pracowników dla wybranej usługi.
                  </Typography.Text>
                )}
                <Row gutter={[16, 16]}>
                  {employers.map((e) => (
                    <Col key={e.id} xs={24} sm={12} md={8}>
                      <Card
                        hoverable
                        onClick={() => handleEmployerSelect(e)}
                        style={{ cursor: "pointer" }}
                      >
                        <Space>
                          <UserOutlined style={{ fontSize: 24, color: "#1677ff" }} />
                          <Typography.Text strong>
                            {e.firstName} {e.lastName}
                          </Typography.Text>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <div style={{ marginTop: 20 }}>
                  <Button onClick={() => setStep(0)}>Wstecz</Button>
                </div>
              </>
            )}

            {/* Step 2 – Data i godzina */}
            {step === 2 && (
              <>
                <Typography.Title level={4} style={{ marginTop: 0 }}>
                  Wybierz datę i godzinę
                </Typography.Title>
                <Row gutter={[32, 16]}>
                  <Col xs={24} md={10}>
                    <DatePicker
                      style={{ width: "100%" }}
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      value={selectedDate}
                      format="DD.MM.YYYY"
                      placeholder="Wybierz datę"
                    />
                  </Col>
                  <Col xs={24} md={14}>
                    {selectedDate ? (
                      <Spin spinning={slotsLoading}>
                        {!slotsLoading && slots.length === 0 ? (
                          <Typography.Text type="secondary">
                            Brak wolnych terminów w tym dniu.
                          </Typography.Text>
                        ) : (
                          <Space wrap>
                            {slots.map((slot) => (
                              <Button
                                key={slot.startAt}
                                type={selectedSlot?.startAt === slot.startAt ? "primary" : "default"}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                {dayjs(slot.startAt).format("HH:mm")}
                              </Button>
                            ))}
                          </Space>
                        )}
                      </Spin>
                    ) : (
                      <Typography.Text type="secondary">
                        Wybierz datę, aby zobaczyć dostępne godziny.
                      </Typography.Text>
                    )}
                  </Col>
                </Row>
                <Space style={{ marginTop: 24 }}>
                  <Button onClick={() => setStep(1)}>Wstecz</Button>
                  <Button
                    type="primary"
                    disabled={!selectedSlot}
                    onClick={() => setStep(3)}
                  >
                    Dalej
                  </Button>
                </Space>
              </>
            )}

            {/* Step 3 – Dane klienta */}
            {step === 3 && (
              <>
                <Typography.Title level={4} style={{ marginTop: 0 }}>
                  Twoje dane
                </Typography.Title>

                <div
                  style={{
                    background: "#f5f5f5",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 24,
                  }}
                >
                  <Typography.Text strong>Podsumowanie</Typography.Text>
                  <div style={{ marginTop: 8 }}>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Typography.Text type="secondary">Usługa</Typography.Text>
                      </Col>
                      <Col span={16}>{selectedService?.name}</Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Typography.Text type="secondary">Pracownik</Typography.Text>
                      </Col>
                      <Col span={16}>
                        {selectedEmployer?.firstName} {selectedEmployer?.lastName}
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={8}>
                        <Typography.Text type="secondary">Termin</Typography.Text>
                      </Col>
                      <Col span={16}>
                        {dayjs(selectedSlot?.startAt).format("DD.MM.YYYY HH:mm")} –{" "}
                        {dayjs(selectedSlot?.endAt).format("HH:mm")}
                      </Col>
                    </Row>
                  </div>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  style={{ maxWidth: 480 }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label="Imię"
                        rules={[{ required: true, message: "Podaj imię" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label="Nazwisko"
                        rules={[{ required: true, message: "Podaj nazwisko" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Podaj email" },
                      { type: "email", message: "Nieprawidłowy adres email" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="phoneNumber" label="Telefon">
                    <Input />
                  </Form.Item>

                  <Space>
                    <Button onClick={() => setStep(2)}>Wstecz</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Zarezerwuj
                    </Button>
                  </Space>
                </Form>
              </>
            )}

            {/* Step 4 – Potwierdzenie */}
            {step === 4 && (
              <Result
                status="success"
                title="Wizyta zarezerwowana!"
                subTitle={`Numer rezerwacji: ${result?.readableId}`}
                extra={[
                  <Button key="new" type="primary" onClick={resetAll}>
                    Umów kolejną wizytę
                  </Button>,
                ]}
              />
            )}
          </Spin>
        </Card>
      </div>
    </div>
  );
};
