"use client";

import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { supabase } from "../../lib/supabaseClient";

export default function Page() {
  const [card, setCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id ?? null);
    });
  }, []);

  const openPack = async () => {
    if (!userId) {
      setError("Debes iniciar sesión para abrir un sobre.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc("open_surprise_pack", { p_user: userId });
      if (rpcError) {
        setError(rpcError.message);
        setCard(null);
      } else {
        const result = Array.isArray(data) ? data[0] : data;
        setCard(result ?? null);
      }
    } catch (err: any) {
      console.error("openPack error", err);
      setError(err?.message ?? "Error al abrir el sobre");
      setCard(null);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: 12 };
  const packContainer: React.CSSProperties = { display: "flex", justifyContent: "center", padding: "24px 12px" };
  const packBox: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    background: "linear-gradient(180deg,#ffffff,#fbfbff)",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    border: "1px solid rgba(16,24,40,0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  };
  const actionsStyle: React.CSSProperties = { width: "100%", display: "flex", justifyContent: "center" };
  const resultStyle: React.CSSProperties = { width: "100%", display: "flex", justifyContent: "center", marginTop: 6, paddingTop: 6, borderTop: "1px dashed rgba(0,0,0,0.04)" };

  return (
    <div style={pageStyle}>
      <div style={packContainer}>
        <div style={packBox}>
          <h2 style={{ margin: 0 }}>Abrir Sobre</h2>

          <div style={actionsStyle}>
            <button onClick={openPack} disabled={loading} style={{ width: 160 }}>
              {loading ? "Abriendo..." : "Abrir Sobre"}
            </button>
          </div>

          <p style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            Cada sobre te dará un cromo aleatorio. (Prueba sin límites en desarrollo)
          </p>

          {error && <p style={{ color: "#FF70A6", marginTop: 6 }}>{error}</p>}

          <div style={resultStyle} aria-live="polite">
            {card ? (
              <Card
                code={card.out_code}
                name={card.out_name}
                imageUrl={card.out_image_url}
                stars={card.out_stars}
                diamonds={card.out_diamonds}
                count={1}
              />
            ) : (
              <div style={{ color: "#666" }} aria-hidden>
                {/* placeholder */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
