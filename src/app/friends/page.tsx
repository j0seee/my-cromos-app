// src/app/friends/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getIncomingRequests, getOutgoingRequests, getFriendsList, enrichFriendRowsWithProfiles } from "../../lib/friends";
import Link from "next/link";

export default function FriendsPage() {
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: inc }, { data: out }, { data: fri }] = await Promise.all([
        getIncomingRequests(),
        getOutgoingRequests(),
        getFriendsList()
      ]);
      const incE = await enrichFriendRowsWithProfiles(inc ?? []);
      const outE = await enrichFriendRowsWithProfiles(out ?? []);
      const friE = await enrichFriendRowsWithProfiles(fri ?? []);

      setIncoming(incE ?? []);
      setOutgoing(outE ?? []);
      setFriends(friE ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="page-container friends-page">
      <h2>Amigos</h2>

      <section style={{ marginTop: 16 }}>
        <h3>Solicitudes Entrantes</h3>
        <div className="friend-requests-list">
          {incoming.length === 0 ? <p style={{ color: "#666" }}>No hay solicitudes entrantes.</p> :
            incoming.map(r => {
              const other = r.other ?? { id: r.requester };
              return (
                <div key={r.id} className="friend-request">
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={other.avatar_url ?? "/placeholder-avatar.png"} alt="" className="avatar" />
                    <div>
                      <div className="who">{other.display_name ?? other.id}</div>
                      <div className="when">{new Date(r.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-primary" onClick={async () => { await (await import("../../lib/friends")).acceptFriendRequest(r.id); window.location.reload(); }}>Aceptar</button>
                    <button className="btn-ghost" onClick={async () => { await (await import("../../lib/friends")).cancelOrDeleteFriendship(r.id); window.location.reload(); }}>Rechazar</button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Lista de Amigos</h3>
        <div className="friends-grid">
          {friends.length === 0 ? <p style={{ color: "#666" }}>No tienes amigos aún.</p> :
            friends.map((f: any) => {
              const other = f.other ?? { id: f.requester };
              return (
                <div key={f.id} className="friend-card">
                  <div className="info">
                    <img src={other.avatar_url ?? "/placeholder-avatar.png"} alt="" className="avatar" />
                    <div className="meta">
                      <div className="name">{other.display_name ?? other.id}</div>
                      <div className="small">Amigo desde {new Date(f.updated_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="actions">
                    <Link href={`/profile/${other.id}`} className="btn-ghost">Ver perfil</Link>
                    <Link href={`/profile/${other.id}/collection`} className="btn-ghost">Ver colección</Link>
                  </div>
                </div>
              );
            })
          }
        </div>
      </section>
    </div>
  );
}
