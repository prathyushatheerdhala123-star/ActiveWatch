import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LINKS = [
  { label: "Home",      path: "/"          },
  { label: "Grow",      path: "/grow"      },
  { label: "Collect",   path: "/collect"   },
  { label: "Unwind",    path: "/unwind"    },
  { label: "Dashboard", path: "/dashboard" },
];

export default function Nav() {
  const navigate = useNavigate();
  const loc      = useLocation();

  // Live coin count — updates whenever GrowMode calls addCoins()
  const [coins, setCoins] = useState(
    () => parseInt(localStorage.getItem("aw_coins") || "120", 10)
  );
  useEffect(() => {
    function sync() {
      setCoins(parseInt(localStorage.getItem("aw_coins") || "120", 10));
    }
    window.addEventListener("aw_coins_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("aw_coins_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=DM+Sans:wght@400;500&family=DM+Mono:wght@500&display=swap');
        .aw-nav-link {
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          cursor: pointer; padding: 6px 12px;
          border-radius: 20px; transition: all 0.2s;
          color: #8C7B6B; letter-spacing: 0.01em;
        }
        .aw-nav-link:hover  { color: #2C1810; background: #F3EDE3; }
        .aw-nav-link.active { color: #C4622D; background: #FDF0E8; font-weight: 500; }
      `}</style>

      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 40px",
        borderBottom: "1px solid #E2D9CE",
        background: "rgba(250,247,242,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>

        {/* Logo */}
        <div onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{
            width: 28, height: 28, background: "#C4622D", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>▶</div>
          <span style={{
            fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600,
            color: "#2C1810", letterSpacing: "-0.3px",
          }}>ActiveWatch</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {LINKS.map(({ label, path }) => (
            <button
              key={path}
              className={`aw-nav-link${loc.pathname === path ? " active" : ""}`}
              onClick={() => navigate(path)}
            >{label}</button>
          ))}
        </div>

        {/* Coin badge — updates live */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#FDF5E6", border: "1px solid #E8C05A",
          borderRadius: 20, padding: "5px 12px",
          fontSize: 13, color: "#C9952A",
          fontFamily: "'DM Mono', monospace", fontWeight: 500,
        }}>
          🪙 {coins.toLocaleString()}
        </div>
      </nav>
    </>
  );
}