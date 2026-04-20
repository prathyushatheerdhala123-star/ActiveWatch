import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_GUARD = {
  title: "A Day in My Life as a Developer",
  channel: "TechVlogger",
  duration: "18 min",
  dailyLimit: 30,
  watchedToday: 12,
  queue: [
    { id: 1, title: "Morning Routine of a Senior Dev",   duration: "22 min", scheduled: "Tomorrow 9am"  },
    { id: 2, title: "My Home Office Setup 2024",         duration: "15 min", scheduled: "Tomorrow 2pm"  },
    { id: 3, title: "What I Eat in a Day — Dev Edition", duration: "12 min", scheduled: "In 2 days"     },
  ],
  archived: [
    { id: 1, title: "My First Year as a Developer",     duration: "25 min", archivedAt: "2h ago"       },
    { id: 2, title: "Day in the Life — Startup Edition", duration: "19 min", archivedAt: "Yesterday"    },
  ],
};

export default function GuardMode() {
  const navigate = useNavigate();
  const [limit, setLimit]       = useState(MOCK_GUARD.dailyLimit);
  const [editing, setEditing]   = useState(false);
  const [tempLimit, setTempLimit] = useState(MOCK_GUARD.dailyLimit);
  const [queue, setQueue]       = useState(MOCK_GUARD.queue);
  const [autoplay, setAutoplay] = useState(false);
  const [saved, setSaved]       = useState(false);

  const watchedPct = Math.min(Math.round((MOCK_GUARD.watchedToday / limit) * 100), 100);
  const remaining  = Math.max(limit - MOCK_GUARD.watchedToday, 0);

  function saveLimit() {
    setLimit(Number(tempLimit));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function removeFromQueue(id) {
    setQueue(prev => prev.filter(v => v.id !== id));
  }

  const barColor = watchedPct > 80 ? "#E24B4A" : watchedPct > 60 ? "#C47B2B" : "#2A7D52";

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .aw-nav-btn:hover{color:#7C6FCD!important;}
        .aw-queue-row:hover{background:#F7F6FB!important;}
        .aw-remove-btn:hover{color:#E24B4A!important;}
      `}</style>

      <nav style={S.nav}>
        <div style={S.logo} onClick={() => navigate("/")}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C6FCD" }} />
          <span style={{ color: "#1E1B2E", fontWeight: 600 }}>Active</span>
          <span style={{ color: "#7C6FCD", fontWeight: 600 }}>Watch</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Home", "/"], ["Dashboard", "/dashboard"], ["Learn", "/learn"], ["Capture", "/capture"]].map(([l, p]) => (
            <button key={l} className="aw-nav-btn" onClick={() => navigate(p)}
              style={{ background: "none", border: "none", color: "#9794A8", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>{l}</button>
          ))}
        </div>
      </nav>

      <div style={S.page}>
        <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#C47B2B", background: "#FEF3E8", padding: "3px 12px", borderRadius: 20, fontWeight: 600, border: "1px solid #F0CEAA" }}>🛡️ Guard Mode</span>
          </div>
          <h1 style={{ color: "#1E1B2E", fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>{MOCK_GUARD.title}</h1>
          <p style={{ color: "#9794A8", fontSize: 14, margin: 0 }}>{MOCK_GUARD.channel} · {MOCK_GUARD.duration}</p>
        </div>

        <div style={S.grid}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* DAILY LIMIT */}
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.05s ease both" }}>
              <div style={S.cardTitle}>⏱️ Daily Watch Limit</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                {editing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <input type="number" value={tempLimit} onChange={e => setTempLimit(e.target.value)} min={5} max={180}
                      style={{ width: 72, background: "#F7F6FB", border: "1px solid #7C6FCD", borderRadius: 8, padding: "7px 10px", color: "#1E1B2E", fontSize: 18, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", outline: "none", textAlign: "center", boxShadow: "0 0 0 3px rgba(124,111,205,0.1)" }} />
                    <span style={{ color: "#9794A8", fontSize: 14 }}>min / day</span>
                    <button onClick={saveLimit}
                      style={{ marginLeft: "auto", background: "#7C6FCD", border: "none", borderRadius: 8, padding: "8px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {saved ? "✅ Saved!" : "Save"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <span style={{ color: "#1E1B2E", fontSize: 36, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{limit}</span>
                    <span style={{ color: "#9794A8", fontSize: 14 }}>min / day</span>
                    <button onClick={() => setEditing(true)}
                      style={{ marginLeft: "auto", background: "#EDE9FB", border: "1px solid #C9C2F0", borderRadius: 8, padding: "7px 14px", color: "#7C6FCD", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#6B6880" }}>Today's usage</span>
                <span style={{ fontSize: 13, color: barColor, fontFamily: "'JetBrains Mono',monospace", fontWeight: 500 }}>{MOCK_GUARD.watchedToday} / {limit} min</span>
              </div>
              <div style={{ height: 10, background: "#F0EEF9", borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ height: "100%", width: `${watchedPct}%`, background: barColor, borderRadius: 5, transition: "width 1s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "#E6F4EE", border: "1px solid #B2D9C4", borderRadius: 8, padding: "8px 14px" }}>
                  <span style={{ color: "#2A7D52", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{remaining} min</span>
                  <span style={{ color: "#9794A8", fontSize: 12 }}>remaining today</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "#FEF3E8", border: "1px solid #F0CEAA", borderRadius: 8, padding: "8px 14px" }}>
                  <span style={{ color: "#C47B2B", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{queue.length}</span>
                  <span style={{ color: "#9794A8", fontSize: 12 }}>videos queued</span>
                </div>
              </div>
            </div>

            {/* AUTOPLAY */}
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.1s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={S.cardTitle}>🚫 Block Autoplay</div>
                  <p style={{ color: "#9794A8", fontSize: 13, margin: 0 }}>Prevent YouTube from auto-playing the next video</p>
                </div>
                <div onClick={() => setAutoplay(!autoplay)}
                  style={{ width: 46, height: 25, borderRadius: 13, background: autoplay ? "#E24B4A" : "#E8E4F0", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: autoplay ? 23 : 3, width: 19, height: 19, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: autoplay ? "#FCEBEB" : "#E6F4EE", border: `1px solid ${autoplay ? "#F09595" : "#B2D9C4"}`, fontSize: 13, color: autoplay ? "#A32D2D" : "#2A7D52" }}>
                {autoplay ? "⚠️ Autoplay is ON — videos will chain automatically." : "✅ Autoplay is blocked — videos won't chain."}
              </div>
            </div>

            {/* ARCHIVED */}
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.15s ease both" }}>
              <div style={S.cardTitle}>📦 Auto-Archived (24h)</div>
              <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 14 }}>Videos auto-archive after 24 hours to keep your queue clean.</p>
              {MOCK_GUARD.archived.map(v => (
                <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F0EEF9" }}>
                  <div>
                    <div style={{ color: "#C9C2F0", fontSize: 13, textDecoration: "line-through" }}>{v.title}</div>
                    <div style={{ color: "#D8D4EC", fontSize: 11, marginTop: 2 }}>{v.duration} · archived {v.archivedAt}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "#C9C2F0", background: "#F0EEF9", padding: "2px 8px", borderRadius: 10 }}>archived</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — QUEUE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.1s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={S.cardTitle}>📋 Smart Queue</div>
                <span style={{ fontSize: 12, color: "#C47B2B", fontFamily: "'JetBrains Mono',monospace", background: "#FEF3E8", padding: "2px 8px", borderRadius: 20, border: "1px solid #F0CEAA" }}>{queue.length} pending</span>
              </div>
              <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 16 }}>Videos over your daily limit are queued for tomorrow. They auto-archive if unwatched after 24 hours.</p>
              {queue.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0", color: "#C9C2F0" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  <div style={{ fontSize: 14 }}>Queue is empty</div>
                </div>
              ) : (
                queue.map((v, i) => (
                  <div key={v.id} className="aw-queue-row"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, background: "#FAFAFA", border: "1px solid #E8E4F0", marginBottom: 8, transition: "background 0.15s" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: "#FEF3E8", border: "1px solid #F0CEAA", display: "flex", alignItems: "center", justifyContent: "center", color: "#C47B2B", fontWeight: 600, fontSize: 12, flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#1E1B2E", fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{v.title}</div>
                      <div style={{ color: "#9794A8", fontSize: 12 }}>{v.duration} · {v.scheduled}</div>
                    </div>
                    <button className="aw-remove-btn" onClick={() => removeFromQueue(v.id)}
                      style={{ background: "none", border: "none", color: "#D8D4EC", fontSize: 16, cursor: "pointer", padding: 4, transition: "color 0.2s", lineHeight: 1 }}>✕</button>
                  </div>
                ))
              )}
              <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "#FEF3E8", border: "1px solid #F0CEAA", fontSize: 13, color: "#C47B2B", lineHeight: 1.6 }}>
                🛡️ Guard Mode active. Stay within your {limit}-minute daily limit to keep your focus sharp.
              </div>
            </div>

            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.15s ease both" }}>
              <div style={S.cardTitle}>💡 Guard Mode Tips</div>
              {[
                "Start with 30 minutes and adjust based on how you feel after a week.",
                "Treat queued videos like a reading list — not everything needs to be watched.",
                "If a video auto-archives, it probably wasn't urgent.",
                "Use Learn Mode for tutorials and Capture Mode for podcasts instead.",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ color: "#C47B2B", fontSize: 12, marginTop: 2, flexShrink: 0 }}>→</span>
                  <p style={{ color: "#9794A8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root:      { minHeight: "100vh", background: "#F7F6FB", fontFamily: "'Space Grotesk',sans-serif", color: "#6B6880", display: "flex", flexDirection: "column" },
  nav:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #E8E4F0", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
  logo:      { display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" },
  page:      { padding: "28px 40px", maxWidth: 1100, margin: "0 auto", width: "100%" },
  grid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "flex-start" },
  card:      { background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(124,111,205,0.05)" },
  cardTitle: { color: "#1E1B2E", fontSize: 14, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 },
};
