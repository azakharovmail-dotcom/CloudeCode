import React, { useState } from "react";
import { Event, Registration, api } from "../api/client";
import RegistrationForm from "./RegistrationForm";

interface Props {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

export default function EventCard({ event, onEdit, onDelete, onRefresh }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const date = new Date(event.date);
  const isPast = date < new Date();
  const spotsLeft = event.spots_left ?? event.capacity - event.registrations.length;

  const handleRegister = async (data: { name: string; email: string }) => {
    await api.register(event.id, data);
    setShowRegForm(false);
    onRefresh();
  };

  const handleCancelReg = async (regId: number) => {
    await api.cancelRegistration(event.id, regId);
    onRefresh();
  };

  return (
    <div style={{ ...styles.card, opacity: isPast ? 0.75 : 1 }}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <h3 style={styles.title}>{event.title}</h3>
          {isPast && <span style={styles.badgePast}>Прошло</span>}
          {!isPast && spotsLeft === 0 && <span style={styles.badgeFull}>Мест нет</span>}
        </div>
        <div style={styles.actions}>
          <button style={styles.iconBtn} onClick={() => onEdit(event)} title="Редактировать">✏️</button>
          {deleteConfirm ? (
            <>
              <button style={{ ...styles.iconBtn, color: "#dc2626" }} onClick={() => onDelete(event.id)}>Удалить?</button>
              <button style={styles.iconBtn} onClick={() => setDeleteConfirm(false)}>Нет</button>
            </>
          ) : (
            <button style={styles.iconBtn} onClick={() => setDeleteConfirm(true)} title="Удалить">🗑️</button>
          )}
        </div>
      </div>

      <div style={styles.meta}>
        <span>📅 {date.toLocaleString("ru-RU", { dateStyle: "long", timeStyle: "short" })}</span>
        {event.location && <span>📍 {event.location}</span>}
        <span>👥 {event.registrations.length}/{event.capacity} участников</span>
        {!isPast && spotsLeft > 0 && <span style={{ color: "#059669" }}>✓ {spotsLeft} мест</span>}
      </div>

      {event.description && <p style={styles.description}>{event.description}</p>}

      <div style={styles.footer}>
        <button style={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Скрыть участников ▲" : `Участники (${event.registrations.length}) ▼`}
        </button>
        {!isPast && spotsLeft > 0 && (
          <button style={styles.registerBtn} onClick={() => setShowRegForm(true)}>
            Зарегистрироваться
          </button>
        )}
      </div>

      {showRegForm && (
        <div style={styles.formWrap}>
          <RegistrationForm onSubmit={handleRegister} onCancel={() => setShowRegForm(false)} />
        </div>
      )}

      {expanded && (
        <div style={styles.regList}>
          {event.registrations.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Нет участников</p>
          ) : (
            event.registrations.map((reg: Registration) => (
              <div key={reg.id} style={styles.regItem}>
                <div>
                  <strong>{reg.name}</strong>
                  <span style={{ color: "#6b7280", marginLeft: 8, fontSize: 13 }}>{reg.email}</span>
                </div>
                <button style={styles.cancelBtn} onClick={() => handleCancelReg(reg.id)}>✕</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  titleRow: { display: "flex", alignItems: "center", gap: 8 },
  title: { margin: 0, fontSize: 18, color: "#1f2937" },
  badgePast: { background: "#f3f4f6", color: "#6b7280", fontSize: 11, padding: "2px 8px", borderRadius: 12 },
  badgeFull: { background: "#fee2e2", color: "#dc2626", fontSize: 11, padding: "2px 8px", borderRadius: 12 },
  actions: { display: "flex", gap: 4 },
  iconBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "4px 6px" },
  meta: { display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13, color: "#4b5563", marginBottom: 8 },
  description: { color: "#6b7280", fontSize: 14, margin: "8px 0" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  expandBtn: { background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontSize: 13, padding: 0 },
  registerBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
  formWrap: { marginTop: 16, padding: 16, background: "#f9fafb", borderRadius: 8 },
  regList: { marginTop: 12, display: "flex", flexDirection: "column", gap: 8 },
  regItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    background: "#f9fafb",
    borderRadius: 8,
    fontSize: 14,
  },
  cancelBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    fontSize: 16,
    padding: "0 4px",
  },
};
