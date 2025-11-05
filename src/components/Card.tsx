"use client";

import React, { useState } from "react";
import ImageModal from "./ImageModal";

type Props = {
  code: string;
  name: string;
  imageUrl: string;
  stars: number;     // 0..5
  diamonds: number;  // 0..3
  count?: number;
};

export default function Card({ code, name, imageUrl, stars, diamonds, count = 0 }: Props) {
  const [open, setOpen] = useState(false);

  const cardStyle: React.CSSProperties = {
    position: "relative",
    background: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    padding: 12,
    boxShadow: "0 6px 18px rgba(16,24,40,0.08)",
    display: "flex",
    flexDirection: "column",
    minHeight: 320,
    cursor: "pointer",
  };

  const imageWrapStyle: React.CSSProperties = {
    width: "100%",
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg,#fff,#fbfbfb)",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  };

  const imgStyle: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  };

  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#FF70A6",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 14,
    boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
    border: "2px solid rgba(255,255,255,0.2)",
    zIndex: 5,
  };

  const titleStyle: React.CSSProperties = { fontSize: 16, margin: 0, color: "#222", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const codeStyle: React.CSSProperties = { fontSize: 13, color: "#666", marginTop: 4 };

  const metaStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, marginTop: 8 };

  return (
    <>
      <div style={cardStyle} onClick={() => setOpen(true)} role="listitem" aria-label={name}>
        {count > 1 && <div style={badgeStyle}>{count}</div>}

        <div style={imageWrapStyle} aria-hidden>
          <img src={imageUrl} alt={name} style={imgStyle} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexGrow: 1 }}>
          <h2 style={titleStyle} title={name}>{name}</h2>
          <div style={codeStyle}>{code}</div>

          <div style={metaStyle}>
            <div>
              {Array.from({ length: Math.max(0, stars) }).map((_, i) => (
                <span key={i} style={{ color: "#FFD670", fontSize: 18 }}>★</span>
              ))}
              {Array.from({ length: Math.max(0, 5 - stars) }).map((_, i) => (
                <span key={i} style={{ color: "#e6e6e6", fontSize: 18 }}>★</span>
              ))}
            </div>

            <div style={{ marginLeft: "auto" }}>
              {Array.from({ length: Math.max(0, diamonds) }).map((_, i) => (
                <span key={i} style={{ color: "#FF70A6", fontSize: 18, marginLeft: 6 }}>♦</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {open && <ImageModal imageUrl={imageUrl} alt={name} onClose={() => setOpen(false)} />}
    </>
  );
}
