"use client";

import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { supabase } from "../../lib/supabaseClient";
import { fetchUserCollection } from "../../lib/fetchUserCollection";

export default function Page() {
  const [collection, setCollection] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user ?? null;
      if (!user) {
        setCollection([]);
        setLoading(false);
        return;
      }
      try {
        const col = await fetchUserCollection(user.id);
        setCollection(col);
      } catch (err) {
        console.error(err);
        setCollection([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const containerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: 12,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    alignItems: "start",
    marginTop: 12,
  };

  if (loading) return <div style={containerStyle}><p>Cargando colección...</p></div>;
  if (!collection.length) return <div style={containerStyle}><p>No tienes cromos aún.</p></div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 12, color: "#222" }}>Mi Colección</h2>
      <div style={gridStyle} role="list" aria-live="polite">
        {collection.map((c: any) => (
          <Card
            key={c.id}
            code={c.code}
            name={c.name}
            imageUrl={c.imageUrl}
            stars={c.stars}
            diamonds={c.diamonds}
            count={c.count}
          />
        ))}
      </div>
    </div>
  );
}
