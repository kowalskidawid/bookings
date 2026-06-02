import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayout,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import {
  AppstoreOutlined,
  CalendarOutlined,
  TeamOutlined,
  IdcardOutlined,
  ScheduleOutlined
} from "@ant-design/icons";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider } from "antd";
import plPL from "antd/locale/pl_PL";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header, Title } from "./components";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { AppointmentCreate, AppointmentEdit, AppointmentList, AppointmentShow } from "./pages/appointments";
import { AvailabilityCreate, AvailabilityEdit, AvailabilityList, AvailabilityShow } from "./pages/availabilities";
import { BookingPage } from "./pages/book";
import { EmployerCreate, EmployerEdit, EmployerList, EmployerShow } from "./pages/employers";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ServiceCreate, ServiceEdit, ServiceList, ServiceShow } from "./pages/services";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users";
import { authProvider } from "./providers/auth";
import { dataProvider } from "./providers/data";
import { i18nProvider } from "./providers/i18n";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <ConfigProvider locale={plPL}>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                i18nProvider={i18nProvider}
                resources={[
                  {
                    name: "services",
                    list: "/services",
                    create: "/services/create",
                    edit: "/services/edit/:id",
                    show: "/services/show/:id",
                    meta: { canDelete: true, label: "Usługi", icon: <AppstoreOutlined /> },

                  },
                  {
                    name: "availabilities",
                    list: "/availabilities",
                    create: "/availabilities/create",
                    edit: "/availabilities/edit/:id",
                    show: "/availabilities/show/:id",
                    meta: { canDelete: true, label: "Dostępności", icon: <CalendarOutlined /> },
                  },
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: { canDelete: true, label: "Użytkownicy", icon: <TeamOutlined /> },
                  },
                  {
                    name: "employers",
                    list: "/employers",
                    create: "/employers/create",
                    edit: "/employers/edit/:id",
                    show: "/employers/show/:id",
                    meta: { canDelete: true, label: "Pracownicy", icon: <IdcardOutlined /> },
                  },
                  {
                    name: "appointments",
                    list: "/appointments",
                    create: "/appointments/create",
                    edit: "/appointments/edit/:id",
                    show: "/appointments/show/:id",
                    meta: { canDelete: true, label: "Wizyty", icon: <ScheduleOutlined />},
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "3no8ez-EHP4dj-4xpLWp",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={Header}
                          Title={Title}
                          Sider={(props) => <ThemedSider {...props} Title={Title} fixed />}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<NavigateToResource resource="appointments" />} />

                    <Route path="/services">
                      <Route index element={<ServiceList />} />
                      <Route path="create" element={<ServiceCreate />} />
                      <Route path="edit/:id" element={<ServiceEdit />} />
                      <Route path="show/:id" element={<ServiceShow />} />
                    </Route>

                    <Route path="/availabilities">
                      <Route index element={<AvailabilityList />} />
                      <Route path="create" element={<AvailabilityCreate />} />
                      <Route path="edit/:id" element={<AvailabilityEdit />} />
                      <Route path="show/:id" element={<AvailabilityShow />} />
                    </Route>

                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>

                    <Route path="/employers">
                      <Route index element={<EmployerList />} />
                      <Route path="create" element={<EmployerCreate />} />
                      <Route path="edit/:id" element={<EmployerEdit />} />
                      <Route path="show/:id" element={<EmployerShow />} />
                    </Route>

                    <Route path="/appointments">
                      <Route index element={<AppointmentList />} />
                      <Route path="create" element={<AppointmentCreate />} />
                      <Route path="edit/:id" element={<AppointmentEdit />} />
                      <Route path="show/:id" element={<AppointmentShow />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                  </Route>

                  <Route path="/book" element={<BookingPage />} />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler
                  handler={({ resource, action, params }) => {
                    const base = "Booking";
                    const label = resource?.meta?.label ?? resource?.name;
                    if (!label) return base;
                    const actionLabels: Record<string, string> = {
                      list: label,
                      create: `Nowy wpis - ${label}`,
                      edit: `Edycja #${params?.id ?? ""} - ${label}`,
                      show: `Szczegóły #${params?.id ?? ""} - ${label}`,
                      clone: `Kopiowanie #${params?.id ?? ""} - ${label}`,
                    };
                    const prefix = action ? actionLabels[action] ?? label : label;
                    return `${prefix} | ${base}`;
                  }}
                />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
          </ConfigProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
