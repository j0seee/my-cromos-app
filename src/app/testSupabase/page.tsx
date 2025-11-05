"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Card from "@/components/Card";

export default function OpenPack() {
  const [card, setCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UUID de ejemplo: reemplaza con el usuario real cuando tengas login
  const userId = "11111111-1111-1111-1111-111111111111";

  const openSurprisePack = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc("open_surprise_pack", { p_user: userId });

    if (error) {
      setError(error.message);
      setCard(null);
    } else if (data && data.length > 0) {
      setCard(data[0]);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Abrir Sobre Sorpresa</h1>

      <button
        onClick={openSurprisePack}
        disabled={loading}
        className="mb-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Abriendo..." : "Abrir Sobre"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {card && (
        <Card
          code={card.out_code}
          name={card.out_name}
          imageUrl={card.out_image_url}
          stars={card.out_stars}
          diamonds={card.out_diamonds}
        />
      )}
    </div>
  );
}
