import { I18nProvider } from "@refinedev/core";

const translations: Record<string, any> = {
  actions: {
    list: "Lista",
    create: "Utwórz",
    edit: "Edytuj",
    show: "Podgląd",
    clone: "Klonuj",
  },
  buttons: {
    create: "Utwórz",
    save: "Zapisz",
    logout: "Wyloguj",
    delete: "Usuń",
    edit: "Edytuj",
    cancel: "Anuluj",
    confirm: "Czy jesteś pewny?",
    filter: "Filtruj",
    clear: "Wyczyść",
    refresh: "Odśwież",
    show: "Pokaż",
    undo: "Cofnij",
    import: "Importuj",
    clone: "Klonuj",
    notAccessTitle: "Brak uprawnień!",
  },
  warnWhenUnsavedChanges: "Czy na pewno chcesz wyjść? Masz niezapisane zmiany.",
  notifications: {
    success: "Sukces",
    error: "Błąd {{statusCode}}",
    undoable: "Masz {{seconds}} sekund na cofnięcie",
    createSuccess: "Pomyślnie utworzono {{resource}}",
    createError: "Błąd podczas tworzenia {{resource}}",
    deleteSuccess: "Pomyślnie usunięto {{resource}}",
    deleteError: "Błąd podczas usuwania {{resource}}",
    editSuccess: "Pomyślnie zapisano {{resource}}",
    editError: "Błąd podczas edycji {{resource}}",
    importProgress: "Importowanie: {{processed}}/{{total}}",
  },
  loading: "Ładowanie",
  tags: {
    clone: "Klonuj",
  },
  table: {
    actions: "Akcje",
  },
  pages: {
    login: {
      title: "Zaloguj się",
      signin: "Zaloguj",
      signup: "Zarejestruj się",
      divider: "lub",
      fields: { email: "Email", password: "Hasło" },
      errors: {
        validEmail: "Nieprawidłowy adres email",
        requiredEmail: "Email jest wymagany",
        requiredPassword: "Hasło jest wymagane",
      },
      buttons: {
        submit: "Zaloguj",
        forgotPassword: "Zapomniałeś hasła?",
        noAccount: "Nie masz konta?",
        rememberMe: "Zapamiętaj mnie",
      },
    },
    error: {
      info: "Możliwe, że brakuje komponentu {{action}} dla zasobu {{resource}}.",
      404: "Przepraszamy, strona nie istnieje.",
      resource404: "Czy jesteś pewny, że zasób {{resource}} istnieje?",
      backHome: "Wróć do strony głównej",
    },
  },
  services: {
    titles: {
      list: "Usługi",
      create: "Utwórz usługę",
      edit: "Edytuj usługę",
      show: "Podgląd usługi",
    },
  },
  availabilities: {
    titles: {
      list: "Dostępności",
      create: "Utwórz dostępność",
      edit: "Edytuj dostępność",
      show: "Podgląd dostępności",
    },
  },
  users: {
    titles: {
      list: "Użytkownicy",
      create: "Utwórz użytkownika",
      edit: "Edytuj użytkownika",
      show: "Podgląd użytkownika",
    },
  },
  employers: {
    titles: {
      list: "Pracownicy",
      create: "Utwórz pracownika",
      edit: "Edytuj pracownika",
      show: "Podgląd pracownika",
    },
  },
  appointments: {
    titles: {
      list: "Wizyty",
      create: "Utwórz wizytę",
      edit: "Edytuj wizytę",
      show: "Podgląd wizyty",
    },
  },
  documentTitle: {
    default: "Booking",
    suffix: " | Booking",
    services: {
      list: "Usługi | Booking",
      create: "Utwórz usługę | Booking",
      edit: "#{{id}} Edytuj usługę | Booking",
      show: "#{{id}} Podgląd usługi | Booking",
    },
    availabilities: {
      list: "Dostępności | Booking",
      create: "Utwórz dostępność | Booking",
      edit: "#{{id}} Edytuj dostępność | Booking",
      show: "#{{id}} Podgląd dostępności | Booking",
    },
    users: {
      list: "Użytkownicy | Booking",
      create: "Utwórz użytkownika | Booking",
      edit: "#{{id}} Edytuj użytkownika | Booking",
      show: "#{{id}} Podgląd użytkownika | Booking",
    },
    employers: {
      list: "Pracownicy | Booking",
      create: "Utwórz pracownika | Booking",
      edit: "#{{id}} Edytuj pracownika | Booking",
      show: "#{{id}} Podgląd pracownika | Booking",
    },
    appointments: {
      list: "Wizyty | Booking",
      create: "Utwórz wizytę | Booking",
      edit: "#{{id}} Edytuj wizytę | Booking",
      show: "#{{id}} Podgląd wizyty | Booking",
    },
  },
};

function get(obj: Record<string, any>, key: string): unknown {
  return key.split(".").reduce((o, k) => (o != null && typeof o === "object" ? o[k] : undefined), obj);
}

function interpolate(str: string, params: Record<string, unknown>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k] ?? ""));
}

export const i18nProvider: I18nProvider = {
  translate: (key: string, options?: object | string, defaultMessage?: string): string => {
    const value = get(translations, key);
    const fallback = typeof options === "string" ? options : (defaultMessage ?? key);
    if (typeof value !== "string") return fallback;
    return options && typeof options === "object"
      ? interpolate(value, options as Record<string, unknown>)
      : value;
  },
  changeLocale: async () => {},
  getLocale: () => "pl",
};
