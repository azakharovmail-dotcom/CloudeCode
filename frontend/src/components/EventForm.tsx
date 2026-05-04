import React, { useState } from "react";
import { EventCreate } from "../api/client";

interface Props {
  initial?: Partial<EventCreate>;
  onSubmit: (data: EventCreate) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<EventCreate>({
    title: initial?.title || "",
    description: initial?.description || "",
    location: initial?.location || "",
    date: initial?.date ? initial.date.slice(0, 16) : "",
    capacity: initial?.capacity || 50,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({ ...form, date: new Date(form.date).toISOString() });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}
      <input
        style={styles.input}
        placeholder="Название мероприятия *"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        style={{ ...styles.input, height: 80 }}
        placeholder="Описание"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        style={styles.input}
        placeholder="Место проведения"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <input
        style={styles.input}
        type="datetime-local"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Вместимость"
        min={1}
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        required
      />
      <div style={styles.buttons}>
        <button style={styles.btnPrimary} type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        <button style={styles.btnSecondary} type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 13,
  },
  buttons: { display: "flex", gap: 8 },
  btnPrimary: {
    flex: 1,
    padding: "10px 0",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  btnSecondary: {
    flex: 1,
    padding: "10px 0",
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
