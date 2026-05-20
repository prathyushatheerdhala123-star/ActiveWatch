import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCoins, getStreak, getCompletedTopics } from "../api.js";

const RPG_LEVELS = [
  { title: "Intern",                 min: 0,    max: 200,  color: "#9794A8", bg: "#F0EEF9", icon: "🧑‍💻" },
  { title: "Junior Dev",             min: 200,  max: 500,  color: "#2A7D52", bg: "#E6F4EE", icon: "👨‍💻" },
  { title: "Mid-level Dev",          min: 500,  max: 1000, color: "#7C6FCD", bg: "#EDE9FB", icon: "🧑‍🔧" },
  { title: "Senior Dev",             min: 1000, max: 2000, color: "#C47B2B", bg: "#FEF3E8", icon: "🏆"   },
  { title: "Staff Engineer",         min: 2000, max: 3500, color: "#185FA5", bg: "#E6F1FB", icon: "⭐"   },
  { title: "Principal Engineer",     min: 3500, max: 5000, color: "#993556", bg: "#FBEAF0", icon: "🚀"   },
  { title: "Distinguished Engineer", min: 5000, max: 9999, color: "#7C6FCD", bg: "#EDE9FB", icon: "👑"   },
];

function getLevel(coins) {
  return [...RPG_LEVELS].reverse().find(l => coins >= l.min) || RPG_LEVELS[0];
}

const MOCK_ACTIONS = [
  { id: 1, label: "Complete Chapter 1 MCQ",      coins: 50, done: true,  icon: "❓" },
  { id: 2, label: "Submit coding challenge",      coins: 50, done: true,  icon: "💻" },
  { id: 3, label: "Unlock Chapter 2",             coins: 30, done: false, icon: "🔓" },
  { id: 4, label: "Watch 1 Collect Mode video",   coins: 20, done: false, icon: "📌" },
  { id: 5, label: "Maintain your streak",         coins: 25, done: false, icon: "🔥" },
];

const MOCK_TOPICS = [
  { name: "Frontend", pct: 68, color: "#7C6FCD", bg: "#EDE9FB" },
  { name: "Backend",  pct: 34, color: "#2A7D52", bg: "#E6F4EE" },
  { name: "DSA",      pct: 21, color: "#993556", bg: "#FBEAF0" },
  { name: "DevOps",   pct: 10, color: "#C47B2B", bg: "#FEF3E8" },
];

const MOCK_VIDEOS = [
  { title: "React Hooks Full Course",    mode: "Grow",    pct: 45, chapters: "2/4", color: "#7C6FCD", bg: "#EDE9FB" },
  { title: "Node.js REST API Tutorial",  mode: "Grow",    pct: 10, chapters: "1/6", color: "#7C6FCD", bg: "#EDE9FB" },
  { title: "How to Build Deep Work",     mode: "Collect", pct: 80, chapters: null,  color: "#2A7D52", bg: "#E6F4EE" },
];

// ─── Knowledge Graph Data ──────────────────────────────────────────────────
// Nodes: id, label, topic (colour group), x, y (relative 0-100), completed
const KG_NODES = [
  // React - purple cluster
  { id: "useState",      label: "useState",       topic: "react",   x: 20, y: 25, completed: true  },
  { id: "useEffect",     label: "useEffect",      topic: "react",   x: 35, y: 15, completed: true  },
  { id: "useContext",    label: "useContext",      topic: "react",   x: 50, y: 20, completed: false },
  { id: "useRef",        label: "useRef",          topic: "react",   x: 28, y: 42, completed: false },
  { id: "useCallback",   label: "useCallback",     topic: "react",   x: 45, y: 38, completed: false },
  { id: "useMemo",       label: "useMemo",         topic: "react",   x: 60, y: 28, completed: false },
  { id: "customHooks",   label: "Custom Hooks",    topic: "react",   x: 38, y: 58, completed: false },
  // JS - cyan cluster
  { id: "promises",      label: "Promises",        topic: "js",      x: 72, y: 18, completed: true  },
  { id: "asyncAwait",    label: "Async/Await",     topic: "js",      x: 82, y: 30, completed: true  },
  { id: "closures",      label: "Closures",        topic: "js",      x: 68, y: 42, completed: false },
  { id: "eventLoop",     label: "Event Loop",      topic: "js",      x: 80, y: 52, completed: false },
  // CSS - pink cluster
  { id: "flexbox",       label: "Flexbox",         topic: "css",     x: 18, y: 68, completed: true  },
  { id: "grid",          label: "CSS Grid",        topic: "css",     x: 30, y: 75, completed: false },
  { id: "animations",    label: "Animations",      topic: "css",     x: 14, y: 82, completed: false },
  // Node - green cluster
  { id: "express",       label: "Express.js",      topic: "node",    x: 60, y: 70, completed: false },
  { id: "restApi",       label: "REST APIs",        topic: "node",    x: 74, y: 65, completed: false },
  { id: "middleware",    label: "Middleware",       topic: "node",    x: 68, y: 80, completed: false },
];

const KG_EDGES = [
  ["useState", "useEffect"],
  ["useState", "useCallback"],
  ["useEffect", "useContext"],
  ["useRef", "useCallback"],
  ["useCallback", "useMemo"],
  ["useCallback", "customHooks"],
  ["useEffect", "customHooks"],
  ["promises", "asyncAwait"],
  ["asyncAwait", "eventLoop"],
  ["closures", "eventLoop"],
  ["closures", "useCallback"],
  ["flexbox", "grid"],
  ["grid", "animations"],
  ["express", "restApi"],
  ["restApi", "middleware"],
];

const TOPIC_COLORS = {
  react: { color: "#7C6FCD", bg: "#EDE9FB", label: "React"   },
  js:    { color: "#22d3ee", bg: "#E0F9FC", label: "JavaScript" },
  css:   { color: "#f472b6", bg: "#FDE8F3", label: "CSS"     },
  node:  { color: "#2A7D52", bg: "#E6F4EE", label: "Node.js" },
};

// ─── Gap Detection Data ────────────────────────────────────────────────────
const GAP_SUGGESTIONS = {
  useState:    ["useCallback", "useMemo", "useReducer"],
  useEffect:   ["useLayoutEffect", "useContext", "Custom Hooks"],
  promises:    ["Async/Await", "Event Loop", "Error Boundaries"],
  asyncAwait:  ["Event Loop", "Closures", "Web Workers"],
  flexbox:     ["CSS Grid", "CSS Animations", "CSS Variables"],
};

function detectGaps(completedTopics) {
  const gaps = new Set();
  completedTopics.forEach(topic => {
    const suggestions = GAP_SUGGESTIONS[topic] || [];
    suggestions.forEach(g => {
      const alreadyDone = completedTopics.some(t => t.toLowerCase() === g.toLowerCase());
      if (!alreadyDone) gaps.add(g);
    });
  });
  return [...gaps].slice(0, 4);
}

// ─── Knowledge Graph Component ─────────────────────────────────────────────
function KnowledgeGraph({ completedTopics }) {
  const svgRef = useRef(null);
  const W = 600, H = 320;

  const nodeMap = {};
  KG_NODES.forEach(n => { nodeMap[n.id] = n; });

  // Override completion from real completed topics
  const nodes = KG_NODES.map(n => ({
    ...n,
    completed: n.completed || completedTopics.some(t => t.toLowerCase() === n.id.toLowerCase() || t.toLowerCase() === n.label.toLowerCase()),
  }));

  function nodeX(n) { return (n.x / 100) * W; }
  function nodeY(n) { return (n.y / 100) * H; }

  const completedCount = nodes.filter(n => n.completed).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ color: "#1E1B2E", fontSize: 14, fontWeight: 600 }}>🧠 Knowledge Graph</div>
          <div style={{ color: "#9794A8", fontSize: 12, marginTop: 2 }}>{completedCount} of {nodes.length} concepts proven</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(TOPIC_COLORS).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: val.color }} />
              <span style={{ fontSize: 11, color: "#9794A8" }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#0F0E1A", borderRadius: 12, overflow: "hidden", border: "1px solid #2A2740", position: "relative" }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
          {/* Edges */}
          {KG_EDGES.map(([a, b], i) => {
            const na = nodes.find(n => n.id === a);
            const nb = nodes.find(n => n.id === b);
            if (!na || !nb) return null;
            const bothDone = na.completed && nb.completed;
            return (
              <line key={i}
                x1={nodeX(na)} y1={nodeY(na)} x2={nodeX(nb)} y2={nodeY(nb)}
                stroke={bothDone ? "rgba(124,111,205,0.5)" : "rgba(255,255,255,0.07)"}
                strokeWidth={bothDone ? 1.5 : 1}
                strokeDasharray={bothDone ? "none" : "4,4"}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map(n => {
            const tc = TOPIC_COLORS[n.topic];
            const cx = nodeX(n), cy = nodeY(n);
            return (
              <g key={n.id}>
                {/* Glow for completed */}
                {n.completed && (
                  <circle cx={cx} cy={cy} r={14} fill={tc.color} opacity={0.15} />
                )}
                <circle
                  cx={cx} cy={cy} r={9}
                  fill={n.completed ? tc.color : "#1E1B2E"}
                  stroke={n.completed ? tc.color : "rgba(255,255,255,0.15)"}
                  strokeWidth={n.completed ? 2 : 1.5}
                />
                {n.completed && (
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold">✓</text>
                )}
                <text
                  x={cx} y={cy + 20}
                  textAnchor="middle"
                  fill={n.completed ? tc.color : "rgba(255,255,255,0.3)"}
                  fontSize={9}
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight={n.completed ? 600 : 400}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend overlay */}
        <div style={{ position: "absolute", bottom: 10, right: 12, display: "flex", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C6FCD" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Completed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1E1B2E", border: "1px solid rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gap Detection Component ───────────────────────────────────────────────
function GapDetection({ completedTopics }) {
  const gaps = detectGaps(completedTopics);

  const GAP_META = {
    "useCallback":       { desc: "You know useState — useCallback prevents unnecessary re-renders in child components.", link: "https://react.dev/reference/react/useCallback",   time: "8 min"  },
    "useMemo":           { desc: "You know useState — useMemo memoizes expensive calculations to boost performance.",    link: "https://react.dev/reference/react/useMemo",       time: "8 min"  },
    "useReducer":        { desc: "You know useState — useReducer handles complex state logic more predictably.",          link: "https://react.dev/reference/react/useReducer",     time: "12 min" },
    "useLayoutEffect":   { desc: "You know useEffect — useLayoutEffect fires synchronously after DOM mutations.",         link: "https://react.dev/reference/react/useLayoutEffect", time: "6 min"  },
    "useContext":        { desc: "You know useEffect — useContext eliminates prop drilling across deep component trees.", link: "https://react.dev/reference/react/useContext",    time: "10 min" },
    "Custom Hooks":      { desc: "You know useState & useEffect — Custom Hooks let you reuse stateful logic across components.", link: "https://react.dev/learn/reusing-logic-with-custom-hooks", time: "15 min" },
    "Async/Await":       { desc: "You know Promises — Async/Await is cleaner syntax for the same Promise chain.",        link: "https://javascript.info/async-await",             time: "10 min" },
    "Event Loop":        { desc: "You know Async/Await — the Event Loop explains HOW async JS actually works.",          link: "https://javascript.info/event-loop",               time: "12 min" },
    "Error Boundaries":  { desc: "You know Promises — Error Boundaries catch runtime errors in React component trees.",  link: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary", time: "8 min" },
    "Closures":          { desc: "You know Async/Await — Closures are the foundation of how hooks retain state.",        link: "https://javascript.info/closure",                  time: "10 min" },
    "Web Workers":       { desc: "You know Async/Await — Web Workers run scripts off the main thread.",                  link: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API", time: "15 min" },
    "CSS Grid":          { desc: "You know Flexbox — CSS Grid handles two-dimensional layouts Flexbox can't.",           link: "https://css-tricks.com/snippets/css/complete-guide-grid/", time: "12 min" },
    "CSS Animations":    { desc: "You know Flexbox — CSS Animations add motion without JavaScript.",                     link: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation", time: "10 min" },
    "CSS Variables":     { desc: "You know Flexbox — CSS Variables (custom properties) make theming effortless.",       link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties", time: "8 min" },
  };

  if (gaps.length === 0) {
    return (
      <div style={{ padding: "24px 0", textAlign: "center", color: "#C9C2F0" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
        <div style={{ fontSize: 14 }}>Complete more chapters to unlock gap detection.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#1E1B2E", fontSize: 14, fontWeight: 600 }}>🔍 Gap Detection</div>
        <div style={{ color: "#9794A8", fontSize: 12, marginTop: 2 }}>Based on what you know, here's what's missing from your knowledge graph.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {gaps.map((gap, i) => {
          const meta = GAP_META[gap] || { desc: `Fill this gap to strengthen your foundations.`, link: "#", time: "~10 min" };
          return (
            <div key={i} style={{ background: "#FAFAFA", border: "1px solid #E8E4F0", borderLeft: "4px solid #7C6FCD", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: "#1E1B2E", fontSize: 13, fontWeight: 600 }}>{gap}</span>
                  <span style={{ fontSize: 11, color: "#9794A8", background: "#F0EEF9", padding: "1px 7px", borderRadius: 10 }}>{meta.time}</span>
                </div>
                <p style={{ color: "#6B6880", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{meta.desc}</p>
              </div>
              <a href={meta.link} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, background: "#EDE9FB", border: "1px solid #C9C2F0", borderRadius: 8, padding: "6px 12px", color: "#7C6FCD", fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#7C6FCD"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#EDE9FB"; e.currentTarget.style.color = "#7C6FCD"; }}>
                Learn →
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [coins, setCoins]           = useState(getCoins);
  const [actions, setActions]       = useState(MOCK_ACTIONS);
  const [completedTopics, setCompletedTopics] = useState(getCompletedTopics());

  useEffect(() => {
    setCoins(getCoins());
    setCompletedTopics(getCompletedTopics());
  }, []);

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
          {[["Home", "/"], ["Grow", "/grow"], ["Collect", "/collect"]].map(([l, p]) => (
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

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { icon: "🔥", val: `${getStreak()} days`, label: "Current streak",     color: "#C47B2B", bg: "#FEF3E8" },
                { icon: "✅", val: `${actions.filter(a => a.done).length}/${actions.length}`, label: "Tasks done today", color: "#2A7D52", bg: "#E6F4EE" },
                { icon: "🎓", val: "3",                    label: "Videos in progress", color: "#7C6FCD", bg: "#EDE9FB" },
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

        {/* KNOWLEDGE GRAPH + GAP DETECTION ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 16 }}>
          <div style={{ ...S.card, animation: "fadeUp 0.5s 0.15s ease both" }}>
            <KnowledgeGraph completedTopics={completedTopics} />
          </div>
          <div style={{ ...S.card, animation: "fadeUp 0.5s 0.2s ease both" }}>
            <GapDetection completedTopics={completedTopics} />
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={S.bottomRow}>
          <div style={{ ...S.card, flex: "0 0 250px", animation: "fadeUp 0.5s 0.25s ease both" }}>
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

          <div style={{ ...S.card, flex: 1, animation: "fadeUp 0.5s 0.3s ease both" }}>
            <div style={S.cardTitle}>▶ Active Videos</div>
            {MOCK_VIDEOS.map(v => (
              <div key={v.title} className="aw-video-card"
                style={{ background: "#F7F6FB", border: "1px solid #E8E4F0", borderRadius: 10, padding: "14px 16px", marginBottom: 10, transition: "all 0.2s", cursor: "pointer" }}
                onClick={() => navigate(v.mode === "Grow" ? "/grow" : "/collect")}>
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
  page:      { padding: "32px 40px", maxWidth: 1200, margin: "0 auto", width: "100%" },
  topRow:    { display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" },
  bottomRow: { display: "flex", gap: 16, alignItems: "flex-start" },
  card:      { background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(124,111,205,0.05)" },
  cardTitle: { color: "#1E1B2E", fontSize: 14, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 },
};
