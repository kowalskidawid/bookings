export * from "./list";
export * from "./create";
export {default as AppointmentCreate} from "./create"
export * from "./edit";
export * from "./show";

export const STATUSES = ["BOOKED", "CONFIRMED", "FINISHED", "CANCELED", "NO_SHOW"] as const;

export const STATUS_LABELS: Record<string, string> = {
  BOOKED: "Zarezerwowana",
  CONFIRMED: "Potwierdzona",
  FINISHED: "Zakończona",
  CANCELED: "Anulowana",
  NO_SHOW: "Klient nieobecny",
};

export const STATUS_COLORS: Record<string, string> = {
  BOOKED: "blue",
  CONFIRMED: "green",
  FINISHED: "default",
  CANCELED: "red",
  NO_SHOW: "orange",
};

// Maszyna stanów wizyty (WF4) – dozwolone przejścia z danego statusu.
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  BOOKED: ["CONFIRMED", "FINISHED", "CANCELED", "NO_SHOW"],
  CONFIRMED: ["FINISHED", "CANCELED", "NO_SHOW"],
  FINISHED: [],
  CANCELED: [],
  NO_SHOW: [],
};
