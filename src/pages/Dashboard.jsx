import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCoins, getStreak } from "../api.js";

const RPG_LEVELS = [
  { title: "Intern",                min: 0,    max: 200,  color: "#9794A8", bg: "#F0EEF9", icon: "🧑‍💻" },
  { title: "Junior Dev",            min: 200,  max: 500,  color: "#2A7D52", bg: "#E6F4EE", icon: "👨‍💻" },
  { title: "Mid-level Dev",         min: 500,  max: 1000, color: "#7C6FCD", bg: "#EDE9FB", icon: "🧑‍🔧" },
  { title: "Senior Dev",            min: 1000, max: 2000, color: "#C47B2B", bg: "#FEF3E8", icon: "🏆"   },
  { title: "Staff Engineer",        min: 2000, max: 3500, color: "#185FA5", bg: "#E6F1FB", icon: "⭐"   },
  { title: "Principal Engineer",    min: 3500, max: 5000, color: "#993556", bg: "#FBEAF0", icon: "🚀"   },
  { title: "Distinguished Engineer",min: 5000, max: 9999, color: "#7C6FCD", bg: "#EDE9FB", icon: "👑"   },
];

function getLevel(coins) {
  return [...RPG_LEVELS].reverse().find(l => coins >= l.min) || RPG_LEVELS[0];
}

const MOCK_ACTIONS = [
  { id: 1, label: "Complete Chapter 1 MCQ",     coins: 50, done: true,  icon: "❓" },
  { id: 2, label: "Submit coding challenge",     coins: 50, done: true,  icon: "💻" },
  { id: 3, label: "Unlock Chapter 2",            coins: 30, done: false, icon: "🔓" },
  { id: 4, label: "Watch 1 Capture Mode video",  coins: 20, done: false, icon: "📋" },
  { id: 5, label: "Maintain your streak",        coins: 25, done: false, icon: "🔥" },
];

const MOCK_TOPICS = [
  { name: "Frontend", pct: 68, color: "#7C6FCD", bg: "#EDE9FB" },
  { name: "Backend",  pct: 34, color: "#2A7D52", bg: "#E6F4EE" },
  { name: "DSA",      pct: 21, color: "#993556", bg: "#FBEAF0" },
  { name: "DevOps",   pct: 10, color: "#C47B2B", bg: "#FEF3E8" },
];

const MOCK_VIDEOS = [
  { title: "React Hooks Full Course",   mode: "Learn",   pct: 45, chapters: "2/4", color: "#7C6FCD", bg: "#EDE9FB" },
  { title: "Node.js REST API Tutorial", mode: "Learn",   pct: 10, chapters: "1/6", color: "#7C6FCD", bg: "#EDE9FB" },
  { title: "How to Build Deep Work",    mode: "Capture", pct: 80, chapters: null,  color: "#2A7D52", bg: "#E6F4EE" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [coins, setCoins]     = useState(getCoins);
  const [actions, setActions] = useState(MOCK_ACTIONS);

  useEffect(() => { setCoins(getCoins()); }, []);

  const level     = getLevel(coins);
  const nextLevel = RPG_LEVELS[RPG_LEVELS.indexOf(level) + 1] || level;
  const xpPct     = Math.round(((coins - level.min) / (nextLevel.max - level.min)) * 100);

  function toggleAction(id) {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  }

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .aw-nav-btn:hover{color:#7C6FCD!important;}
        .aw-action:hover{background:#F7F6FB!important;}
        .aw-video-card:hover{border-color:#C9C2F0!important;transform:translateY(-1px);}
      `}</style>

      <nav style={S.nav}>
        <div style={S.logo} onClick={() => navigate("/")}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C6FCD" }} />
          <span style={{ color: "#1E1B2E", fontWeight: 600 }}>Active</span>
          <span style={{ color: "#7C6FCD", fontWeight: 600 }}>Watch</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Home", "/"], ["Learn", "/learn"], ["Capture", "/capture"]].map(([l, p]) => (
            <button key={l} className="aw-nav-btn" onClick={() => navigate(p)}
              style={{ background: "none", border: "none", color: "#9794A8", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>{l}</button>
          ))}
        </div>
      </nav>

      <div style={S.page}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: "#1E1B2E", fontSize: 26, fontWeight: 600, letterSpacing: "-0.4px", margin: 0 }}>Dashboard</h1>
          <p style={{ color: "#9794A8", fontSize: 14, margin: "4px 0 0" }}>Your learning progress at a glance</p>
        </div>

        {/* TOP ROW */}
        <div style={S.topRow}>
          {/* RPG CARD */}
          <div style={{ ...S.card, flex: "0 0 290px", animation: "fadeUp 0.5s ease both", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: `${level.bg}`, opacity: 0.6, pointerEvents: "none" }} />
            <div style={{ fontSize: 10, color: "#C9C2F0", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 14 }}>DEVELOPER CARD</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: level.bg, border: `1.5px solid ${level.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                {level.icon}
              </div>
              <div>
                <div style={{ color: level.color, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 2 }}>{level.title.toUpperCase()}</div>
                <div style={{ color: "#1E1B2E", fontSize: 22, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>🪙 {coins.toLocaleString()}</div>
                <div style={{ color: "#9794A8", fontSize: 12 }}>coins collected</div>
              </div>
            </div>
            <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6B6880", fontSize: 12 }}>To <span style={{ color: level.color, fontWeight: 500 }}>{nextLevel.title}</span></span>
              <span style={{ color: "#9794A8", fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{xpPct}%</span>
            </div>
            <div style={{ height: 8, background: "#F0EEF9", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${xpPct}%`, background: level.color, borderRadius: 4, transition: "width 1s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: "#C9C2F0", fontFamily: "'JetBrains Mono',monospace" }}>{level.min}</span>
              <span style={{ fontSize: 10, color: "#C9C2F0", fontFamily: "'JetBrains Mono',monospace" }}>{nextLevel.max}</span>
            </div>
            <div style={{ paddingTop: 14, borderTop: "1px solid #E8E4F0" }}>
              <div style={{ fontSize: 10, color: "#C9C2F0", marginBottom: 8, letterSpacing: "0.06em" }}>RANK LADDER</div>
              {RPG_LEVELS.map(l => (
                <div key={l.title} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, opacity: coins >= l.min ? 1 : 0.3 }}>
                  <span style={{ fontSize: 12 }}>{l.icon}</span>
                  <span style={{ fontSize: 12, color: coins >= l.min ? l.color : "#C9C2F0", fontWeight: coins >= l.min ? 500 : 400 }}>{l.title}</span>
                  {level.title === l.title && <span style={{ fontSize: 10, background: l.bg, color: l.color, padding: "1px 6px", borderRadius: 10, marginLeft: "auto", border: `1px solid ${l.color}33` }}>current</span>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { icon: "🔥", val: `${getStreak()} days`, label: "Current streak",     color: "#C47B2B", bg: "#FEF3E8" },
                { icon: "✅", val: `${actions.filter(a => a.done).length}/${actions.length}`, label: "Tasks done today", color: "#2A7D52", bg: "#E6F4EE" },
                { icon: "🎓", val: "3",                   label: "Videos in progress", color: "#7C6FCD", bg: "#EDE9FB" },
              ].map(s => (
                <div key={s.label} style={{ background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, animation: "fadeUp 0.5s ease both" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <span style={{ color: s.color, fontSize: 20, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{s.val}</span>
                  <span style={{ color: "#9794A8", fontSize: 12, textAlign: "center" }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ ...S.card, animation: "fadeUp 0.5s 0.1s ease both", flex: 1 }}>
              <div style={S.cardTitle}>⚡ Today's Actions</div>
              {actions.map(a => (
                <div key={a.id} className="aw-action" onClick={() => toggleAction(a.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s", opacity: a.done ? 0.6 : 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${a.done ? "#2A7D52" : "#D8D4EC"}`, background: a.done ? "#2A7D52" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    {a.done && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, color: a.done ? "#C9C2F0" : "#1E1B2E", flex: 1, textDecoration: a.done ? "line-through" : "none" }}>{a.icon} {a.label}</span>
                  <span style={{ fontSize: 12, color: "#C47B2B", fontWeight: 500, fontFamily: "'JetBrains Mono',monospace" }}>+{a.coins} 🪙</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={S.bottomRow}>
          <div style={{ ...S.card, flex: "0 0 250px", animation: "fadeUp 0.5s 0.2s ease both" }}>
            <div style={S.cardTitle}>📊 Topic Progress</div>
            {MOCK_TOPICS.map(t => (
              <div key={t.name} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#6B6880", fontSize: 13 }}>{t.name}</span>
                  <span style={{ color: t.color, fontSize: 13, fontWeight: 500, fontFamily: "'JetBrains Mono',monospace" }}>{t.pct}%</span>
                </div>
                <div style={{ height: 6, background: "#F0EEF9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: 3, transition: "width 1.2s ease" }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...S.card, flex: 1, animation: "fadeUp 0.5s 0.25s ease both" }}>
            <div style={S.cardTitle}>▶ Active Videos</div>
            {MOCK_VIDEOS.map(v => (
              <div key={v.title} className="aw-video-card"
                style={{ background: "#F7F6FB", border: "1px solid #E8E4F0", borderRadius: 10, padding: "14px 16px", marginBottom: 10, transition: "all 0.2s", cursor: "pointer" }}
                onClick={() => navigate(v.mode === "Learn" ? "/learn" : "/capture")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: v.color, background: v.bg, padding: "2px 8px", borderRadius: 20, fontWeight: 500, marginBottom: 6, display: "inline-block" }}>{v.mode} Mode</span>
                    <div style={{ color: "#1E1B2E", fontSize: 14, fontWeight: 500 }}>{v.title}</div>
                  </div>
                  <span style={{ color: "#9794A8", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", marginLeft: 12, whiteSpace: "nowrap" }}>{v.chapters || `${v.pct}%`}</span>
                </div>
                <div style={{ height: 4, background: "#F0EEF9", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${v.pct}%`, background: v.color, borderRadius: 2, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
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
  page:      { padding: "32px 40px", maxWidth: 1100, margin: "0 auto", width: "100%" },
  topRow:    { display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" },
  bottomRow: { display: "flex", gap: 16, alignItems: "flex-start" },
  card:      { background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(124,111,205,0.05)" },
  cardTitle: { color: "#1E1B2E", fontSize: 14, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 },
};
