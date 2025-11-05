// src/components/Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import FriendNotifBell from "./FriendNotifBell";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [user, setUser] = useState<any | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user ?? null;
      setUser(u);

      // Prioriza full_name en metadata; si no existe, usa la parte anterior al @ del email
      const full = u?.user_metadata?.full_name ?? null;
      if (full && String(full).trim().length > 0) {
        setDisplayName(String(full));
      } else {
        const email: string | undefined = u?.email;
        if (email && email.includes("@")) {
          setDisplayName(email.split("@")[0]);
        } else {
          setDisplayName(null);
        }
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);

      const full = u?.user_metadata?.full_name ?? null;
      if (full && String(full).trim().length > 0) {
        setDisplayName(String(full));
      } else {
        const email: string | undefined = u?.email;
        if (email && email.includes("@")) {
          setDisplayName(email.split("@")[0]);
        } else {
          setDisplayName(null);
        }
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDisplayName(null);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  };

  return (
    <header style={{ padding: "18px 12px" }}>
      <nav className="app-navbar" aria-label="Barra de navegación principal">
        <div className="navbar-inner" role="navigation">
          <div className="nav-side nav-left">
            {user ? (
              <>
                <span className="nav-user" title={user.email}>
                  {displayName ? displayName : "Usuario"}
                </span>

                {/* Cerrar sesión: clase variante 'pink' */}
                <button
                  className="nav-btn nav-btn--pink small"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`nav-btn nav-btn--primary small ${isActive("/login") ? "active" : ""}`}>
                  Login
                </Link>
                <Link href="/register" className={`nav-btn nav-btn--primary small ${isActive("/register") ? "active" : ""}`}>
                  Registro
                </Link>
              </>
            )}
          </div>

          <div className="nav-center" aria-hidden={false}>
            <Link href="/" className="nav-title">
              <span className="nav-logo-text">Mi App de Cromos</span>
            </Link>
          </div>

          <div className="nav-side nav-right">
            <Link
              href="/openPack"
              className={`nav-btn nav-btn--orange ${isActive("/openPack") ? "active" : ""}`}
            >
              Abrir Sobre
            </Link>

            <Link
              href="/collection"
              className={`nav-btn nav-btn--yellow ${isActive("/collection") ? "active" : ""}`}
            >
              Mi Colección
            </Link>

            {/* FriendNotifBell maneja su propio badge/dropdown; lo configuramos con variante lime */}
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <FriendNotifBell buttonVariant="lime" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
