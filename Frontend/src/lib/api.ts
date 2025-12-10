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
  clearTimeout(timeout);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Error ${res.status}`);
  }
  return res.json();
}

// ==================== CHILDREN ====================

export interface Child {
  id: string;
  fullName: string;
  document: string;
  age: number;
  birthDate: string;
  tutorName: string;
  imageUrl?: string;
  qrCode?: string; // Base64 QR generado automáticamente
  createdAt: string;
  updatedAt: string;
}

export async function createChild(data: {
  fullName: string;
  document: string;
  age: number;
  birthDate: string;
  tutorName: string;
  imageUrl?: string;
}) {
  return request<Child>(`/children`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getChildren() {
  return request<Child[]>(`/children`, {
    method: "GET",
  });
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
    document?: string;
    age?: number;
    birthDate?: string;
    tutorName?: string;
    imageUrl?: string;
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

export async function getEvents() {
  return request<Event[]>(`/events`, {
    method: "GET",
  });
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
  registeredAt: string;
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
