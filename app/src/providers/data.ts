import { DataProvider, CrudFilters } from "@refinedev/core";
import { keycloak } from "./keycloak";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const toQueryString = (params: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  return sp.toString();
};

const filtersToParams = (filters?: CrudFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (!filters) return params;
  filters.forEach((f) => {
    if ("field" in f && f.value !== undefined && f.value !== null && f.value !== "") {
      params[f.field] = String(f.value);
    }
  });
  return params;
};

const getAuthHeader = async (): Promise<Record<string, string>> => {
  if (!keycloak.authenticated) return {};
  try {
    await keycloak.updateToken(30);
  } catch {
    keycloak.login();
    return {};
  }
  return keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {};
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    if (res.status === 401) {
      keycloak.login();
      return undefined;
    }
    const body = await res.text().catch(() => res.statusText);
    throw new Error(body || res.statusText);
  }
  if (res.status === 204) return undefined;
  return res.json();
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { currentPage: current = 1, pageSize = 20 } = pagination ?? {};

    const sortParams: Record<string, string> = {};
    if (sorters?.[0]) {
      sortParams["sort"] = `${sorters[0].field},${sorters[0].order === "desc" ? "desc" : "asc"}`;
    }

    const qs = toQueryString({
      page: current - 1,
      size: pageSize,
      ...filtersToParams(filters),
      ...sortParams,
    });

    const auth = await getAuthHeader();
    const data = await handleResponse(
      await fetch(`${API_URL}/api/${resource}?${qs}`, { headers: auth })
    );
    return {
      data: data?.content ?? data ?? [],
      total: data?.totalElements ?? (Array.isArray(data) ? data.length : 0),
    };
  },

  getOne: async ({ resource, id }) => {
    const auth = await getAuthHeader();
    const data = await handleResponse(
      await fetch(`${API_URL}/api/${resource}/${id}`, { headers: auth })
    );
    return { data };
  },

  create: async ({ resource, variables }) => {
    const auth = await getAuthHeader();
    const data = await handleResponse(
      await fetch(`${API_URL}/api/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(variables),
      })
    );
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const auth = await getAuthHeader();
    const data = await handleResponse(
      await fetch(`${API_URL}/api/${resource}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(variables),
      })
    );
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const auth = await getAuthHeader();
    await handleResponse(
      await fetch(`${API_URL}/api/${resource}/${id}`, { method: "DELETE", headers: auth })
    );
    return { data: { id } as any };
  },

  getMany: async ({ resource, ids }) => {
    const auth = await getAuthHeader();
    const data = await Promise.all(
      ids.map((id) =>
        fetch(`${API_URL}/api/${resource}/${id}`, { headers: auth }).then((r) => r.json())
      )
    );
    return { data };
  },

  getApiUrl: () => API_URL,
};
