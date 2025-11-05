// src/components/FriendsList.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function FriendsList({ friends = [] }: { friends: any[] }) {
  if (!friends.length) return <p style={{ color: "#666" }}>No tienes amigos aún.</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {friends.map((f: any) => {
        // f has requester/addressee - compute otherId
        const currentUser = (typeof window !== "undefined") ? (window as any).__SUPABASE_CURRENT_USER_ID : null;
        const otherId = (f.requester === currentUser) ? f.addressee : f.requester;
        // but fall back:
        const other = f.requester && f.addressee ? (f.requester === currentUser ? f.addressee : f.requester) : f;
        return (
          <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: 10, borderRadius: 8 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{other}</div>
              <div style={{ fontSize: 13, color: "#666" }}>Amigo desde {new Date(f.updated_at).toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/profile/${other}`} className="nav-btn small">Ver Perfil</Link>
              <Link href={`/profile/${other}/collection`} className="nav-btn small">Ver Colección</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
