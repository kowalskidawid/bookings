export * from "./list";
export * from "./create";
export {default as AppointmentCreate} from "./create"
export * from "./edit";
export * from "./show";

export const STATUSES = ["BOOKED", "CONFIRMED", "FINISHED", "CANCELED"] as const;

export const STATUS_LABELS: Record<string, string> = {
  BOOKED: "Zarezerwowana",
  CONFIRMED: "Potwierdzona",
  FINISHED: "Zakończona",
  CANCELED: "Anulowana",
};

export const STATUS_COLORS: Record<string, string> = {
  BOOKED: "blue",
  CONFIRMED: "green",
  FINISHED: "default",
  CANCELED: "red",
};
