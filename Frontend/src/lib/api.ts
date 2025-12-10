import { API_BASE_URL, API_TIMEOUT_MS } from "./config";
const BASE_URL = API_BASE_URL;
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const res = await fetch(`${BASE_URL}${path}`, {
    ...(options || {}),
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    signal: controller.signal,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Error ${res.status}`);
  }
  clearTimeout(timeout);
  return res.json();
}

export async function createChild(data: {
  firstName: string;
  lastName: string;
  birthDate?: string;
  tutorName?: string;
  contactPhone?: string;
  notes?: string;
  qr: string;
}) {
  return request<{ message?: string }>(`/children`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createEvent(data: { key: string; name: string }) {
  return request<{ message?: string }>(`/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getChildren() {
  return request<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      birthDate?: string;
      tutorName?: string;
      contactPhone?: string;
      qr: string;
    }>
  >(`/children`, {
    method: "GET",
  });
}

export async function deleteChild(id: string) {
  return request<{ message?: string }>(`/children/${id}`, {
    method: "DELETE",
  });
}

export async function getEvents() {
  return request<
    Array<{
      id: string;
      key: string;
      name: string;
      dateTime?: string;
      location?: string;
      description?: string;
    }>
  >(`/events`, {
    method: "GET",
  });
}

export async function deleteEvent(id: string) {
  return request<{ message?: string }>(`/events/${id}`, {
    method: "DELETE",
  });
}

export async function checkInAttendance(data: {
  eventKey: string;
  childQr: string;
}) {
  return request<{ message?: string }>(`/attendance/check-in`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
