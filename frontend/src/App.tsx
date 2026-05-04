import React, { useEffect, useState, useCallback } from "react";
import { Event, EventCreate, api } from "./api/client";
import EventCard from "./components/EventCard";
import EventForm from "./components/EventForm";

type Modal = { type: "create" } | { type: "edit"; event: Event } | null;

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadEvents = useCallback(async () => {
    try {
      const data = await api.getEvents();
      setEvents(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch {
      setError("Не удалось загрузить мероприятия");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleCreate = async (data: EventCreate) => {
    await api.createEvent(data);
    setModal(null);
    loadEvents();
  };

  const handleUpdate = async (data: EventCreate) => {
    if (modal?.type !== "edit") return;
    await api.updateEvent(modal.event.id, data);
    setModal(null);
    loadEvents();
  };

  const handleDelete = async (id: number) => {
    await api.deleteEvent(id);
    loadEvents();
  };

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = filtered.filter((e) => new Date(e.date) >= new Date());
  const past = filtered.filter((e) => new Date(e.date) < new Date());

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🎉</span>
            <span style={styles.logoText}>EventHub</span>
          </div>
          <button style={styles.createBtn} onClick={() => setModal({ type: "create" })}>
            + Создать мероприятие
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <input
          style={styles.search}
          placeholder="Поиск по названию или месту..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <div style={styles.errorBanner}>{error}</div>}

        {loading ? (
          <div style={styles.center}>Загрузка...</div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <h2 style={styles.sectionTitle}>Предстоящие мероприятия ({upcoming.length})</h2>
                <div style={styles.grid}>
                  {upcoming.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={(e) => setModal({ type: "edit", event: e })}
                      onDelete={handleDelete}
                      onRefresh={loadEvents}
                    />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section style={{ marginTop: 32 }}>
                <h2 style={styles.sectionTitle}>Прошедшие мероприятия ({past.length})</h2>
                <div style={styles.grid}>
                  {past.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={(e) => setModal({ type: "edit", event: e })}
                      onDelete={handleDelete}
                      onRefresh={loadEvents}
                    />
                  ))}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div style={styles.empty}>
                <div style={{ fontSize: 48 }}>📭</div>
                <p>Мероприятий нет. Создайте первое!</p>
              </div>
            )}
          </>
        )}
      </main>

      {modal && (
        <div style={styles.overlay} onClick={() => setModal(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {modal.type === "create" ? "Новое мероприятие" : "Редактировать мероприятие"}
            </h2>
            <EventForm
              initial={modal.type === "edit" ? modal.event : undefined}
              onSubmit={modal.type === "create" ? handleCreate : handleUpdate}
              onCancel={() => setModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, sans-serif" },
  header: { background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" },
  headerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 64,
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 22, fontWeight: 700, color: "#6366f1" },
  createBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  search: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 15,
    marginBottom: 28,
    boxSizing: "border-box",
    outline: "none",
  },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 },
  center: { textAlign: "center", padding: 60, color: "#9ca3af" },
  empty: { textAlign: "center", padding: 60, color: "#9ca3af" },
  errorBanner: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 16,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 16,
  },
  modalBox: {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalTitle: { margin: "0 0 20px", fontSize: 20, color: "#1f2937" },
};
