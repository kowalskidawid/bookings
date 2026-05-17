import { Authenticated, CanAccess, Refine } from "@refinedev/core";
import { UserOutlined } from "@ant-design/icons";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
    ErrorComponent,
    ThemedLayout,
    ThemedSider,
    useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
    CatchAllNavigate,
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp, Result, Button } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components";
import { ColorModeContextProvider } from "./contexts/color-mode";

import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { authProvider } from "./providers/auth";
import { dataProvider } from "./providers/data";
import { accessControlProvider } from "./providers/accessControlProvider";

import { UserList } from "./pages/users/list.tsx";
import { UserShow } from "./pages/users/show.tsx";
import { ServiceList } from "./pages/services/list";
import { ServiceCreate } from "./pages/services/create";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <AntdApp>
                            <Refine
                                dataProvider={dataProvider}
                                notificationProvider={useNotificationProvider}
                                routerProvider={routerProvider}
                                authProvider={authProvider}
                                accessControlProvider={accessControlProvider}
                                resources={[
                                    {
                                        name: "users",
                                        list: "/users",
                                        show: "/users/show/:id",
                                        create: "/users/create",
                                        edit: "/users/edit/:id",
                                        meta: {
                                            canDelete: true,
                                            icon: <UserOutlined />
                                        }
                                    },
                                    {
                                        name: "services",
                                        list: "/services",
                                        create: "/services/create",
                                        edit: "/services/edit/:id",
                                        meta: {
                                            canDelete: true,
                                        }
                                    },
                                ]}
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
                                                    Sider={(props) => (
                                                        <ThemedSider
                                                            {...props}
                                                            fixed
                                                            Title={({ collapsed }) => (
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "10px",
                                                                    padding: "16px",
                                                                    justifyContent: collapsed ? "center" : "flex-start"
                                                                }}>
                                                                    <span style={{ fontSize: "20px" }}>📅</span>

                                                                    {!collapsed && (
                                                                        <span style={{ fontWeight: "700", fontSize: "16px", color: "inherit" }}> Bookings</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                >
                                                    <Outlet />
                                                </ThemedLayout>

                                            </Authenticated>
                                        }
                                    >
                                        <Route
                                            index
                                            element={<NavigateToResource resource="users" />}
                                        />
                                        <Route
                                            path="/users"
                                            element={
                                                <CanAccess
                                                    resource="users"
                                                    action="list"
                                                    fallback={
                                                        <Result
                                                            status="403"
                                                            title="403"
                                                            subTitle="You do not have permission to access this site"
                                                            extra={
                                                                <Button type="primary" href="/services">
                                                                    Go back
                                                                </Button>
                                                            }
                                                        />
                                                    }
                                                >
                                                    <Outlet />
                                                </CanAccess>
                                            }
                                        >
                                            <Route index element={<UserList/>} />
                                            <Route path="show/:id" element={<UserShow />} />
                                        </Route>

                                        <Route path="/services">
                                            <Route index element={<ServiceList/>} />
                                            <Route path="create" element={<ServiceCreate />} />
                                            <Route path="edit/:id" element={/*wstawić tu ServiceEdit*/""} />
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
                                        <Route
                                            path="/forgot-password"
                                            element={<ForgotPassword />}
                                        />
                                    </Route>
                                </Routes>

                                <RefineKbar />
                                <UnsavedChangesNotifier />
                                <DocumentTitleHandler />
                            </Refine>
                    </AntdApp>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;