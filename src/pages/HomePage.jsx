import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveVideo } from "../api.js";
import Nav from "../Nav.jsx";

const MODE_META = {
  grow:    { label: "Grow Mode",    color: "#5A7A5C", bg: "#EEF5EE", border: "#C2D9C3", icon: "🌱", route: "/grow" },
  collect: { label: "Collect Mode", color: "#C4622D", bg: "#FDF0E8", border: "#F0C4A8", icon: "📌", route: "/collect" },
  unwind:  { label: "Unwind Mode",  color: "#C9952A", bg: "#FDF5E6", border: "#E8D098", icon: "🌿", route: "/unwind" },
};

function Typewriter({ words }) {
  const [idx, setIdx]     = useState(0);
  const [shown, setShown] = useState("");
  const [del, setDel]     = useState(false);
  useEffect(() => {
    const word = words[idx]; let t;
    if (!del && shown.length < word.length)        t = setTimeout(() => setShown(word.slice(0, shown.length + 1)), 85);
    else if (!del && shown.length === word.length) t = setTimeout(() => setDel(true), 2000);
    else if (del && shown.length > 0)              t = setTimeout(() => setShown(shown.slice(0, -1)), 50);
    else { setDel(false); setIdx((idx + 1) % words.length); }
    return () => clearTimeout(t);
  }, [shown, del, idx, words]);
  return (
    <em style={{ color: "#C4622D", fontStyle: "italic", fontWeight: 300 }}>
      {shown}<span style={{ animation: "blink 1s step-end infinite", color: "#C4622D" }}>|</span>
    </em>
  );
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
    if (!url.trim()) { setError("Paste a YouTube URL first."); return; }
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) { setError("That doesn't look like a YouTube link."); return; }
    setError(""); setLoading(true); setResult(null);
    try { setResult(await saveVideo(url)); }
    catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  const meta = result ? MODE_META[result.mode] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .aw-url-input:focus{border-color:#C4622D!important;box-shadow:0 0 0 3px rgba(196,98,45,0.1)!important;outline:none;}
        .aw-submit:hover:not(:disabled){background:#A8501F!important;transform:translateY(-1px);}
        .aw-submit:disabled{opacity:0.55;cursor:not-allowed;}
        .aw-mode-pill:hover{border-color:#C4622D!important;color:#C4622D!important;transform:translateY(-1px);}
        .aw-open-btn:hover{background:#C4622D!important;color:white!important;}
      `}</style>

      <Nav />

      <main style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "72px 24px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>

        {/* Hero */}
        <div style={{ textAlign: "center", animation: "fadeUp 0.7s ease both", marginBottom: 52 }}>
          <div style={{
            display: "inline-block",
            background: "#FDF0E8",
            border: "1px solid #F0C4A8",
            color: "#C4622D",
            fontSize: 12,
            fontWeight: 500,
            padding: "5px 14px",
            borderRadius: 20,
            marginBottom: 28,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            AI-Powered Learning
          </div>

          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(38px, 6vw, 62px)",
            fontWeight: 300,
            color: "#2C1810",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            margin: "0 0 22px",
          }}>
            Watch smarter.<br />
            Learn <Typewriter words={["faster.", "deeper.", "actively.", "intentionally."]} />
          </h1>

          <p style={{
            fontSize: 17,
            color: "#8C7B6B",
            lineHeight: 1.75,
            maxWidth: 480,
            margin: "0 auto",
            fontWeight: 300,
          }}>
            Paste any YouTube link. We figure out what kind of video it is and build the right experience around it — automatically.
          </p>
        </div>

        {/* URL Input Card */}
        <div style={{
          width: "100%",
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: 24,
          marginBottom: 32,
          boxShadow: "0 2px 20px rgba(44,24,16,0.06)",
          animation: "fadeUp 0.7s 0.1s ease both",
        }}>
          <div style={{ display: "flex", gap: 10, marginBottom: error ? 10 : 0 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%",
                transform: "translateY(-50%)",
                color: "#B5A898", fontSize: 14,
              }}>▶</span>
              <input
                ref={inputRef}
                className="aw-url-input"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSave()}
                placeholder="https://youtube.com/watch?v=..."
                style={{
                  width: "100%",
                  background: "#FAF7F2",
                  border: "1.5px solid #E2D9CE",
                  borderRadius: 10,
                  padding: "13px 16px 13px 40px",
                  color: "#2C1810",
                  fontSize: 14,
                  fontFamily: "'DM Mono', monospace",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              className="aw-submit"
              onClick={handleSave}
              disabled={loading}
              style={{
                background: "#C4622D",
                border: "none",
                borderRadius: 10,
                padding: "13px 22px",
                color: "white",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 14px rgba(196,98,45,0.25)",
              }}
            >
              {loading
                ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    Thinking…
                  </span>
                : "Analyse →"}
            </button>
          </div>

          {error && (
            <p style={{ color: "#C4622D", fontSize: 13, margin: "8px 0 0", fontStyle: "italic" }}>{error}</p>
          )}

          {result && meta && (
            <div style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: meta.bg,
              border: `1px solid ${meta.border}`,
              animation: "slideIn 0.4s ease both",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}>
              <div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: meta.color,
                  background: "rgba(255,255,255,0.7)",
                  padding: "3px 10px",
                  borderRadius: 20,
                  border: `1px solid ${meta.border}`,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}>
                  {meta.icon} {meta.label}
                </span>
                <p style={{ color: "#2C1810", fontWeight: 500, margin: "10px 0 3px", fontSize: 15, fontFamily: "'Fraunces', serif" }}>
                  {result.title}
                </p>
                {result.chapters && (
                  <p style={{ color: "#8C7B6B", fontSize: 13, margin: 0 }}>
                    {result.chapters.length} chapters ready
                  </p>
                )}
              </div>
              <button
                className="aw-open-btn"
                onClick={() => navigate(meta.route)}
                style={{
                  background: "white",
                  border: `1.5px solid ${meta.border}`,
                  color: meta.color,
                  borderRadius: 8,
                  padding: "9px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Open →
              </button>
            </div>
          )}
        </div>

        {/* Mode pills — simple, human */}
        <div style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 56,
          animation: "fadeUp 0.7s 0.2s ease both",
        }}>
          {[
            { icon: "🌱", label: "Grow Mode", sub: "For tutorials & skills", color: "#5A7A5C", bg: "#EEF5EE", border: "#C2D9C3", route: "/grow" },
            { icon: "📌", label: "Collect Mode", sub: "For saving moments", color: "#C4622D", bg: "#FDF0E8", border: "#F0C4A8", route: "/collect" },
            { icon: "🌿", label: "Unwind Mode", sub: "For relaxing content", color: "#C9952A", bg: "#FDF5E6", border: "#E8D098", route: "/unwind" },
          ].map(m => (
            <div
              key={m.label}
              className="aw-mode-pill"
              onClick={() => navigate(m.route)}
              style={{
                background: m.bg,
                border: `1.5px solid ${m.border}`,
                borderRadius: 14,
                padding: "14px 20px",
                cursor: "pointer",
                transition: "all 0.2s",
                minWidth: 180,
                flex: 1,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ color: "#2C1810", fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{m.label}</div>
              <div style={{ color: "#8C7B6B", fontSize: 12 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Stats — understated */}
        <div style={{
          display: "flex",
          gap: 36,
          justifyContent: "center",
          animation: "fadeUp 0.7s 0.3s ease both",
        }}>
          {[["1,240+", "learners"], ["50k+", "videos"], ["98%", "completion"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 26,
                fontWeight: 500,
                color: "#2C1810",
                letterSpacing: "-0.5px",
              }}>{val}</div>
              <div style={{ color: "#B5A898", fontSize: 12, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

      </main>

      <footer style={{
        textAlign: "center",
        padding: "20px",
        fontSize: 12,
        color: "#B5A898",
        borderTop: "1px solid var(--border)",
        fontStyle: "italic",
      }}>
        Made with care · ActiveWatch {new Date().getFullYear()}
      </footer>
    </div>
  );
}