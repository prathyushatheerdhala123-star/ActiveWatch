import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_UNWIND = {
  title: "A Day in My Life as a Developer",
  channel: "TechVlogger",
  duration: "18 min",
  watchedToday: 42, // in minutes
  queue: [
    { id: 1, title: "Morning Routine of a Senior Dev",   duration: "22 min" },
    { id: 2, title: "My Home Office Setup 2024",          duration: "15 min" },
    { id: 3, title: "What I Eat in a Day — Dev Edition", duration: "12 min" },
  ],
};

const MOODS = [
  { id: "tired",       label: "Tired",          emoji: "😴", desc: "Calm, low-effort content",     color: "#185FA5", bg: "#E6F1FB", border: "#BDD4EE" },
  { id: "laugh",       label: "Need a laugh",   emoji: "😂", desc: "Comedy, light entertainment",  color: "#C47B2B", bg: "#FEF3E8", border: "#F0CEAA" },
  { id: "inspiration", label: "Need inspiration", emoji: "✨", desc: "Motivating, uplifting stories", color: "#7C6FCD", bg: "#EDE9FB", border: "#C9C2F0" },
];

const WEEKLY_DIGEST = {
  hours: 8,
  saved: 14,
  chapters: 3,
};

export default function UnwindMode() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [queue, setQueue]               = useState(MOCK_UNWIND.queue);
  const [autoplay, setAutoplay]         = useState(false);
  const [showNudge, setShowNudge]       = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  // Show wind-down nudge after 3 seconds to simulate having watched a while
  useEffect(() => {
    const t = setTimeout(() => {
      if (!nudgeDismissed) setShowNudge(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [nudgeDismissed]);

  function removeFromQueue(id) {
    setQueue(prev => prev.filter(v => v.id !== id));
  }

  function dismissNudge() {
    setShowNudge(false);
    setNudgeDismissed(true);
  }

  function doneForNow() {
    setShowNudge(false);
    navigate("/dashboard");
  }

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .aw-nav-btn:hover{color:#7C6FCD!important;}
        .aw-queue-row:hover{background:#F7F6FB!important;}
        .aw-mood-card:hover{transform:translateY(-2px)!important;}
        .aw-nudge-btn:hover{background:#EDE9FB!important;}
      `}</style>

      {/* WIND-DOWN NUDGE OVERLAY — always dismissable, always their choice */}
      {showNudge && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,14,26,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.4s ease both", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 36, maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🌿</div>
            <h2 style={{ color: "#1E1B2E", fontSize: 20, fontWeight: 600, margin: "0 0 10px", letterSpacing: "-0.3px" }}>You've been watching for 45 minutes</h2>
            <p style={{ color: "#9794A8", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>Take a breath. Step away for a moment. You can always come back — this is just a gentle check-in, not a rule.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={doneForNow}
                style={{ flex: 1, background: "#1E1B2E", border: "none", borderRadius: 10, padding: "12px 0", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Done for now
              </button>
              <button className="aw-nudge-btn" onClick={dismissNudge}
                style={{ flex: 1, background: "#F7F6FB", border: "1px solid #E8E4F0", borderRadius: 10, padding: "12px 0", color: "#6B6880", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                Keep watching
              </button>
            </div>
            <p style={{ color: "#C9C2F0", fontSize: 11, marginTop: 14 }}>Your choice, always. No judgment.</p>
          </div>
        </div>
      )}

      <nav style={S.nav}>
        <div style={S.logo} onClick={() => navigate("/")}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C6FCD" }} />
          <span style={{ color: "#1E1B2E", fontWeight: 600 }}>Active</span>
          <span style={{ color: "#7C6FCD", fontWeight: 600 }}>Watch</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Home", "/"], ["Dashboard", "/dashboard"], ["Grow", "/grow"], ["Collect", "/collect"]].map(([l, p]) => (
            <button key={l} className="aw-nav-btn" onClick={() => navigate(p)}
              style={{ background: "none", border: "none", color: "#9794A8", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>{l}</button>
          ))}
        </div>
      </nav>

      <div style={S.page}>
        {/* HEADER */}
        <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#185FA5", background: "#E6F1FB", padding: "3px 12px", borderRadius: 20, fontWeight: 600, border: "1px solid #BDD4EE" }}>🌿 Unwind Mode</span>
          </div>
          <h1 style={{ color: "#1E1B2E", fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>{MOCK_UNWIND.title}</h1>
          <p style={{ color: "#9794A8", fontSize: 14, margin: 0 }}>{MOCK_UNWIND.channel} · {MOCK_UNWIND.duration}</p>
        </div>

        <div style={S.grid}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* MOOD SELECTOR */}
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.05s ease both" }}>
              <div style={S.cardTitle}>😌 How are you feeling?</div>
              <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 14 }}>We'll match your queue to your mood — no pressure, change it any time.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {MOODS.map(m => (
                  <div key={m.id} className="aw-mood-card"
                    onClick={() => setSelectedMood(m.id === selectedMood ? null : m.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${selectedMood === m.id ? m.border : "#E8E4F0"}`, background: selectedMood === m.id ? m.bg : "#FAFAFA", cursor: "pointer", transition: "all 0.2s" }}>
                    <span style={{ fontSize: 22 }}>{m.emoji}</span>
                    <div>
                      <div style={{ color: selectedMood === m.id ? m.color : "#1E1B2E", fontSize: 14, fontWeight: 600 }}>{m.label}</div>
                      <div style={{ color: "#9794A8", fontSize: 12 }}>{m.desc}</div>
                    </div>
                    {selectedMood === m.id && (
                      <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: 10 }}>✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {selectedMood && (
                <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "#EDE9FB", border: "1px solid #C9C2F0", fontSize: 13, color: "#7C6FCD" }}>
                  ✨ Queue updated to match your mood. Enjoy!
                </div>
              )}
            </div>

            {/* AWARENESS — not punishment, just info */}
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.1s ease both" }}>
              <div style={S.cardTitle}>📊 Today's Awareness</div>
              <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 16 }}>Just so you know — no judgment, no limits.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "#E6F1FB", border: "1px solid #BDD4EE", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ color: "#185FA5", fontWeight: 700, fontSize: 22, fontFamily: "'JetBrains Mono',monospace" }}>{MOCK_UNWIND.watchedToday}</div>
                  <div style={{ color: "#9794A8", fontSize: 12, marginTop: 2 }}>minutes today</div>
                </div>
                <div style={{ flex: 1, background: "#E6F4EE", border: "1px solid #B2D9C4", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ color: "#2A7D52", fontWeight: 700, fontSize: 22, fontFamily: "'JetBrains Mono',monospace" }}>{queue.length}</div>
                  <div style={{ color: "#9794A8", fontSize: 12, marginTop: 2 }}>queued videos</div>
                </div>
              </div>
            </div>

            {/* AUTOPLAY */}
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.15s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={S.cardTitle}>⏸️ Intentional Next</div>
                  <p style={{ color: "#9794A8", fontSize: 13, margin: 0 }}>When off, videos don't auto-play. One tap to continue — your call, always.</p>
                </div>
                <div onClick={() => setAutoplay(!autoplay)}
                  style={{ width: 46, height: 25, borderRadius: 13, background: autoplay ? "#7C6FCD" : "#E8E4F0", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: autoplay ? 23 : 3, width: 19, height: 19, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: autoplay ? "#EDE9FB" : "#E6F4EE", border: `1px solid ${autoplay ? "#C9C2F0" : "#B2D9C4"}`, fontSize: 13, color: autoplay ? "#7C6FCD" : "#2A7D52" }}>
                {autoplay ? "▶ Autoplay on — videos chain automatically." : "⏸ Autoplay off — one tap to continue."}
              </div>
            </div>

            {/* WEEKLY DIGEST */}
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.2s ease both" }}>
              <div style={S.cardTitle}>📋 Weekly Awareness</div>
              <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 16 }}>This week — no judgment, just information.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { val: `${WEEKLY_DIGEST.hours}h`, label: "watched",       color: "#185FA5", bg: "#E6F1FB" },
                  { val: WEEKLY_DIGEST.saved,        label: "moments saved", color: "#2A7D52", bg: "#E6F4EE" },
                  { val: WEEKLY_DIGEST.chapters,     label: "chapters done", color: "#7C6FCD", bg: "#EDE9FB" },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ color: s.color, fontWeight: 700, fontSize: 20, fontFamily: "'JetBrains Mono',monospace" }}>{s.val}</div>
                    <div style={{ color: "#9794A8", fontSize: 11, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ color: "#C9C2F0", fontSize: 12, marginTop: 12, marginBottom: 0, lineHeight: 1.5 }}>
                That's your week — what you do with this info is completely up to you.
              </p>
            </div>
          </div>

          {/* RIGHT — QUEUE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.1s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={S.cardTitle}>📋 Up Next</div>
                <span style={{ fontSize: 12, color: "#185FA5", fontFamily: "'JetBrains Mono',monospace", background: "#E6F1FB", padding: "2px 8px", borderRadius: 20, border: "1px solid #BDD4EE" }}>{queue.length} queued</span>
              </div>
              <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 16 }}>Your next videos — remove anything that doesn't feel right today.</p>
              {queue.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0", color: "#C9C2F0" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  <div style={{ fontSize: 14 }}>Queue is clear</div>
                </div>
              ) : (
                queue.map((v, i) => (
                  <div key={v.id} className="aw-queue-row"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, background: "#FAFAFA", border: "1px solid #E8E4F0", marginBottom: 8, transition: "background 0.15s" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: "#E6F1FB", border: "1px solid #BDD4EE", display: "flex", alignItems: "center", justifyContent: "center", color: "#185FA5", fontWeight: 600, fontSize: 12, flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#1E1B2E", fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{v.title}</div>
                      <div style={{ color: "#9794A8", fontSize: 12 }}>{v.duration}</div>
                    </div>
                    <button onClick={() => removeFromQueue(v.id)}
                      style={{ background: "none", border: "none", color: "#D8D4EC", fontSize: 16, cursor: "pointer", padding: 4, transition: "color 0.2s", lineHeight: 1 }}
                      onMouseEnter={e => e.currentTarget.style.color = "#E24B4A"}
                      onMouseLeave={e => e.currentTarget.style.color = "#D8D4EC"}>✕</button>
                  </div>
                ))
              )}

              <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "#E6F1FB", border: "1px solid #BDD4EE", fontSize: 13, color: "#185FA5", lineHeight: 1.6 }}>
                🌿 Unwind Mode respects that you're a human. No limits, no locks — just you and your content.
              </div>
            </div>

            {/* Trigger nudge manually for demo */}
            {nudgeDismissed && (
              <div style={{ ...S.card, animation: "fadeUp 0.4s ease both" }}>
                <div style={S.cardTitle}>🌿 Wind-Down</div>
                <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 14 }}>Feeling ready for a break? A gentle check-in, always on your terms.</p>
                <button onClick={() => { setNudgeDismissed(false); setShowNudge(true); }}
                  style={{ background: "#E6F1FB", border: "1px solid #BDD4EE", borderRadius: 8, padding: "9px 16px", color: "#185FA5", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                  Show Wind-Down Nudge
                </button>
              </div>
            )}
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
