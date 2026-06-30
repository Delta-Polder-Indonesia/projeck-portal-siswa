import {
  adminLogin,
  adminLogout,
  deletePPDBApplication,
  exportPPDBBackupJson,
  getAdminProfileName,
  getPPDBApplicationById,
  getPPDBApplicationByRegNo,
  getPPDBApplications,
  getPPDBAuditLogs,
  getPPDBStatistics,
  importPPDBBackupJson,
  isAdminAuthenticated,
  submitPPDBApplication,
  updateApplicationStatus,
  updateDocumentValidation,
  getPPDBNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  getAdminSettings,
  updateAdminSettings,
  type PPDBApplication,
  type PPDBAuditLog,
} from '../data/store';

type JsonMap = Record<string, unknown>;
type AuthTokens = { accessToken: string; refreshToken: string };

export type PPDBStatistics = ReturnType<typeof getPPDBStatistics>;
export type ApiHealth = {
  mode: 'local' | 'api';
  online: boolean;
  apiReachable: boolean;
  message: string;
  checkedAt: string;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim();
const ACCESS_TOKEN_KEY = 'ppdb_api_access_token';
const REFRESH_TOKEN_KEY = 'ppdb_api_refresh_token';
const ADMIN_NAME_KEY = 'ppdb_api_admin_name';

const hasApi = Boolean(API_BASE);

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || '';
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) || '';

const saveTokens = (tokens: Partial<AuthTokens>) => {
  if (tokens.accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_NAME_KEY);
};

const buildHeaders = (init?: RequestInit, useJson = true): HeadersInit => {
  const headers: Record<string, string> = {
    ...(useJson ? { 'Content-Type': 'application/json' } : {}),
    ...((init?.headers as Record<string, string>) || {}),
  };

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const tryRefreshToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !hasApi) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/admin/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const payload = (await response.json()) as { accessToken?: string; refreshToken?: string };
    saveTokens({ accessToken: payload.accessToken || '', refreshToken: payload.refreshToken || refreshToken });
    return true;
  } catch {
    return false;
  }
};

const request = async <T>(path: string, init?: RequestInit, isRetry = false): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: buildHeaders(init, init?.body ? !(init.body instanceof FormData) : true),
  });

  if (response.status === 401 && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(path, init, true);
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  if (response.status === 204) return {} as T;
  return (await response.json()) as T;
};

const apiLogin = async (username: string, pin: string): Promise<boolean> => {
  try {
    const payload = await request<{ accessToken: string; refreshToken: string; profileName?: string }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, pin }),
      headers: { 'Content-Type': 'application/json' },
    });
    saveTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
    localStorage.setItem(ADMIN_NAME_KEY, payload.profileName || username);
    return true;
  } catch {
    return false;
  }
};

export const ppdbService = {
  async submitApplication(data: Omit<PPDBApplication, 'id' | 'registrationNo' | 'submittedAt' | 'status'>) {
    if (hasApi) {
      return request<PPDBApplication>('/ppdb/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    return submitPPDBApplication(data);
  },

  async getApplications() {
    if (hasApi) return request<PPDBApplication[]>('/ppdb/applications');
    return getPPDBApplications();
  },

  async getStatistics() {
    if (hasApi) return request<PPDBStatistics>('/ppdb/statistics');
    return getPPDBStatistics();
  },

  async getApplicationById(id: string) {
    if (hasApi) return request<PPDBApplication>(`/ppdb/applications/${id}`);
    return getPPDBApplicationById(id);
  },

  async getApplicationByRegNo(regNo: string) {
    if (hasApi) return request<PPDBApplication | null>(`/ppdb/applications/registration/${encodeURIComponent(regNo)}`);
    return getPPDBApplicationByRegNo(regNo);
  },

  async updateStatus(id: string, status: PPDBApplication['status'], adminNotes?: string, verifiedBy?: string) {
    if (hasApi) {
      return request<PPDBApplication>(`/ppdb/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes, verifiedBy }),
      });
    }
    return updateApplicationStatus(id, status, adminNotes, verifiedBy);
  },

  async updateDocumentStatus(id: string, documentKey: string, status: 'PENDING' | 'VALID' | 'INVALID') {
    if (hasApi) {
      return request<PPDBApplication>(`/ppdb/applications/${id}/documents/${encodeURIComponent(documentKey)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    }
    return updateDocumentValidation(id, documentKey, status);
  },

  async deleteApplication(id: string) {
    if (hasApi) {
      await request<JsonMap>(`/ppdb/applications/${id}`, { method: 'DELETE' });
      return true;
    }
    return deletePPDBApplication(id);
  },

  async getAuditLogs() {
    if (hasApi) return request<PPDBAuditLog[]>('/ppdb/audit-logs');
    return getPPDBAuditLogs();
  },

  async exportBackupJson() {
    if (hasApi) {
      const data = await request<JsonMap>('/ppdb/backup/export');
      return JSON.stringify(data, null, 2);
    }
    return exportPPDBBackupJson();
  },

  async importBackupJson(rawJson: string) {
    if (hasApi) {
      return request<{ ok: boolean; message: string }>('/ppdb/backup/import', {
        method: 'POST',
        body: JSON.stringify({ payload: rawJson }),
      });
    }
    return importPPDBBackupJson(rawJson);
  },

  async getApiHealth(): Promise<ApiHealth> {
    const checkedAt = new Date().toISOString();
    if (!hasApi) {
      return {
        mode: 'local',
        online: navigator.onLine,
        apiReachable: true,
        message: 'Mode lokal aktif (tanpa backend API).',
        checkedAt,
      };
    }

    if (!navigator.onLine) {
      return {
        mode: 'api',
        online: false,
        apiReachable: false,
        message: 'Perangkat sedang offline.',
        checkedAt,
      };
    }

    try {
      await request<{ status: string }>('/health', { method: 'GET' });
      return {
        mode: 'api',
        online: true,
        apiReachable: true,
        message: 'Backend API terhubung.',
        checkedAt,
      };
    } catch {
      return {
        mode: 'api',
        online: true,
        apiReachable: false,
        message: 'Backend API tidak merespons.',
        checkedAt,
      };
    }
  },

  adminLogin: (username: string, pin: string) => {
    if (hasApi) {
      return apiLogin(username, pin);
    }
    return Promise.resolve(adminLogin(username, pin));
  },

  adminLogout: () => {
    if (hasApi) {
      clearTokens();
      return Promise.resolve();
    }
    adminLogout();
    return Promise.resolve();
  },

  isAdminAuthenticated: () => {
    if (hasApi) return Boolean(getAccessToken());
    return isAdminAuthenticated();
  },

  getAdminProfileName: () => {
    if (hasApi) return localStorage.getItem(ADMIN_NAME_KEY) || 'Admin API';
    return getAdminProfileName();
  },

  getNotifications: () => {
    return Promise.resolve(getPPDBNotifications());
  },

  markNotificationAsRead: (id: string) => {
    markNotificationAsRead(id);
    return Promise.resolve();
  },

  getUnreadCount: () => {
    return Promise.resolve(getUnreadNotificationCount());
  },

  getAdminSettings: () => {
    return Promise.resolve(getAdminSettings());
  },

  updateAdminSettings: (settings: { email: string }) => {
    updateAdminSettings(settings);
    return Promise.resolve();
  },
};
