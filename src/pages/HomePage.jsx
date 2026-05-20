import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveVideo } from "../api.js";

const MODE_META = {
  grow:    { label: "Grow Mode",    color: "#7C6FCD", bg: "#EDE9FB", border: "#C9C2F0", icon: "🎓" },
  collect: { label: "Collect Mode", color: "#2A7D52", bg: "#E6F4EE", border: "#B2D9C4", icon: "📌" },
  unwind:  { label: "Unwind Mode",  color: "#C47B2B", bg: "#FEF3E8", border: "#F0CEAA", icon: "🌿" },
};

function Typewriter({ words }) {
  const [idx, setIdx]     = useState(0);
  const [shown, setShown] = useState("");
  const [del, setDel]     = useState(false);
  useEffect(() => {
    const word = words[idx]; let t;
    if (!del && shown.length < word.length)         t = setTimeout(() => setShown(word.slice(0, shown.length + 1)), 80);
    else if (!del && shown.length === word.length)  t = setTimeout(() => setDel(true), 1800);
    else if (del && shown.length > 0)               t = setTimeout(() => setShown(shown.slice(0, -1)), 45);
    else { setDel(false); setIdx((idx + 1) % words.length); }
    return () => clearTimeout(t);
  }, [shown, del, idx, words]);
  return <span style={{ color: "#7C6FCD" }}>{shown}<span style={{ animation: "blink 1s step-end infinite", color: "#7C6FCD" }}>|</span></span>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSave() {
    if (!url.trim()) { setError("Please paste a YouTube URL first."); return; }
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) { setError("That doesn't look like a YouTube link."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const data = await saveVideo(url);
      setResult(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const routeTo = m => m === "grow" ? "/grow" : m === "collect" ? "/collect" : "/unwind";
  const meta    = result ? MODE_META[result.mode] : null;

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .aw-save-btn:hover:not(:disabled){background:#6358B5!important;transform:translateY(-1px);}
        .aw-save-btn:disabled{opacity:0.6;cursor:not-allowed;}
        .aw-url-input:focus{border-color:#7C6FCD!important;box-shadow:0 0 0 3px rgba(124,111,205,0.12)!important;outline:none;}
        .aw-nav-btn:hover{color:#7C6FCD!important;}
        .aw-mode-card:hover{border-color:#C9C2F0!important;background:#FFFFFF!important;transform:translateY(-2px);}
        .aw-open-btn:hover{background:#EDE9FB!important;}
      `}</style>

      <nav style={S.nav}>
        <div style={S.logo}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C6FCD" }} />
          <span style={{ color: "#1E1B2E", fontWeight: 600 }}>Active</span>
          <span style={{ color: "#7C6FCD", fontWeight: 600 }}>Watch</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["Dashboard", "/dashboard"], ["Grow", "/grow"], ["Collect", "/collect"]].map(([l, p]) => (
            <button key={l} className="aw-nav-btn" onClick={() => navigate(p)}
              style={{ background: "none", border: "none", color: "#9794A8", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>{l}</button>
          ))}
        </div>
      </nav>

      <main style={S.main}>
        <div style={{ animation: "fadeUp 0.6s ease both", textAlign: "center" }}>
          <div style={S.pill}>✦ AI-Powered Learning Platform</div>
          <h1 style={S.h1}>Watch smarter.<br />Learn <Typewriter words={["faster.", "deeper.", "actively.", "intentionally."]} /></h1>
          <p style={S.sub}>Paste any YouTube link. AI classifies it and turns it into a structured learning experience — quizzes, code challenges, and action items.</p>
        </div>

        <div style={{ ...S.card, animation: "fadeUp 0.6s 0.15s ease both" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#C9C2F0" }}>▶</span>
              <input
                ref={inputRef}
                className="aw-url-input"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSave()}
                placeholder="https://youtube.com/watch?v=..."
                style={S.input}
              />
            </div>
            <button className="aw-save-btn" onClick={handleSave} disabled={loading} style={S.btnSave}>
              {loading
                ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Analysing…
                  </span>
                : "Save to ActiveWatch →"}
            </button>
          </div>
          {error && <p style={{ color: "#E24B4A", fontSize: 13, marginTop: 8 }}>{error}</p>}

          {result && meta && (
            <div style={{ ...S.resultBox, borderColor: meta.border, background: meta.bg, animation: "slideIn 0.4s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: meta.color, background: "rgba(255,255,255,0.6)", padding: "3px 10px", borderRadius: 20, border: `1px solid ${meta.border}` }}>
                    {meta.icon} {meta.label}
                  </span>
                  <p style={{ color: "#1E1B2E", fontWeight: 500, margin: "10px 0 4px", fontSize: 15 }}>{result.title}</p>
                  {result.chapters && <p style={{ color: "#9794A8", fontSize: 13 }}>{result.chapters.length} chapters detected</p>}
                </div>
                <button className="aw-open-btn" onClick={() => navigate(routeTo(result.mode))}
                  style={{ background: "white", border: `1px solid ${meta.border}`, color: meta.color, borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                  Open {meta.label} →
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ ...S.modeGrid, animation: "fadeUp 0.6s 0.3s ease both" }}>
          {[
            { icon: "🎓", title: "Grow Mode",    color: "#7C6FCD", bg: "#EDE9FB", border: "#C9C2F0", desc: "Chapters, MCQs & coding challenges. Unlock as you go. Earn coins. Build your Knowledge Graph.", tag: "Tutorials" },
            { icon: "📌", title: "Collect Mode", color: "#2A7D52", bg: "#E6F4EE", border: "#B2D9C4", desc: "Save beautiful moments with one tap. Visual shelves. Smart re-surfacing at the right moment.", tag: "Lifestyle"  },
            { icon: "🌿", title: "Unwind Mode",  color: "#C47B2B", bg: "#FEF3E8", border: "#F0CEAA", desc: "Gentle wind-down nudges. Mood-based queue. Weekly awareness digest. No guilt, no hard stops.", tag: "Vlogs"     },
          ].map(m => (
            <div key={m.title} className="aw-mode-card"
              style={{ background: "#FAFAFA", border: `1px solid #E8E4F0`, borderRadius: 12, padding: 18, transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{m.icon}</div>
                <span style={{ fontSize: 11, color: m.color, background: m.bg, padding: "2px 8px", borderRadius: 20, fontWeight: 500, border: `1px solid ${m.border}` }}>{m.tag}</span>
              </div>
              <div style={{ color: "#1E1B2E", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{m.title}</div>
              <div style={{ color: "#9794A8", fontSize: 13, lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, width: "100%", animation: "fadeUp 0.6s 0.45s ease both" }}>
          {[["🔥", "1,240+", "Active learners"], ["⚡", "50k+", "Videos processed"], ["🏆", "98%", "Completion rate"], ["🪙", "Coins", "Reward system"]].map(([icon, val, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 10, padding: "14px 8px" }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ color: "#1E1B2E", fontWeight: 600, fontSize: 16 }}>{val}</span>
              <span style={{ color: "#9794A8", fontSize: 12 }}>{label}</span>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "20px", fontSize: 13, color: "#C9C2F0", borderTop: "1px solid #E8E4F0" }}>
        <span style={{ color: "#7C6FCD" }}>⚡ ActiveWatch</span>
        <span style={{ color: "#E8E4F0", margin: "0 12px" }}>·</span>
        <span>Built for the ideathon · {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

const S = {
  root:      { minHeight: "100vh", background: "#F7F6FB", fontFamily: "'Space Grotesk',sans-serif", color: "#6B6880", display: "flex", flexDirection: "column" },
  nav:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", borderBottom: "1px solid #E8E4F0", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10 },
  logo:      { display: "flex", alignItems: "center", gap: 6, fontSize: 18, fontFamily: "'JetBrains Mono',monospace" },
  main:      { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px 48px", maxWidth: 720, margin: "0 auto", width: "100%" },
  pill:      { display: "inline-block", background: "#EDE9FB", border: "1px solid #C9C2F0", color: "#7C6FCD", fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 20, letterSpacing: "0.04em", marginBottom: 24 },
  h1:        { fontSize: "clamp(32px,5vw,52px)", fontWeight: 600, color: "#1E1B2E", lineHeight: 1.15, margin: "0 0 20px", textAlign: "center", letterSpacing: "-1px" },
  sub:       { fontSize: 16, color: "#9794A8", lineHeight: 1.7, textAlign: "center", maxWidth: 520, margin: "0 0 40px" },
  card:      { width: "100%", background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 16, padding: 20, marginBottom: 28, boxShadow: "0 1px 4px rgba(124,111,205,0.06)" },
  input:     { width: "100%", background: "#F7F6FB", border: "1px solid #D8D4EC", borderRadius: 10, padding: "13px 16px 13px 40px", color: "#1E1B2E", fontSize: 14, fontFamily: "'JetBrains Mono',monospace", transition: "border-color 0.2s,box-shadow 0.2s", boxSizing: "border-box" },
  btnSave:   { background: "#7C6FCD", border: "none", borderRadius: 10, padding: "13px 22px", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", boxShadow: "0 4px 14px rgba(124,111,205,0.3)" },
  resultBox: { marginTop: 16, borderRadius: 12, padding: 16, border: "1px solid" },
  modeGrid:  { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, width: "100%", marginBottom: 28 },
};
