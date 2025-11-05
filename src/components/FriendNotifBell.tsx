// src/components/FriendNotifBell.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  getIncomingRequests,
  acceptFriendRequest,
  cancelOrDeleteFriendship,
  enrichFriendRowsWithProfiles,
} from "../lib/friends";
import Link from "next/link";

type Props = {
  buttonVariant?: "primary" | "orange" | "yellow" | "lime" | "pink";
};

export default function FriendNotifBell({ buttonVariant = "lime" }: Props) {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState<number>(0);
  const [pulse, setPulse] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<any | null>(null);
  const prevCount = useRef<number>(0);

  const load = async () => {
    setLoading(true);
    const { data } = await getIncomingRequests();
    const enriched = await enrichFriendRowsWithProfiles(data ?? []);
    setRequests(enriched ?? []);
    setCount((data ?? []).length);
    setLoading(false);
    prevCount.current = (data ?? []).length;
  };

  useEffect(() => {
    load();

    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);

    return () => { document.removeEventListener("click", onDocClick); window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    supabase.auth.getUser().then(({ data }) => {
      const uid = data?.user?.id;
      if (!uid) return;
      const ch = supabase
        .channel(`friendships_notif_${uid}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "friendships", filter: `addressee=eq.${uid}` },
          async (payload) => {
            const { data } = await getIncomingRequests();
            const len = (data ?? []).length;
            if (len > prevCount.current) {
              setPulse(true);
              setTimeout(() => setPulse(false), 800);
            }
            prevCount.current = len;
            const enriched = await enrichFriendRowsWithProfiles(data ?? []);
            setRequests(enriched ?? []);
            setCount(len);
          }
        )
        .subscribe();
      channelRef.current = ch;
    });
    return () => { if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null; } };
  }, []);

  const handleAccept = async (id: string) => {
    const old = requests;
    const newList = requests.filter((r) => r.id !== id);
    setRequests(newList);
    setCount((c) => Math.max(0, c - 1));
    try {
      const { error } = await acceptFriendRequest(id);
      if (error) throw error;
    } catch (err: any) {
      setRequests(old);
      setCount((c) => c + 1);
      alert("Error al aceptar la solicitud: " + (err?.message ?? err));
    }
  };

  const handleReject = async (id: string) => {
    const old = requests;
    const newList = requests.filter((r) => r.id !== id);
    setRequests(newList);
    setCount((c) => Math.max(0, c - 1));
    try {
      const { error } = await cancelOrDeleteFriendship(id);
      if (error) throw error;
    } catch (err: any) {
      setRequests(old);
      setCount((c) => c + 1);
      alert("Error al rechazar la solicitud: " + (err?.message ?? err));
    }
  };

  // variant class mapping
  const variantClass = `nav-btn nav-btn--${buttonVariant} friends-btn ${pulse ? "pulse" : ""}`;

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        className={variantClass}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Amigos y solicitudes"
        title="Amigos"
      >
        <span style={{ marginRight: 8 }}>Amigos</span>
        {count > 0 && <span className="notif-badge top-right" aria-live="polite">{count}</span>}
      </button>

      {open && (
        <div className="friends-dropdown" role="menu" aria-label="Solicitudes de amistad">
          <div className="dropdown-header">
            <strong>Solicitudes</strong>
            <div style={{ marginLeft: "auto", opacity: 0.85, fontSize: 13 }}>{count} pendiente{count !== 1 && "s"}</div>
          </div>

          <div className="dropdown-body">
            {loading ? (
              <div className="dropdown-empty">Cargando…</div>
            ) : requests.length === 0 ? (
              <div className="dropdown-empty">No hay solicitudes.</div>
            ) : (
              requests.map((r: any) => {
                const other = r.other ?? { id: r.requester };
                return (
                  <div key={r.id} className="friend-request dropdown-item" role="menuitem">
                    <div className="friend-left">
                      <img src={other.avatar_url ?? "/placeholder-avatar.png"} alt="" className="avatar" />
                    </div>

                    <div className="friend-middle">
                      <div className="who">{other.display_name ?? other.id}</div>
                      <div className="when">{new Date(r.created_at).toLocaleString()}</div>
                    </div>

                    <div className="friend-right">
                      <button className="btn-primary btn-accept" onClick={() => handleAccept(r.id)}>Aceptar</button>
                      <button className="btn-ghost" onClick={() => handleReject(r.id)}>Rechazar</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="dropdown-footer">
            <Link href="/friends" className="btn-ghost">Ver todas</Link>
          </div>
        </div>
      )}
    </div>
  );
}
