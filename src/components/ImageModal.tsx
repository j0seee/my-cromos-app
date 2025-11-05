// src/components/ImageModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  imageUrl: string;
  alt?: string;
  initialScale?: number; // default 1
  onClose: () => void;
};

export default function ImageModal({ imageUrl, alt = "", initialScale = 1, onClose }: Props) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState<number>(initialScale);

  // establece atributo data-zoomed para CSS
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    if (scale > 1) {
      inner.setAttribute("data-zoomed", "true");
    } else {
      inner.removeAttribute("data-zoomed");
    }
  }, [scale]);

  // aplicar transform y transform-origin
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    // transform origin para que la parte superior sea accesible al hacer zoom
    img.style.transformOrigin = "top center";
    img.style.transform = `scale(${scale})`;
    img.style.transition = "transform .18s ease";
  }, [scale]);

  // keyboard handlers (Esc to close, +/- to zoom)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
      }
      if (e.key === "-") {
        setScale((s) => Math.max(1, +(s - 0.25).toFixed(2)));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // optional: when zooming in, keep scroll position sensible (no jumping)
  const handleZoomIn = () => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(1, +(s - 0.25).toFixed(2)));
  const handleReset = () => {
    setScale(1);
    // optionally scroll to top when reset:
    if (innerRef.current) innerRef.current.scrollTop = 0;
  };

  // prevent background scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="zoom-controls" aria-hidden={false}>
          <button className="zoom-btn" onClick={handleZoomOut} aria-label="Zoom out" disabled={scale <= 1}>−</button>
          <button className="zoom-btn" onClick={handleReset} aria-label="Reset zoom">Reset</button>
          <button className="zoom-btn" onClick={handleZoomIn} aria-label="Zoom in" disabled={scale >= 3}>+</button>
          <button className="zoom-btn" onClick={onClose} aria-label="Cerrar" style={{ marginLeft: 8 }}>Cerrar</button>
        </div>

        <div
          className="modal-inner"
          ref={innerRef}
          data-zoomed={scale > 1 ? "true" : "false"}
        >
          {/* la imagen NO debe usar position:absolute; permitimos overflow natural */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt={alt}
            className="modal-image"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
}
