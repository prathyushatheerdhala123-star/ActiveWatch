import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav.jsx";

const QUEUE = [
  { id: 1, title: "Morning Routine of a Senior Dev",   duration: "22 min" },
  { id: 2, title: "My Home Office Setup 2024",          duration: "15 min" },
  { id: 3, title: "What I Eat in a Day — Dev Edition", duration: "12 min" },
];

const MOODS = [
  { id: "tired",  label: "Tired", desc: "Calm, low-effort content",      color: "#5A7A5C", bg: "#EEF5EE", border: "#C2D9C3" },
  { id: "laugh",  label: "Need a laugh", desc: "Comedy, light entertainment",  color: "#C9952A", bg: "#FDF5E6", border: "#E8D098" },
  { id: "inspo",  label: "Need inspiration", desc: "Uplifting, motivating stories", color: "#C4622D", bg: "#FDF0E8", border: "#F0C4A8" },
];

export default function UnwindMode() {
  const navigate = useNavigate();
  const [mood, setMood]           = useState(null);
  const [queue, setQueue]         = useState(QUEUE);
  const [autoplay, setAutoplay]   = useState(false);
  const [nudge, setNudge]         = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { if (!dismissed) setNudge(true); }, 3000);
    return () => clearTimeout(t);
  }, [dismissed]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .aw-mood:hover{transform:translateY(-2px)!important;}
        .aw-queue-row:hover{background:#F3EDE3!important;}
      `}</style>

      {/* WIND-DOWN NUDGE */}
      {nudge && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.4s ease both", backdropFilter: "blur(6px)" }}>
          <div style={{ background: "#FAF7F2", borderRadius: 22, padding: 40, maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 24px 60px rgba(44,24,16,0.2)" }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🌿</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: "#2C1810", margin: "0 0 12px", letterSpacing: "-0.4px" }}>
              You've been watching for 45 minutes
            </h2>
            <p style={{ color: "#8C7B6B", fontSize: 14, lineHeight: 1.75, margin: "0 0 28px", fontStyle: "italic" }}>
              No pressure, just a gentle check-in. You can always keep watching. This is your time.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setNudge(false); navigate("/dashboard"); }}
                style={{ flex: 1, background: "#2C1810", border: "none", borderRadius: 10, padding: "12px 0", color: "white", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                Done for now
              </button>
              <button onClick={() => { setNudge(false); setDismissed(true); }}
                style={{ flex: 1, background: "#F3EDE3", border: "1px solid #E2D9CE", borderRadius: 10, padding: "12px 0", color: "#5C3D2E", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                Keep watching
              </button>
            </div>
            <p style={{ color: "#B5A898", fontSize: 11, marginTop: 14, fontStyle: "italic" }}>Your choice, always.</p>
          </div>
        </div>
      )}

      <Nav />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 40px" }}>

        <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease both" }}>
          <span style={{ fontSize: 11, color: "#C9952A", background: "#FDF5E6", padding: "3px 12px", borderRadius: 20, fontWeight: 600, border: "1px solid #E8D098", textTransform: "uppercase", letterSpacing: "0.04em" }}>🌿 Unwind Mode</span>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 500, color: "#2C1810", margin: "10px 0 4px", letterSpacing: "-0.4px" }}>A Day in My Life as a Developer</h1>
          <p style={{ color: "#8C7B6B", fontSize: 14, margin: 0, fontStyle: "italic" }}>TechVlogger · 18 min</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* MOOD */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.05s ease both" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 6 }}>How are you feeling?</div>
              <p style={{ color: "#8C7B6B", fontSize: 13, marginBottom: 16, fontStyle: "italic" }}>We'll match your queue. Change it any time, no biggie.</p>
              {MOODS.map(m => (
                <div key={m.id} className="aw-mood"
                  onClick={() => setMood(m.id === mood ? null : m.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${mood === m.id ? m.border : "#E2D9CE"}`, background: mood === m.id ? m.bg : "#FAF7F2", cursor: "pointer", transition: "all 0.2s", marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: mood === m.id ? m.color : "#2C1810", fontSize: 14, fontWeight: 500 }}>{m.label}</div>
                    <div style={{ color: "#B5A898", fontSize: 12 }}>{m.desc}</div>
                  </div>
                  {mood === m.id && <div style={{ width: 16, height: 16, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontSize: 9 }}>✓</span></div>}
                </div>
              ))}
              {mood && <div style={{ padding: "10px 14px", background: "#EEF5EE", border: "1px solid #C2D9C3", borderRadius: 10, fontSize: 13, color: "#5A7A5C" }}>✨ Queue updated to match your mood</div>}
            </div>

            {/* AWARENESS */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.1s ease both" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 6 }}>Today's awareness</div>
              <p style={{ color: "#8C7B6B", fontSize: 13, marginBottom: 16, fontStyle: "italic" }}>Just so you know... no judgment, no limits.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, background: "#FDF5E6", border: "1px solid #E8D098", borderRadius: 12, padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "#C9952A", fontWeight: 500 }}>42</div>
                  <div style={{ color: "#8C7B6B", fontSize: 12, marginTop: 3 }}>minutes today</div>
                </div>
                <div style={{ flex: 1, background: "#EEF5EE", border: "1px solid #C2D9C3", borderRadius: 12, padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "#5A7A5C", fontWeight: 500 }}>{queue.length}</div>
                  <div style={{ color: "#8C7B6B", fontSize: 12, marginTop: 3 }}>queued</div>
                </div>
              </div>
            </div>

            {/* INTENTIONAL NEXT */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.15s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 4 }}>Intentional next</div>
                  <p style={{ color: "#8C7B6B", fontSize: 13, margin: 0, fontStyle: "italic", maxWidth: 200 }}>When off, videos don't autoplay. One tap to continue always your call.</p>
                </div>
                <div onClick={() => setAutoplay(!autoplay)}
                  style={{ width: 44, height: 24, borderRadius: 12, background: autoplay ? "#C4622D" : "#E2D9CE", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: autoplay ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }} />
                </div>
              </div>
            </div>

            {/* WEEKLY DIGEST */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.2s ease both" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 6 }}>This week</div>
              <p style={{ color: "#8C7B6B", fontSize: 13, marginBottom: 16, fontStyle: "italic" }}>Pure information... what you do with it is up to you.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[["8h", "watched"], ["14", "saved"], ["3", "chapters"]].map(([v, l]) => (
                  <div key={l} style={{ background: "#FAF7F2", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#2C1810", fontWeight: 500 }}>{v}</div>
                    <div style={{ color: "#B5A898", fontSize: 11, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — QUEUE */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.08s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500 }}>Up next</div>
                <span style={{ fontSize: 12, color: "#C9952A", fontFamily: "'DM Mono',monospace", background: "#FDF5E6", padding: "2px 8px", borderRadius: 20, border: "1px solid #E8D098" }}>{queue.length} queued</span>
              </div>
              <p style={{ color: "#8C7B6B", fontSize: 13, marginBottom: 18, fontStyle: "italic" }}>Remove anything that doesn't feel right today.</p>

              {queue.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0", color: "#B5A898" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15 }}>Queue is clear</div>
                </div>
              ) : queue.map((v, i) => (
                <div key={v.id} className="aw-queue-row"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, background: "#FAF7F2", border: "1px solid #E2D9CE", marginBottom: 8, transition: "background 0.15s" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "#FDF5E6", border: "1px solid #E8D098", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9952A", fontWeight: 600, fontSize: 11, flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#2C1810", fontSize: 13, fontWeight: 500 }}>{v.title}</div>
                    <div style={{ color: "#B5A898", fontSize: 11, marginTop: 2 }}>{v.duration}</div>
                  </div>
                  <button onClick={() => setQueue(prev => prev.filter(x => x.id !== v.id))}
                    style={{ background: "none", border: "none", color: "#D1C4B8", fontSize: 15, cursor: "pointer", padding: 4, transition: "color 0.2s", lineHeight: 1 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#C4622D"}
                    onMouseLeave={e => e.currentTarget.style.color = "#D1C4B8"}>✕</button>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "#EEF5EE", border: "1px solid #C2D9C3", fontSize: 13, color: "#5A7A5C", lineHeight: 1.6, fontStyle: "italic" }}>
                🌿 Unwind Mode respects that you're a human who sometimes just needs to switch off.
              </div>
            </div>

            {dismissed && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 10 }}>Wind-down</div>
                <p style={{ color: "#8C7B6B", fontSize: 13, marginBottom: 14, fontStyle: "italic" }}>Feeling ready for a gentle break?</p>
                <button onClick={() => { setDismissed(false); setNudge(true); }}
                  style={{ background: "#EEF5EE", border: "1px solid #C2D9C3", borderRadius: 10, padding: "10px 16px", color: "#5A7A5C", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                  Show wind-down nudge
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}