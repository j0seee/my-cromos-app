// src/components/FriendRequests.tsx
"use client";

import React from "react";
import { acceptFriendRequest, cancelOrDeleteFriendship } from "../lib/friends";

export default function FriendRequests({ requests = [], type = "incoming" }: { requests: any[], type: "incoming"|"outgoing" }) {

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id);
    window.location.reload(); // simple: refresca lista (podemos mejorar con state)
  };

  const handleCancel = async (id: string) => {
    await cancelOrDeleteFriendship(id);
    window.location.reload();
  };

  if (!requests.length) {
    return <p style={{ color: "#666" }}>{type === "incoming" ? "No hay solicitudes entrantes." : "No has enviado solicitudes."}</p>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {requests.map((r: any) => (
        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", padding: 10, borderRadius: 8 }}>
          <div style={{ flex: 1 }}>
            <strong>{r.requester}</strong>
            <div style={{ fontSize: 13, color: "#666" }}>{new Date(r.created_at).toLocaleString()}</div>
          </div>

          {type === "incoming" ? (
            <>
              <button onClick={() => handleAccept(r.id)}>Aceptar</button>
              <button onClick={() => handleCancel(r.id)} style={{ background: "#FF70A6" }}>Rechazar</button>
            </>
          ) : (
            <button onClick={() => handleCancel(r.id)}>Cancelar</button>
          )}
        </div>
      ))}
    </div>
  );
}
