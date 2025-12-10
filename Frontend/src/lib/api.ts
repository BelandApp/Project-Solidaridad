import { API_BASE_URL, API_TIMEOUT_MS } from "./config";

const BASE_URL = API_BASE_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const url = `${BASE_URL}${path}`;
  console.log("🌐 API Request:", url, options?.method || "GET");

  const res = await fetch(url, {
    ...(options || {}),
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    signal: controller.signal,
  });
  clearTimeout(timeout);

  console.log("📥 API Response:", res.status, res.statusText);

  if (!res.ok) {
    const msg = await res.text();
    console.error("❌ API Error:", msg);
    throw new Error(msg || `Error ${res.status}`);
  }

  // Si la respuesta está vacía (típico en DELETE), retornar objeto vacío
  const text = await res.text();
  if (!text || text.trim() === "") {
    console.log("✅ API Data: (empty response)");
    return {} as T;
  }

  const data = JSON.parse(text);
  console.log("✅ API Data:", data);
  return data;
}

// ==================== CHILDREN ====================

export interface Child {
  id: string;
  fullName: string;
  age: number;
  sex: "Niño" | "Niña";
  qrCode?: string; // Base64 QR generado automáticamente
}

export async function createChild(data: {
  fullName: string;
  age: number;
  sex: "Niño" | "Niña";
}) {
  return request<Child>(`/children`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getChildren(page: number = 1, limit: number = 50) {
  const response = await request<{
    data: Child[];
    total: number;
    page: number;
    limit: number;
  }>(`/children?page=${page}&limit=${limit}`, {
    method: "GET",
  });
  return response.data.reverse();
}

export async function getChild(id: string) {
  return request<Child>(`/children/${id}`, {
    method: "GET",
  });
}

export async function updateChild(
  id: string,
  data: {
    fullName?: string;
    age?: number;
    sex?: "Niño" | "Niña";
  }
) {
  return request<Child>(`/children/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteChild(id: string) {
  return request<{ message?: string }>(`/children/${id}`, {
    method: "DELETE",
  });
}

export async function uploadChildrenCSV(file: File): Promise<Child[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const formData = new FormData();
  formData.append("file", file);

  const url = `${BASE_URL}/children/upload-csv`;
  console.log("📤 Uploading CSV:", file.name);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    signal: controller.signal,
  });
  clearTimeout(timeout);

  console.log("📥 Upload Response:", res.status, res.statusText);

  if (!res.ok) {
    const msg = await res.text();
    console.error("❌ Upload Error:", msg);
    throw new Error(msg || `Error ${res.status}`);
  }

  const data = await res.json();
  console.log("✅ Upload Success:", data.length, "children created");
  return data;
}

// ==================== EVENTS ====================

export interface Event {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createEvent(data: {
  name: string;
  description: string;
  imageUrl?: string;
}) {
  return request<Event>(`/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getEvents(page: number = 1, limit: number = 50) {
  const response = await request<{
    data: Event[];
    total: number;
    page: number;
    limit: number;
  }>(`/events?page=${page}&limit=${limit}`, {
    method: "GET",
  });
  console.log("📦 Events response:", response);
  return response.data.reverse();
}

export async function getEvent(id: string) {
  return request<Event>(`/events/${id}`, {
    method: "GET",
  });
}

export async function updateEvent(
  id: string,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
  }
) {
  return request<Event>(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: string) {
  return request<{ message?: string }>(`/events/${id}`, {
    method: "DELETE",
  });
}

// ==================== PARTICIPATIONS ====================

export interface Participation {
  id: string;
  childId: string;
  eventId: string;
  timestamp: string;
  child?: Child;
  event?: Event;
}

export async function createParticipation(data: {
  childId: string;
  eventId: string;
}) {
  return request<Participation>(`/participations`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerByQr(data: {
  qrContent: string;
  eventId: string;
}) {
  return request<Participation>(`/participations/register-by-qr`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getParticipationsByChild(childId: string) {
  return request<Participation[]>(`/participations/by-child/${childId}`, {
    method: "GET",
  });
}

export async function getParticipationsByEvent(eventId: string) {
  return request<Participation[]>(`/participations/by-event/${eventId}`, {
    method: "GET",
  });
}
