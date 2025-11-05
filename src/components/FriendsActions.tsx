// src/components/FriendActions.tsx
"use client";

import React, { useEffect, useState } from "react";
import { sendFriendRequest, cancelOrDeleteFriendship } from "../lib/friends";
import { supabase } from "../lib/supabaseClient";

export default function FriendActions({ profileId }: { profileId: string }) {
  const [me, setMe] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setMe(data?.user?.id ?? null);
      // fetch existing friendship row between me and profileId
      (async () => {
        const { data: rows } = await supabase
          .from("friendships")
          .select("*")
          .or(`and(requester.eq.${data?.user?.id},addressee.eq.${profileId}),and(requester.eq.${profileId},addressee.eq.${data?.user?.id})`)
          .limit(1);
        if (rows && rows.length) {
          setStatus(rows[0].status);
          setRequestId(rows[0].id);
        } else {
          setStatus(null);
          setRequestId(null);
        }
      })();
    });
  }, [profileId]);

  if (!me || me === profileId) return null;

  const onSend = async () => {
    const { data, error } = await sendFriendRequest(profileId);
    if (error) {
      alert(error.message || "Error");
      return;
    }
    window.location.reload();
  };

  const onCancel = async () => {
    if (!requestId) return;
    await cancelOrDeleteFriendship(requestId);
    window.location.reload();
  };

  if (status === "pending") {
    return <button onClick={onCancel}>Cancelar solicitud</button>;
  }
  if (status === "accepted") {
    return <button disabled>Amigos</button>;
  }
  // otherwise
  return <button onClick={onSend}>Enviar solicitud</button>;
}
