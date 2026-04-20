import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_CAPTURE = {
  title: "How to Build Deep Work Habits — Cal Newport",
  duration: "1h 12m",
  summary: "Cal Newport argues that the ability to focus without distraction — what he calls 'deep work' — is becoming increasingly rare and simultaneously more valuable in the knowledge economy. He walks through why most professionals default to shallow, reactive work and how deliberately scheduling blocks of uninterrupted focus is the core skill separating top performers from the rest.",
  takeaways: [
    "Deep work is the ability to focus without distraction on a cognitively demanding task.",
    "Most people never practise deep focus — those who do have a significant competitive advantage.",
    "Schedule deep work blocks like meetings: put them in your calendar and protect them.",
    "Your attention is a muscle. Every unnecessary task switch weakens it.",
    "Boredom is training. Resist reaching for your phone in idle moments.",
    "Email and Slack feel productive but rarely produce real value. Audit your time.",
  ],
  actions: [
    { id: 1, text: "Block 2 hours of deep work on your calendar for tomorrow morning", done: false },
    { id: 2, text: "Turn off all Slack/email notifications during deep work blocks",   done: false },
    { id: 3, text: "Pick ONE cognitively demanding task to tackle this week",          done: false },
    { id: 4, text: "Leave your phone in another room during your next focus session",  done: false },
    { id: 5, text: "At end of day: log how many hours were deep vs shallow",           done: false },
  ],
};

export default function CapturePage() {
  const navigate   = useNavigate();
  const [actions, setActions]     = useState(MOCK_CAPTURE.actions);
  const [exporting, setExporting] = useState("");
  const [exported, setExported]   = useState("");
  const [exportMsg, setExportMsg] = useState("");

  function toggleAction(id) {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  }

  async function handleExport(target) {
    setExporting(target);
    setExportMsg("");
    // Simulate export delay
    await new Promise(r => setTimeout(r, 1600));
    setExporting("");
    setExported(target);
    setExportMsg(
      target === "notion"
        ? "Saved to your Notion workspace — check 'ActiveWatch Captures' page."
        : "Saved to Google Docs — check your Drive under 'ActiveWatch'."
    );
    setTimeout(() => { setExported(""); setExportMsg(""); }, 4000);
  }

  const doneCount = actions.filter(a => a.done).length;

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .aw-nav-btn:hover{color:#7C6FCD!important;}
        .aw-action-row:hover{background:#F7F6FB!important;}
        .aw-export-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.08)!important;}
        .aw-export-btn:disabled{opacity:0.7;cursor:wait;}
      `}</style>

      <nav style={S.nav}>
        <div style={S.logo} onClick={() => navigate("/")}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C6FCD" }} />
          <span style={{ color: "#1E1B2E", fontWeight: 600 }}>Active</span>
          <span style={{ color: "#7C6FCD", fontWeight: 600 }}>Watch</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Home", "/"], ["Learn", "/learn"], ["Dashboard", "/dashboard"]].map(([l, p]) => (
            <button key={l} className="aw-nav-btn" onClick={() => navigate(p)}
              style={{ background: "none", border: "none", color: "#9794A8", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>{l}</button>
          ))}
        </div>
      </nav>

      <div style={S.page}>
        {/* HEADER CARD */}
        <div style={{ ...S.card, marginBottom: 20, animation: "fadeUp 0.4s ease both", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, background: "#E6F4EE", border: "1px solid #B2D9C4", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📼</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#2A7D52", background: "#E6F4EE", padding: "2px 10px", borderRadius: 20, fontWeight: 600, border: "1px solid #B2D9C4" }}>📋 Capture Mode</span>
                <span style={{ fontSize: 12, color: "#9794A8" }}>{MOCK_CAPTURE.duration}</span>
              </div>
              <h1 style={{ color: "#1E1B2E", fontSize: 17, fontWeight: 600, margin: 0 }}>{MOCK_CAPTURE.title}</h1>
            </div>
          </div>
          {/* Export buttons */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "notion", label: "Export to Notion",      bg: "#F7F6FB", border: "#D8D4EC", icon: "🗒️", successBorder: "#B2D9C4", successBg: "#E6F4EE", successColor: "#2A7D52" },
                { key: "gdocs",  label: "Export to Google Docs",  bg: "#F0F4FF", border: "#C5D0EE", icon: "📄", successBorder: "#B2D9C4", successBg: "#E6F4EE", successColor: "#2A7D52" },
              ].map(e => (
                <button key={e.key} className="aw-export-btn" onClick={() => handleExport(e.key)} disabled={!!exporting}
                  style={{ background: exported === e.key ? e.successBg : e.bg, border: `1px solid ${exported === e.key ? e.successBorder : e.border}`, borderRadius: 8, padding: "9px 14px", color: exported === e.key ? e.successColor : "#6B6880", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                  {exporting === e.key
                    ? <><span style={{ width: 12, height: 12, border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#7C6FCD", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Exporting…</>
                    : exported === e.key
                      ? <>✅ Exported!</>
                      : <>{e.icon} {e.label}</>}
                </button>
              ))}
            </div>
            {exportMsg && (
              <div style={{ fontSize: 12, color: "#2A7D52", background: "#E6F4EE", border: "1px solid #B2D9C4", padding: "6px 12px", borderRadius: 8, animation: "slideIn 0.3s ease" }}>
                {exportMsg}
              </div>
            )}
          </div>
        </div>

        <div style={S.twoCol}>
          {/* LEFT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.1s ease both" }}>
              <div style={S.sectionTitle}>🤖 AI Summary</div>
              <p style={{ color: "#6B6880", lineHeight: 1.8, fontSize: 15, margin: 0 }}>{MOCK_CAPTURE.summary}</p>
            </div>

            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.15s ease both" }}>
              <div style={S.sectionTitle}>💡 Key Takeaways</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MOCK_CAPTURE.takeaways.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#EDE9FB", border: "1px solid #C9C2F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#7C6FCD", flexShrink: 0, fontFamily: "'JetBrains Mono',monospace", marginTop: 1 }}>{i + 1}</div>
                    <p style={{ color: "#6B6880", fontSize: 14, lineHeight: 1.65, margin: 0 }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — ACTION ITEMS */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <div style={{ ...S.card, animation: "fadeUp 0.4s 0.2s ease both", position: "sticky", top: 80 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={S.sectionTitle}>✅ Action Items</div>
                <span style={{ fontSize: 12, color: "#2A7D52", fontFamily: "'JetBrains Mono',monospace", background: "#E6F4EE", padding: "2px 8px", borderRadius: 20, border: "1px solid #B2D9C4" }}>
                  {doneCount}/{actions.length}
                </span>
              </div>
              <div style={{ height: 4, background: "#F0EEF9", borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(doneCount / actions.length) * 100}%`, background: "#7C6FCD", borderRadius: 2, transition: "width 0.4s ease" }} />
              </div>
              {actions.map(a => (
                <div key={a.id} className="aw-action-row" onClick={() => toggleAction(a.id)}
                  style={{ display: "flex", gap: 10, padding: "10px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s", alignItems: "flex-start" }}>
                  <div style={{ width: 17, height: 17, borderRadius: 4, border: `1.5px solid ${a.done ? "#2A7D52" : "#D8D4EC"}`, background: a.done ? "#2A7D52" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", marginTop: 1 }}>
                    {a.done && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
                  </div>
                  <p style={{ color: a.done ? "#C9C2F0" : "#6B6880", fontSize: 13, lineHeight: 1.5, margin: 0, textDecoration: a.done ? "line-through" : "none", transition: "all 0.2s" }}>{a.text}</p>
                </div>
              ))}

              {doneCount === actions.length && (
                <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "#E6F4EE", border: "1px solid #B2D9C4", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🎉</div>
                  <div style={{ color: "#2A7D52", fontSize: 13, fontWeight: 500 }}>All actions complete!</div>
                  <div style={{ color: "#9794A8", fontSize: 12, marginTop: 2 }}>+25 🪙 coins earned</div>
                </div>
              )}

              <button onClick={() => handleExport("notion")} disabled={!!exporting} className="aw-export-btn"
                style={{ width: "100%", marginTop: 14, background: "#F7F6FB", border: "1px solid #D8D4EC", borderRadius: 8, padding: 10, color: "#6B6880", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                🗒️ Save to Notion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  root:         { minHeight: "100vh", background: "#F7F6FB", fontFamily: "'Space Grotesk',sans-serif", color: "#6B6880", display: "flex", flexDirection: "column" },
  nav:          { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #E8E4F0", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
  logo:         { display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" },
  page:         { padding: "28px 40px", maxWidth: 1100, margin: "0 auto", width: "100%" },
  twoCol:       { display: "flex", gap: 16, alignItems: "flex-start" },
  card:         { background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(124,111,205,0.05)" },
  sectionTitle: { color: "#1E1B2E", fontSize: 14, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 },
};
