import { Create, useForm, useSelect } from "@refinedev/antd";
import { DatePicker, Form, Select } from "antd";
import dayjs from "dayjs";

// Definicje modeli na podstawie backendu Javy
interface IAvailability {
  id: number;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

interface IEmployer {
  id: number;
  firstName: string;
  lastName: string;
  availabilities: IAvailability[];
}

interface IService {
  id: number;
  name: string;
  timeInMinutes: number;
}

const AppointmentCreate = () => {
  const { formProps, saveButtonProps, onFinish, form } = useForm();

  const { selectProps: clientSelectProps } = useSelect({
    resource: "users",
    optionLabel: (item: any) => `${item.firstName} ${item.lastName} (${item.email})`,
    optionValue: (item) => item.id,
  });

  const { selectProps: employerSelectProps, query: employersQuery } = useSelect<IEmployer>({
    resource: "employers",
    optionLabel: (item: IEmployer) => `${item.firstName} ${item.lastName}`,
    optionValue: "id",
  });

  const employersList = employersQuery?.data?.data || [];

  const { selectProps: serviceSelectProps, query: servicesQuery } = useSelect<IService>({
    resource: "services",
    optionLabel: "name",
    optionValue: "id",
  });

  const servicesList = servicesQuery?.data?.data || [];

  const validateWorkingHours = async (rule: any) => {
    const startAt = form.getFieldValue("startAt");
    const endAt = form.getFieldValue("endAt");
    const employerId = form.getFieldValue("employerId");

    if (!startAt || !endAt || !employerId) return Promise.resolve();

    const employer = employersList.find((e: IEmployer) => e.id === employerId);

    if (!employer || !employer.availabilities || employer.availabilities.length === 0) {
      return Promise.reject(new Error("Ten pracownik nie ma ustawionych godzin pracy w systemie."));
    }

    const startDayjs = dayjs(startAt);
    const endDayjs = dayjs(endAt);

    const javaDaysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const targetDayName = javaDaysOfWeek[startDayjs.day()];

    const todayAvailability = employer.availabilities.find(
        (a) => a.dayOfWeek.toUpperCase() === targetDayName
    );

    if (!todayAvailability) {
      return Promise.reject(new Error(`Pracownik nie pracuje w tym dniu tygodnia.`));
    }

    const startDayDate = startDayjs.format("YYYY-MM-DD");

    const workStartBound = dayjs(`${startDayDate}T${todayAvailability.startAt}`);
    const workEndBound = dayjs(`${startDayDate}T${todayAvailability.endAt}`);

    const formattedStart = workStartBound.format("HH:mm");
    const formattedEnd = workEndBound.format("HH:mm");

    if (rule.field === "startAt") {
      if (startDayjs.isBefore(workStartBound) || startDayjs.isAfter(workEndBound)) {
        return Promise.reject(
            new Error(`Rozpoczęcie wizyty poza godzinami pracy pracownika (${formattedStart} - ${formattedEnd})`)
        );
      }
    }

    if (rule.field === "endAt") {
      if (endDayjs.isBefore(workStartBound) || endDayjs.isAfter(workEndBound)) {
        return Promise.reject(
            new Error(`Zakończenie wizyty poza godzinami pracy pracownika (${formattedStart} - ${formattedEnd})`)
        );
      }
    }

    return Promise.resolve();
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.startAt || changedValues.serviceIds || changedValues.employerId) {
      const startTime = allValues.startAt;
      const selectedServices = allValues.serviceIds;

      if (startTime && selectedServices && servicesList.length > 0) {
        const idsArray = Array.isArray(selectedServices) ? selectedServices : [selectedServices];

        const totalDuration = idsArray.reduce((total: number, id: any) => {
          const service = servicesList.find((s: IService) => s.id === id);
          return total + (service?.timeInMinutes || 0);
        }, 0);

        if (totalDuration > 0) {
          const newEndTime = dayjs(startTime).add(totalDuration, "minute");
          form.setFieldsValue({ endAt: newEndTime });
        }
      }
      setTimeout(() => form.validateFields(["startAt", "endAt"]), 50);
    }
  };

  return (
      <Create saveButtonProps={saveButtonProps}>
        <Form
            {...formProps}
            form={form}
            onValuesChange={handleValuesChange}
            onFinish={(values: any) => onFinish({
              ...values,
              startAt: values.startAt ? dayjs(values.startAt).format("YYYY-MM-DDTHH:mm:ss") : undefined,
              endAt: values.endAt ? dayjs(values.endAt).format("YYYY-MM-DDTHH:mm:ss") : undefined,
            })}
            layout="vertical"
        >
          <Form.Item name="clientId" label="Klient" rules={[{ required: true }]}>
            <Select {...clientSelectProps} placeholder="Wybierz klienta" showSearch />
          </Form.Item>

          <Form.Item name="employerId" label="Pracownik" rules={[{ required: true }]}>
            <Select {...employerSelectProps} placeholder="Wybierz pracownika" showSearch />
          </Form.Item>

          <Form.Item name="serviceIds" label="Usługi">
            <Select mode="multiple" {...serviceSelectProps} placeholder="Wybierz usługi" />
          </Form.Item>

          <Form.Item
              name="startAt"
              label="Rozpoczęcie"
              rules={[{ required: true }, { validator: validateWorkingHours }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
              name="endAt"
              label="Zakończenie"
              rules={[{ required: true }, { validator: validateWorkingHours }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Create>
  );
};

export default AppointmentCreate;