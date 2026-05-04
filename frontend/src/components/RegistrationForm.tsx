import React, { useState } from "react";
import { RegistrationCreate } from "../api/client";

interface Props {
  onSubmit: (data: RegistrationCreate) => Promise<void>;
  onCancel: () => void;
}

export default function RegistrationForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<RegistrationCreate>({ name: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={{ margin: 0, fontSize: 16, color: "#1f2937" }}>Регистрация на мероприятие</h3>
      {error && <div style={styles.error}>{error}</div>}
      <input
        style={styles.input}
        placeholder="Ваше имя *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        style={styles.input}
        type="email"
        placeholder="Email *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <div style={styles.buttons}>
        <button style={styles.btnPrimary} type="submit" disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
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
