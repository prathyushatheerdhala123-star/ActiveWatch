import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "D:\Prathyusha\IARE\Ideathon'26\ActiveWatch\src\pages/Nav.jsx";
import { getCoins, getStreak, getCompletedTopics } from "../api.js";

const RPG_LEVELS = [
  { title: "Intern",                 min: 0,    max: 200,  color: "#8C7B6B", icon: "🧑‍💻" },
  { title: "Junior Dev",             min: 200,  max: 500,  color: "#5A7A5C", icon: "👨‍💻" },
  { title: "Mid-level Dev",          min: 500,  max: 1000, color: "#C4622D", icon: "🧑‍🔧" },
  { title: "Senior Dev",             min: 1000, max: 2000, color: "#C9952A", icon: "🏆"   },
  { title: "Staff Engineer",         min: 2000, max: 3500, color: "#5C3D2E", icon: "⭐"   },
  { title: "Principal Engineer",     min: 3500, max: 5000, color: "#A8501F", icon: "🚀"   },
  { title: "Distinguished Engineer", min: 5000, max: 9999, color: "#2C1810", icon: "👑"   },
];

function getLevel(coins) {
  return [...RPG_LEVELS].reverse().find(l => coins >= l.min) || RPG_LEVELS[0];
}

const MOCK_ACTIONS = [
  { id: 1, label: "Complete Chapter 1 MCQ",    coins: 50, done: true,  icon: "❓" },
  { id: 2, label: "Submit coding challenge",   coins: 50, done: true,  icon: "💻" },
  { id: 3, label: "Unlock Chapter 2",          coins: 30, done: false, icon: "🔓" },
  { id: 4, label: "Watch a Collect Mode video",coins: 20, done: false, icon: "📌" },
  { id: 5, label: "Maintain your streak",      coins: 25, done: false, icon: "🔥" },
];

const MOCK_TOPICS = [
  { name: "Frontend", pct: 68, color: "#C4622D" },
  { name: "Backend",  pct: 34, color: "#5A7A5C" },
  { name: "DSA",      pct: 21, color: "#C9952A" },
  { name: "DevOps",   pct: 10, color: "#8C7B6B" },
];

const KG_NODES = [
  { id: "useState",    label: "useState",     topic: "react", x: 18, y: 22, completed: true  },
  { id: "useEffect",   label: "useEffect",    topic: "react", x: 33, y: 13, completed: true  },
  { id: "useContext",  label: "useContext",   topic: "react", x: 48, y: 20, completed: false },
  { id: "useRef",      label: "useRef",       topic: "react", x: 26, y: 40, completed: false },
  { id: "useCallback", label: "useCallback",  topic: "react", x: 44, y: 36, completed: false },
  { id: "useMemo",     label: "useMemo",      topic: "react", x: 58, y: 24, completed: false },
  { id: "customHooks", label: "Custom Hooks", topic: "react", x: 36, y: 56, completed: false },
  { id: "promises",    label: "Promises",     topic: "js",    x: 70, y: 15, completed: true  },
  { id: "asyncAwait",  label: "Async/Await",  topic: "js",    x: 80, y: 28, completed: true  },
  { id: "closures",    label: "Closures",     topic: "js",    x: 68, y: 40, completed: false },
  { id: "eventLoop",   label: "Event Loop",   topic: "js",    x: 78, y: 50, completed: false },
  { id: "flexbox",     label: "Flexbox",      topic: "css",   x: 16, y: 68, completed: true  },
  { id: "grid",        label: "CSS Grid",     topic: "css",   x: 28, y: 76, completed: false },
  { id: "express",     label: "Express.js",   topic: "node",  x: 58, y: 68, completed: false },
  { id: "restApi",     label: "REST APIs",    topic: "node",  x: 72, y: 64, completed: false },
];

const KG_EDGES = [
  ["useState","useEffect"],["useState","useCallback"],["useEffect","useContext"],
  ["useRef","useCallback"],["useCallback","useMemo"],["useCallback","customHooks"],
  ["useEffect","customHooks"],["promises","asyncAwait"],["asyncAwait","eventLoop"],
  ["closures","eventLoop"],["closures","useCallback"],["flexbox","grid"],
  ["express","restApi"],
];

const TOPIC_COLORS = {
  react: "#C4622D",
  js:    "#C9952A",
  css:   "#5A7A5C",
  node:  "#8C7B6B",
};

const GAP_SUGGESTIONS = {
  useState:   ["useCallback","useMemo","useReducer"],
  useEffect:  ["useContext","Custom Hooks","useLayoutEffect"],
  promises:   ["Async/Await","Event Loop","Error Boundaries"],
  asyncAwait: ["Event Loop","Closures","Web Workers"],
  flexbox:    ["CSS Grid","CSS Animations","CSS Variables"],
};

function detectGaps(completed) {
  const gaps = new Set();
  completed.forEach(t => {
    (GAP_SUGGESTIONS[t] || []).forEach(g => {
      if (!completed.some(c => c.toLowerCase() === g.toLowerCase())) gaps.add(g);
    });
  });
  return [...gaps].slice(0, 4);
}

const GAP_META = {
  "useCallback":     { desc: "Prevents unnecessary re-renders in child components.", time: "8 min",  link: "https://react.dev/reference/react/useCallback" },
  "useMemo":         { desc: "Memoizes expensive calculations for better performance.", time: "8 min",  link: "https://react.dev/reference/react/useMemo" },
  "useReducer":      { desc: "Handles complex state logic more predictably than useState.", time: "12 min", link: "https://react.dev/reference/react/useReducer" },
  "useContext":      { desc: "Eliminates prop drilling across deep component trees.", time: "10 min", link: "https://react.dev/reference/react/useContext" },
  "Custom Hooks":    { desc: "Reuse stateful logic across multiple components.", time: "15 min", link: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
  "useLayoutEffect": { desc: "Like useEffect but fires synchronously after DOM mutations.", time: "6 min",  link: "https://react.dev/reference/react/useLayoutEffect" },
  "Async/Await":     { desc: "Cleaner syntax for the same Promise chain.", time: "10 min", link: "https://javascript.info/async-await" },
  "Event Loop":      { desc: "Explains how async JS actually works under the hood.", time: "12 min", link: "https://javascript.info/event-loop" },
  "Error Boundaries":{ desc: "Catches runtime errors in React component trees.", time: "8 min",  link: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary" },
  "Closures":        { desc: "The foundation of how hooks retain state between renders.", time: "10 min", link: "https://javascript.info/closure" },
  "Web Workers":     { desc: "Run scripts off the main thread for better performance.", time: "15 min", link: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" },
  "CSS Grid":        { desc: "Two-dimensional layouts that Flexbox can't handle.", time: "12 min", link: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
  "CSS Animations":  { desc: "Add motion to your UI without JavaScript.", time: "10 min", link: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation" },
  "CSS Variables":   { desc: "Custom properties that make theming effortless.", time: "8 min",  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" },
};

function KnowledgeGraph({ completedTopics }) {
  const W = 580, H = 300;
  const nodes = KG_NODES.map(n => ({
    ...n,
    completed: n.completed || completedTopics.some(t => t.toLowerCase() === n.id.toLowerCase() || t.toLowerCase() === n.label.toLowerCase()),
  }));
  const completedCount = nodes.filter(n => n.completed).length;
  const nx = n => (n.x / 100) * W;
  const ny = n => (n.y / 100) * H;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500 }}>🧠 Knowledge Graph</div>
          <div style={{ color: "#8C7B6B", fontSize: 12, marginTop: 3 }}>{completedCount} of {nodes.length} concepts proven</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {[["React","#C4622D"],["JS","#C9952A"],["CSS","#5A7A5C"],["Node","#8C7B6B"]].map(([l,c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
              <span style={{ fontSize: 11, color: "#8C7B6B" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#1A1412", borderRadius: 14, overflow: "hidden", border: "1px solid #2C1810" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
          {KG_EDGES.map(([a, b], i) => {
            const na = nodes.find(n => n.id === a), nb = nodes.find(n => n.id === b);
            if (!na || !nb) return null;
            const both = na.completed && nb.completed;
            return <line key={i} x1={nx(na)} y1={ny(na)} x2={nx(nb)} y2={ny(nb)}
              stroke={both ? "rgba(196,98,45,0.4)" : "rgba(255,255,255,0.06)"}
              strokeWidth={both ? 1.5 : 1} strokeDasharray={both ? "none" : "3,4"} />;
          })}
          {nodes.map(n => {
            const c = TOPIC_COLORS[n.topic];
            const cx = nx(n), cy = ny(n);
            return (
              <g key={n.id}>
                {n.completed && <circle cx={cx} cy={cy} r={13} fill={c} opacity={0.12} />}
                <circle cx={cx} cy={cy} r={8}
                  fill={n.completed ? c : "#231A17"}
                  stroke={n.completed ? c : "rgba(255,255,255,0.12)"}
                  strokeWidth={n.completed ? 2 : 1.5} />
                {n.completed && <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize={7} fontWeight="bold">✓</text>}
                <text x={cx} y={cy + 19} textAnchor="middle"
                  fill={n.completed ? c : "rgba(255,255,255,0.25)"}
                  fontSize={8} fontFamily="DM Sans, sans-serif" fontWeight={n.completed ? 600 : 400}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function GapDetection({ completedTopics }) {
  const gaps = detectGaps(completedTopics);
  if (gaps.length === 0) return (
    <div style={{ padding: "32px 0", textAlign: "center", color: "#B5A898" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15 }}>Complete more chapters to unlock gap detection.</div>
    </div>
  );
  return (
    <div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500, marginBottom: 4 }}>🔍 What's missing</div>
      <div style={{ color: "#8C7B6B", fontSize: 12, marginBottom: 16 }}>Based on what you know, here's what to learn next.</div>
      {gaps.map((gap, i) => {
        const meta = GAP_META[gap] || { desc: "Fill this gap to strengthen your foundations.", time: "~10 min", link: "#" };
        return (
          <div key={i} style={{ background: "#FAF7F2", border: "1px solid #E2D9CE", borderLeft: "4px solid #C4622D", borderRadius: 10, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ color: "#2C1810", fontSize: 13, fontWeight: 500 }}>{gap}</span>
                <span style={{ fontSize: 11, color: "#8C7B6B", background: "#F3EDE3", padding: "1px 7px", borderRadius: 10 }}>{meta.time}</span>
              </div>
              <p style={{ color: "#8C7B6B", fontSize: 12, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{meta.desc}</p>
            </div>
            <a href={meta.link} target="_blank" rel="noopener noreferrer"
              style={{ flexShrink: 0, background: "#FDF0E8", border: "1px solid #F0C4A8", borderRadius: 8, padding: "6px 12px", color: "#C4622D", fontSize: 12, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>
              Learn →
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [coins, setCoins]             = useState(getCoins);
  const [actions, setActions]         = useState(MOCK_ACTIONS);
  const [completedTopics, setTopics]  = useState(getCompletedTopics());

  useEffect(() => { setCoins(getCoins()); setTopics(getCompletedTopics()); }, []);

  const level     = getLevel(coins);
  const nextLevel = RPG_LEVELS[RPG_LEVELS.indexOf(level) + 1] || level;
  const xpPct     = Math.min(Math.round(((coins - level.min) / (nextLevel.max - level.min)) * 100), 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .aw-action:hover{background:#F3EDE3!important;}
        .aw-video-card:hover{border-color:#C4622D!important;transform:translateY(-1px);}
        .aw-rank-row { display:flex;align-items:center;gap:8px;padding:4px 0; }
      `}</style>

      <Nav />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 40px" }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 500, color: "#2C1810", margin: 0, letterSpacing: "-0.5px" }}>Dashboard</h1>
          <p style={{ color: "#8C7B6B", fontSize: 14, margin: "6px 0 0", fontStyle: "italic" }}>Your learning journey, at a glance</p>
        </div>

        {/* TOP ROW */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>

          {/* RPG CARD */}
          <div style={{ flex: "0 0 280px", background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 24, animation: "fadeUp 0.5s ease both", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "#FDF0E8", opacity: 0.6 }} />
            <div style={{ fontSize: 10, color: "#B5A898", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Developer Card</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "#FDF0E8", border: "1.5px solid #F0C4A8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{level.icon}</div>
              <div>
                <div style={{ color: level.color, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{level.title}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: "#2C1810", fontWeight: 500 }}>🪙 {coins.toLocaleString()}</div>
                <div style={{ color: "#B5A898", fontSize: 11 }}>coins collected</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#8C7B6B", fontSize: 12 }}>Next: <span style={{ color: level.color }}>{nextLevel.title}</span></span>
              <span style={{ color: "#B5A898", fontSize: 12, fontFamily: "'DM Mono',monospace" }}>{xpPct}%</span>
            </div>
            <div style={{ height: 6, background: "#F3EDE3", borderRadius: 3, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ height: "100%", width: `${xpPct}%`, background: level.color, borderRadius: 3, transition: "width 1s ease" }} />
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div style={{ fontSize: 10, color: "#B5A898", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Rank Ladder</div>
              {RPG_LEVELS.map(l => (
                <div key={l.title} className="aw-rank-row" style={{ opacity: coins >= l.min ? 1 : 0.3 }}>
                  <span style={{ fontSize: 13 }}>{l.icon}</span>
                  <span style={{ fontSize: 12, color: coins >= l.min ? l.color : "#B5A898", fontWeight: coins >= l.min ? 500 : 400, flex: 1 }}>{l.title}</span>
                  {level.title === l.title && <span style={{ fontSize: 10, color: l.color, background: "#FDF0E8", padding: "1px 7px", borderRadius: 10, border: `1px solid ${l.color}40` }}>you</span>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { icon: "🔥", val: `${getStreak()} days`, label: "Streak",             color: "#C9952A" },
                { icon: "✅", val: `${actions.filter(a=>a.done).length}/${actions.length}`, label: "Done today", color: "#5A7A5C" },
                { icon: "🎓", val: "3",                    label: "In progress",         color: "#C4622D" },
              ].map(s => (
                <div key={s.label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 18, textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: s.color, fontWeight: 500 }}>{s.val}</div>
                  <div style={{ color: "#B5A898", fontSize: 12, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 20, flex: 1 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: "#2C1810", fontWeight: 500, marginBottom: 16 }}>⚡ Today's Actions</div>
              {actions.map(a => (
                <div key={a.id} className="aw-action"
                  onClick={() => {/* toggle */}}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s", opacity: a.done ? 0.5 : 1 }}>
                  <div style={{ width: 19, height: 19, borderRadius: 5, border: `1.5px solid ${a.done ? "#5A7A5C" : "#E2D9CE"}`, background: a.done ? "#5A7A5C" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    {a.done && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, color: a.done ? "#B5A898" : "#2C1810", flex: 1, textDecoration: a.done ? "line-through" : "none" }}>{a.icon} {a.label}</span>
                  <span style={{ fontSize: 12, color: "#C9952A", fontFamily: "'DM Mono',monospace" }}>+{a.coins} 🪙</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KNOWLEDGE GRAPH + GAP DETECTION */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 20 }}>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 24, animation: "fadeUp 0.5s 0.1s ease both" }}>
            <KnowledgeGraph completedTopics={completedTopics} />
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 24, animation: "fadeUp 0.5s 0.15s ease both" }}>
            <GapDetection completedTopics={completedTopics} />
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: "0 0 240px", background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 24, animation: "fadeUp 0.5s 0.2s ease both" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: "#2C1810", fontWeight: 500, marginBottom: 20 }}>📊 Topic Progress</div>
            {MOCK_TOPICS.map(t => (
              <div key={t.name} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ color: "#5C3D2E", fontSize: 13 }}>{t.name}</span>
                  <span style={{ color: t.color, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>{t.pct}%</span>
                </div>
                <div style={{ height: 5, background: "#F3EDE3", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: 3, transition: "width 1.2s ease" }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 24, animation: "fadeUp 0.5s 0.25s ease both" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: "#2C1810", fontWeight: 500, marginBottom: 20 }}>▶ Active Videos</div>
            {[
              { title: "React Hooks Full Course",   mode: "Grow",    pct: 45, chapters: "2/4", color: "#C4622D", route: "/grow" },
              { title: "Node.js REST API Tutorial", mode: "Grow",    pct: 10, chapters: "1/6", color: "#C4622D", route: "/grow" },
              { title: "How to Build Deep Work",    mode: "Collect", pct: 80, chapters: null,  color: "#5A7A5C", route: "/collect" },
            ].map(v => (
              <div key={v.title} className="aw-video-card"
                style={{ background: "#FAF7F2", border: "1px solid #E2D9CE", borderRadius: 12, padding: "14px 16px", marginBottom: 10, transition: "all 0.2s", cursor: "pointer" }}
                onClick={() => navigate(v.route)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: v.color, background: "#F3EDE3", padding: "2px 8px", borderRadius: 20, fontWeight: 500, marginBottom: 6, display: "inline-block" }}>{v.mode} Mode</span>
                    <div style={{ color: "#2C1810", fontSize: 14, fontWeight: 500, marginTop: 4 }}>{v.title}</div>
                  </div>
                  <span style={{ color: "#B5A898", fontSize: 12, fontFamily: "'DM Mono',monospace", marginLeft: 12, whiteSpace: "nowrap" }}>{v.chapters || `${v.pct}%`}</span>
                </div>
                <div style={{ height: 4, background: "#F3EDE3", borderRadius: 2, overflow: "hidden" }}>
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