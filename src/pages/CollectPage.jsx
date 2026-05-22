import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav.jsx";

const MOCK = {
  title: "How to Build Deep Work Habits — Cal Newport",
  duration: "1h 12m",
  summary: "Cal Newport argues that deep focus — uninterrupted, cognitively demanding work — is becoming increasingly rare and more valuable. He breaks down why most people default to shallow, reactive work and how deliberately protecting your attention is the core skill of high performers.",
  takeaways: [
    "Deep work is the ability to focus without distraction on a cognitively demanding task.",
    "Most people never practise deep focus — those who do have a real competitive edge.",
    "Schedule focus blocks like meetings — put them in your calendar and protect them.",
    "Your attention is a muscle. Every unnecessary task switch weakens it.",
    "Boredom is training. Resist reaching for your phone in idle moments.",
    "Email and Slack feel productive but rarely create real value.",
  ],
  actions: [
    { id: 1, text: "Block 2 hours of deep work on your calendar tomorrow morning", done: false },
    { id: 2, text: "Turn off all notifications during your next focus block",        done: false },
    { id: 3, text: "Pick ONE cognitively demanding task to tackle this week",         done: false },
    { id: 4, text: "Leave your phone in another room during your next session",       done: false },
    { id: 5, text: "At end of day: log how many hours were deep vs shallow",          done: false },
  ],
};

const INIT_MOMENTS = [
  { id: 1, ts: "4:22",  note: "Schedule deep work like a meeting",              collection: "Productivity" },
  { id: 2, ts: "12:08", note: "Attention is a muscle — every task switch weakens it", collection: "Productivity" },
  { id: 3, ts: "28:45", note: "Boredom is training — resist the phone",          collection: "Mindset" },
];

export default function CollectPage() {
  const navigate = useNavigate();
  const [actions, setActions]         = useState(MOCK.actions);
  const [moments, setMoments]         = useState(INIT_MOMENTS);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [exporting, setExporting]     = useState("");
  const [exported, setExported]       = useState("");

  const doneCount = actions.filter(a => a.done).length;

  async function tapSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setMoments(prev => [{ id: prev.length + 1, ts: "38:12", note: "New saved moment", collection: "Productivity" }, ...prev]);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleExport(key) {
    setExporting(key);
    await new Promise(r => setTimeout(r, 1500));
    setExporting(""); setExported(key);
    setTimeout(() => setExported(""), 3500);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
        .aw-action-row:hover{background:#F3EDE3!important;}
        .aw-moment-card:hover{border-color:#C4622D!important;transform:translateY(-2px);}
        .aw-export-btn:hover:not(:disabled){transform:translateY(-1px);}
      `}</style>

      <Nav />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#C4622D", background: "#FDF0E8", padding: "3px 12px", borderRadius: 20, fontWeight: 600, border: "1px solid #F0C4A8", letterSpacing: "0.04em", textTransform: "uppercase" }}>📌 Collect Mode</span>
            <span style={{ color: "#B5A898", fontSize: 13 }}>{MOCK.duration}</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: "#2C1810", margin: "0 0 12px", letterSpacing: "-0.3px" }}>{MOCK.title}</h1>

          {/* Actions row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={tapSave} disabled={saving}
              style={{ background: saved ? "#EEF5EE" : "#C4622D", border: `1px solid ${saved ? "#C2D9C3" : "#C4622D"}`, borderRadius: 8, padding: "8px 16px", color: saved ? "#5A7A5C" : "white", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
              {saving ? <><span style={{ width: 11, height: 11, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Saving…</> : saved ? "✅ Saved!" : "📌 Save this moment"}
            </button>
            {[{ key: "notion", label: "Export to Notion", icon: "🗒️" }, { key: "gdocs", label: "Google Docs", icon: "📄" }].map(e => (
              <button key={e.key} className="aw-export-btn" onClick={() => handleExport(e.key)} disabled={!!exporting}
                style={{ background: exported === e.key ? "#EEF5EE" : "white", border: `1px solid ${exported === e.key ? "#C2D9C3" : "#E2D9CE"}`, borderRadius: 8, padding: "8px 14px", color: exported === e.key ? "#5A7A5C" : "#8C7B6B", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                {exporting === e.key ? <><span style={{ width: 11, height: 11, border: "2px solid #E2D9CE", borderTopColor: "#C4622D", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Exporting…</> : exported === e.key ? "✅ Exported!" : <>{e.icon} {e.label}</>}
              </button>
            ))}
          </div>
        </div>

        {/* RE-SURFACE BANNER */}
        <div style={{ background: "#FDF0E8", border: "1px solid #F0C4A8", borderRadius: 12, padding: "12px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeUp 0.4s 0.05s ease both" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <div>
              <div style={{ color: "#C4622D", fontSize: 13, fontWeight: 500 }}>You saved a moment from this topic 2 weeks ago</div>
              <div style={{ color: "#8C7B6B", fontSize: 12, fontStyle: "italic" }}>"The Pomodoro Technique" — still want to revisit it?</div>
            </div>
          </div>
          <button style={{ background: "#C4622D", border: "none", borderRadius: 8, padding: "6px 14px", color: "white", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>View →</button>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* LEFT */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>

            {/* SAVED MOMENTS SHELF */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.08s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500 }}>📚 Saved Moments</div>
                <span style={{ fontSize: 12, color: "#5A7A5C", background: "#EEF5EE", padding: "2px 8px", borderRadius: 20, border: "1px solid #C2D9C3", fontFamily: "'DM Mono',monospace" }}>{moments.length} saved</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                {moments.map(m => (
                  <div key={m.id} className="aw-moment-card"
                    style={{ background: "#FAF7F2", border: "1px solid #E2D9CE", borderRadius: 12, overflow: "hidden", transition: "all 0.2s", cursor: "pointer", animation: "popIn 0.3s ease both" }}>
                    <div style={{ height: 72, background: "linear-gradient(135deg, #FDF0E8 0%, #EEF5EE 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <span style={{ fontSize: 22 }}>📌</span>
                      <span style={{ position: "absolute", bottom: 5, right: 7, fontSize: 10, color: "#8C7B6B", background: "rgba(255,255,255,0.8)", padding: "1px 6px", borderRadius: 6, fontFamily: "'DM Mono',monospace" }}>{m.ts}</span>
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ color: "#2C1810", fontSize: 12, lineHeight: 1.5, margin: "0 0 7px" }}>{m.note}</p>
                      <span style={{ fontSize: 10, color: "#C4622D", background: "#FDF0E8", padding: "1px 7px", borderRadius: 10 }}>{m.collection}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI SUMMARY */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.12s ease both" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 14 }}>🤖 Summary</div>
              <p style={{ color: "#5C3D2E", lineHeight: 1.85, fontSize: 14, margin: 0 }}>{MOCK.summary}</p>
            </div>

            {/* TAKEAWAYS */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, animation: "fadeUp 0.4s 0.16s ease both" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 16 }}>💡 Key Takeaways</div>
              {MOCK.takeaways.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FDF0E8", border: "1px solid #F0C4A8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#C4622D", flexShrink: 0, fontFamily: "'DM Mono',monospace", marginTop: 1 }}>{i + 1}</div>
                  <p style={{ color: "#5C3D2E", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — ACTION ITEMS */}
          <div style={{ width: 290, flexShrink: 0 }}>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 22, position: "sticky", top: 80, animation: "fadeUp 0.4s 0.18s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500 }}>✅ Actions</div>
                <span style={{ fontSize: 12, color: "#5A7A5C", fontFamily: "'DM Mono',monospace", background: "#EEF5EE", padding: "2px 8px", borderRadius: 20, border: "1px solid #C2D9C3" }}>{doneCount}/{actions.length}</span>
              </div>
              <div style={{ height: 4, background: "#F3EDE3", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(doneCount / actions.length) * 100}%`, background: "#C4622D", borderRadius: 2, transition: "width 0.4s ease" }} />
              </div>
              {actions.map(a => (
                <div key={a.id} className="aw-action-row"
                  onClick={() => setActions(prev => prev.map(x => x.id === a.id ? { ...x, done: !x.done } : x))}
                  style={{ display: "flex", gap: 10, padding: "9px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s", alignItems: "flex-start" }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${a.done ? "#5A7A5C" : "#E2D9CE"}`, background: a.done ? "#5A7A5C" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", marginTop: 2 }}>
                    {a.done && <span style={{ color: "white", fontSize: 9 }}>✓</span>}
                  </div>
                  <p style={{ color: a.done ? "#B5A898" : "#5C3D2E", fontSize: 13, lineHeight: 1.5, margin: 0, textDecoration: a.done ? "line-through" : "none" }}>{a.text}</p>
                </div>
              ))}
              {doneCount === actions.length && (
                <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#EEF5EE", border: "1px solid #C2D9C3", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>🎉</div>
                  <div style={{ color: "#5A7A5C", fontSize: 13, fontWeight: 500 }}>All done!</div>
                  <div style={{ color: "#8C7B6B", fontSize: 12, marginTop: 2 }}>+25 🪙 earned</div>
                </div>
              )}
              {moments.length >= 2 && doneCount === 0 && (
                <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "#FDF0E8", border: "1px solid #F0C4A8" }}>
                  <div style={{ color: "#C4622D", fontSize: 12, fontWeight: 500, marginBottom: 3 }}>Feeling inspired?</div>
                  <div style={{ color: "#8C7B6B", fontSize: 12, lineHeight: 1.5, fontStyle: "italic" }}>You've saved {moments.length} moments — ready to act on one?</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}