const BASE_URL = process.env.REACT_APP_API_URL || "/api";

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  date: string;
  capacity: number;
  spots_left?: number;
  created_at: string;
  registrations: Registration[];
}

export interface Registration {
  id: number;
  event_id: number;
  name: string;
  email: string;
  registered_at: string;
}

export interface EventCreate {
  title: string;
  description?: string;
  location?: string;
  date: string;
  capacity: number;
}

export interface RegistrationCreate {
  name: string;
  email: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getEvents: () => request<Event[]>("/events/"),
  getEvent: (id: number) => request<Event>(`/events/${id}`),
  createEvent: (data: EventCreate) =>
    request<Event>("/events/", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id: number, data: Partial<EventCreate>) =>
    request<Event>(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id: number) =>
    request<void>(`/events/${id}`, { method: "DELETE" }),
  register: (eventId: number, data: RegistrationCreate) =>
    request<Registration>(`/events/${eventId}/registrations/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  cancelRegistration: (eventId: number, regId: number) =>
    request<void>(`/events/${eventId}/registrations/${regId}`, { method: "DELETE" }),
};
