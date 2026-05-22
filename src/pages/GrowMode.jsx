import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav.jsx";
import { verifyAnswer, getCoins, addCoins, addNote, getNotes, addCompletedTopic } from "../api.js";

const CHAPTERS = [
  {
    id: 1, title: "useState & useEffect", duration: "12 min", locked: false, topic: "useState",
    summary: "useState lets you add reactive state to functional components. useEffect handles side effects like data fetching and DOM manipulation. Together they replace class component lifecycle methods.",
    skipQuestions: [
      { q: "What does useState return?", options: ["A value only", "A setter only", "An array: [value, setter]", "An object"], correct: 2 },
      { q: "When does useEffect run by default?", options: ["Only once on mount", "Only on unmount", "After every render", "Never automatically"], correct: 2 },
    ],
    mcq: {
      question: "What's the correct way to update state based on the previous value?",
      options: ["setState(state + 1)", "setState(prev => prev + 1)", "state = state + 1", "setState({ state: state + 1 })"],
      correct: 1,
      explanation: "Using the functional form setState(prev => prev + 1) is safer — React may batch updates, so always use the functional form when new state depends on old state.",
    },
    code: { prompt: "Fix this component so it fetches user data on mount:", starter: `function UserCard({ userId }) {\n  const [user, setUser] = useState(null);\n\n  // TODO: fetch user on mount\n  // fetch(\`/api/users/\${userId}\`)\n  //   .then(r => r.json())\n  //   .then(data => setUser(data));\n\n  return <div>{user ? user.name : "Loading..."}</div>;\n}` },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Design Counter Component",        url: "https://leetcode.com/problems/create-hello-world-function/" },
      { level: "Medium", platform: "HackerRank", name: "Implement useToggle Custom Hook", url: "https://www.hackerrank.com/domains/react" },
      { level: "Hard",   platform: "GFG",        name: "Build useState from Scratch",     url: "https://www.geeksforgeeks.org/reactjs-hooks/" },
    ],
  },
  {
    id: 2, title: "useContext & useRef", duration: "14 min", locked: true, topic: "useContext",
    summary: "useContext lets you read and subscribe to context without prop drilling. useRef gives you a mutable ref that persists across renders without causing re-renders — perfect for DOM access.",
    skipQuestions: [
      { q: "What problem does useContext solve?", options: ["State management", "Prop drilling", "Performance", "Side effects"], correct: 1 },
      { q: "Does updating a useRef value trigger a re-render?", options: ["Yes always", "No never", "Only in strict mode", "Depends on the value"], correct: 1 },
    ],
    mcq: {
      question: "What must you do before using useContext in a component?",
      options: ["Import React", "Wrap the component tree in a Provider", "Call createContext inside the component", "None of the above"],
      correct: 1,
      explanation: "You must wrap the component tree in a Context.Provider with a value prop. Components that call useContext re-render whenever the Provider's value changes.",
    },
    code: { prompt: "Use useRef to focus an input when the button is clicked:", starter: `function FocusInput() {\n  // TODO: create a ref\n  // TODO: attach it to the input\n  // TODO: call .focus() on button click\n\n  return (\n    <div>\n      <input placeholder="Click the button to focus me" />\n      <button onClick={/* TODO */}>Focus Input</button>\n    </div>\n  );\n}` },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Theme Switcher with Context",      url: "https://leetcode.com" },
      { level: "Medium", platform: "HackerRank", name: "Auth Context Implementation",      url: "https://hackerrank.com" },
      { level: "Hard",   platform: "GFG",        name: "Build React Context from Scratch", url: "https://geeksforgeeks.org" },
    ],
  },
  {
    id: 3, title: "Custom Hooks", duration: "18 min", locked: true, topic: "custom hooks",
    summary: "Custom Hooks let you extract component logic into reusable functions. A Custom Hook is a JavaScript function whose name starts with 'use' and can call other hooks inside it.",
    skipQuestions: [
      { q: "Custom hooks must start with which prefix?", options: ["hook", "use", "custom", "get"], correct: 1 },
      { q: "Can custom hooks call other hooks?", options: ["No", "Yes", "Only built-in hooks", "Only in production"], correct: 1 },
    ],
    mcq: {
      question: "Which of these is a valid Custom Hook?",
      options: ["function getData() { useState(null) }", "function useData() { return useState(null) }", "const useData = { state: null }", "class useData extends Hook {}"],
      correct: 1,
      explanation: "A custom hook must be a function prefixed with 'use' and can call other hooks. The return value is up to you — usually state and functions to manipulate it.",
    },
    code: { prompt: "Extract this fetch logic into a reusable useFetch hook:", starter: `function useFetch(url) {\n  // TODO: implement using useState and useEffect\n  // Should return { data, loading, error }\n}\n\n// Usage:\n// const { data, loading, error } = useFetch('/api/posts');` },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Implement useLocalStorage", url: "https://leetcode.com" },
      { level: "Medium", platform: "HackerRank", name: "Build useDebounce Hook",    url: "https://hackerrank.com" },
      { level: "Hard",   platform: "GFG",        name: "Create useInfiniteScroll",  url: "https://geeksforgeeks.org" },
    ],
  },
  {
    id: 4, title: "Performance Hooks", duration: "20 min", locked: true, topic: "useMemo",
    summary: "useMemo memoizes expensive computations so they only re-run when dependencies change. useCallback memoizes functions. React.memo prevents re-renders when props haven't changed.",
    skipQuestions: [
      { q: "What does useMemo prevent?", options: ["State updates", "Re-renders", "Expensive recalculations", "Network calls"], correct: 2 },
      { q: "useCallback memoizes what?", options: ["Values", "Functions", "Components", "State"], correct: 1 },
    ],
    mcq: {
      question: "When should you use useMemo?",
      options: ["For every variable", "Only for API calls", "For expensive calculations that depend on changing values", "For all state updates"],
      correct: 2,
      explanation: "useMemo is for genuinely expensive computations. Using it everywhere adds overhead — only memoize when profiling shows it's a real bottleneck.",
    },
    code: { prompt: "Fix this component with useMemo to avoid recalculating on every render:", starter: `function ProductList({ products, filterTerm }) {\n  // This runs on EVERY render — expensive!\n  const filtered = products.filter(p =>\n    p.name.toLowerCase().includes(filterTerm.toLowerCase())\n  );\n\n  // TODO: wrap in useMemo\n\n  return filtered.map(p => <div key={p.id}>{p.name}</div>);\n}` },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Memoize Function Results",       url: "https://leetcode.com/problems/memoize/" },
      { level: "Medium", platform: "HackerRank", name: "Optimise List with useMemo",     url: "https://hackerrank.com" },
      { level: "Hard",   platform: "GFG",        name: "React Performance Optimisation", url: "https://geeksforgeeks.org" },
    ],
  },
];

const LEVEL_COLORS = { Easy: "#5A7A5C", Medium: "#C9952A", Hard: "#C4622D" };
const PLATFORM_COLORS = { LeetCode: "#F89F1B", HackerRank: "#2EC866", GFG: "#2F8D46" };

export default function GrowMode() {
  const navigate = useNavigate();
  const [chapters, setChapters]   = useState(CHAPTERS);
  const [activeId, setActiveId]   = useState(1);
  const [coins, setCoins]         = useState(getCoins());
  const [coinPop, setCoinPop]     = useState(null);
  const [selected, setSelected]   = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback]   = useState(null);
  const [codeVal, setCodeVal]     = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [unlockBanner, setUnlockBanner]   = useState(false);
  const [activeTab, setActiveTab] = useState("learn");
  const [notes, setNotes]         = useState(getNotes());
  const [skipPhase, setSkipPhase] = useState("prompt");
  const [skipAnswers, setSkipAnswers] = useState([null, null]);
  const [skipResult, setSkipResult]   = useState(null);

  const chapter = chapters.find(c => c.id === activeId);

  useEffect(() => {
    setSelected(null); setSubmitted(false); setFeedback(null);
    setCodeVal(chapter?.code?.starter || ""); setCodeSubmitted(false);
    setUnlockBanner(false); setSkipPhase("prompt");
    setSkipAnswers([null, null]); setSkipResult(null);
  }, [activeId]);

  function popCoins(amount) {
    const updated = addCoins(amount);
    setCoins(updated);
    setCoinPop(`+${amount}`);
    setTimeout(() => setCoinPop(null), 1400);
  }

  async function handleMCQ() {
    if (selected === null) return;
    const res = await verifyAnswer({ question: chapter.mcq.question, options: chapter.mcq.options, userAnswer: selected, correctAnswer: chapter.mcq.correct });
    setFeedback(res); setSubmitted(true);
    if (res.correct) { popCoins(50); }
    else {
      const updated = addNote({ chapter: chapter.title, concept: chapter.mcq.question, explanation: res.feedback, correct: chapter.mcq.options[chapter.mcq.correct] });
      setNotes(updated);
    }
    if (res.correct && codeSubmitted) triggerUnlock();
  }

  function handleCodeSubmit() {
    setCodeSubmitted(true); popCoins(50);
    if (submitted && feedback?.correct) triggerUnlock();
    else if (!submitted) triggerUnlock();
  }

  function triggerUnlock() {
    addCompletedTopic(chapter.topic);
    setUnlockBanner(true);
    const nextId = chapter.id + 1;
    if (nextId <= chapters.length) setChapters(prev => prev.map(c => c.id === nextId ? { ...c, locked: false } : c));
  }

  function handleSkipAnswer(qi, oi) {
    const u = [...skipAnswers]; u[qi] = oi; setSkipAnswers(u);
  }

  function submitSkip() {
    const passed = chapter.skipQuestions.every((q, i) => skipAnswers[i] === q.correct);
    setSkipResult(passed ? "passed" : "failed");
    if (passed) {
      popCoins(30); addCompletedTopic(chapter.topic);
      const nextId = chapter.id + 1;
      if (nextId <= chapters.length) setChapters(prev => prev.map(c => c.id === nextId ? { ...c, locked: false } : c));
    }
    setSkipPhase("done");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes coinFloat{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-52px)}}
        @keyframes unlock{0%{opacity:0;transform:scale(0.94)}100%{opacity:1;transform:scale(1)}}
        .aw-chapter-btn:hover{background:#F3EDE3!important;}
        .aw-option:hover{border-color:#C4622D!important;background:#FDF0E8!important;}
        .aw-tab-btn { background:none;border:none;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;padding:8px 18px;border-bottom:2px solid transparent;color:#8C7B6B;transition:all 0.2s; }
        .aw-tab-btn.active { color:#C4622D;border-bottom-color:#C4622D;font-weight:500; }
        .aw-tab-btn:hover { color:#2C1810; }
        .aw-practice-row:hover{border-color:#C4622D!important;background:#FDF0E8!important;}
      `}</style>

      <Nav />

      <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 260, flexShrink: 0,
          borderRight: "1px solid var(--border)",
          background: "white",
          padding: "28px 16px",
          position: "sticky", top: 57,
          height: "calc(100vh - 57px)",
          overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: "#B5A898", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Grow Mode</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: "#2C1810", fontWeight: 500, marginBottom: 20, lineHeight: 1.4 }}>React Hooks Full Course</div>

          {chapters.map(c => (
            <div key={c.id} className="aw-chapter-btn"
              onClick={() => !c.locked && setActiveId(c.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 10px", borderRadius: 10,
                cursor: c.locked ? "not-allowed" : "pointer",
                background: c.id === activeId ? "#FDF0E8" : "transparent",
                borderLeft: `3px solid ${c.id === activeId ? "#C4622D" : "transparent"}`,
                opacity: c.locked ? 0.45 : 1,
                transition: "all 0.15s", marginBottom: 4,
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: c.locked ? "#F3EDE3" : c.id < activeId ? "#5A7A5C" : c.id === activeId ? "#FDF0E8" : "#F3EDE3",
                border: `1.5px solid ${c.locked ? "#E2D9CE" : c.id < activeId ? "#5A7A5C" : c.id === activeId ? "#C4622D" : "#E2D9CE"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
              }}>
                {c.locked ? "🔒" : c.id < activeId
                  ? <span style={{ color: "white", fontSize: 9 }}>✓</span>
                  : <span style={{ color: c.id === activeId ? "#C4622D" : "#8C7B6B", fontSize: 9, fontFamily: "'DM Mono',monospace" }}>{c.id}</span>}
              </div>
              <div>
                <div style={{ color: c.id === activeId ? "#C4622D" : "#2C1810", fontSize: 13, fontWeight: c.id === activeId ? 500 : 400 }}>{c.title}</div>
                <div style={{ color: "#B5A898", fontSize: 11 }}>{c.duration}</div>
              </div>
            </div>
          ))}

          {notes.length > 0 && (
            <div onClick={() => setActiveTab("notes")}
              style={{ marginTop: 20, padding: "10px 12px", background: "#FDF5E6", border: "1px solid #E8D098", borderRadius: 10, cursor: "pointer" }}>
              <div style={{ fontSize: 12, color: "#C9952A", fontWeight: 500 }}>📝 {notes.length} note{notes.length > 1 ? "s" : ""} to review</div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: "32px 40px", maxWidth: 760 }}>

          {/* Coin pop */}
          <div style={{ position: "relative", display: "inline-block", float: "right", marginBottom: 16 }}>
            <div style={{ background: "#FDF5E6", border: "1px solid #E8D098", borderRadius: 20, padding: "5px 14px", fontSize: 13, color: "#C9952A", fontFamily: "'DM Mono',monospace" }}>
              🪙 {coins.toLocaleString()}
            </div>
            {coinPop && (
              <span style={{ position: "absolute", top: -32, left: "50%", transform: "translateX(-50%)", color: "#C9952A", fontWeight: 700, fontSize: 14, animation: "coinFloat 1.4s ease forwards", pointerEvents: "none", whiteSpace: "nowrap" }}>
                {coinPop} 🪙
              </span>
            )}
          </div>

          {/* TABS */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
            <button className={`aw-tab-btn ${activeTab === "learn" ? "active" : ""}`} onClick={() => setActiveTab("learn")}>Chapter Content</button>
            <button className={`aw-tab-btn ${activeTab === "notes" ? "active" : ""}`} onClick={() => setActiveTab("notes")}>
              My Notes {notes.length > 0 ? `(${notes.length})` : ""}
            </button>
          </div>

          {/* NOTES TAB */}
          {activeTab === "notes" && (
            <div style={{ animation: "fadeUp 0.3s ease both" }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: "#2C1810", marginBottom: 6 }}>My Notes</h2>
              <p style={{ color: "#8C7B6B", fontSize: 14, marginBottom: 24 }}>Auto-saved from questions you got wrong. Worth a quick look before moving on.</p>
              {notes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#B5A898" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, marginBottom: 6 }}>Nothing here yet</div>
                  <div style={{ fontSize: 13 }}>Notes appear when you get a question wrong.</div>
                </div>
              ) : notes.map((note, i) => (
                <div key={note.id || i} style={{ background: "white", border: "1px solid var(--border)", borderLeft: "4px solid #C9952A", borderRadius: 12, padding: 18, marginBottom: 12, animation: "fadeUp 0.3s ease both" }}>
                  <span style={{ fontSize: 11, color: "#C9952A", background: "#FDF5E6", padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>📖 {note.chapter}</span>
                  <div style={{ color: "#2C1810", fontSize: 14, fontWeight: 500, marginTop: 10, marginBottom: 6 }}>Q: {note.concept}</div>
                  <div style={{ color: "#5A7A5C", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>✓ {note.correct}</div>
                  <div style={{ color: "#8C7B6B", fontSize: 13, lineHeight: 1.6 }}>{note.explanation}</div>
                </div>
              ))}
            </div>
          )}

          {/* LEARN TAB */}
          {activeTab === "learn" && chapter && (
            <>
              <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
                <div style={{ fontSize: 12, color: "#B5A898", marginBottom: 6 }}>Chapter {chapter.id} of {chapters.length}</div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 500, color: "#2C1810", margin: "0 0 10px", letterSpacing: "-0.5px" }}>{chapter.title}</h2>
                <span style={{ fontSize: 11, color: "#5A7A5C", background: "#EEF5EE", padding: "3px 10px", borderRadius: 20, fontWeight: 500, border: "1px solid #C2D9C3" }}>🌱 Grow Mode</span>
              </div>

              {/* SKIP IF YOU KNOW THIS */}
              {skipPhase === "prompt" && (
                <div style={{ background: "#EEF5EE", border: "1px solid #C2D9C3", borderRadius: 12, padding: 18, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeUp 0.4s ease both" }}>
                  <div>
                    <div style={{ color: "#5A7A5C", fontSize: 14, fontWeight: 500, marginBottom: 3 }}>⚡ Already know this?</div>
                    <div style={{ color: "#8C7B6B", fontSize: 13 }}>Answer 2 quick questions to skip and earn 30 🪙</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setSkipPhase("quiz")} style={{ background: "#5A7A5C", border: "none", borderRadius: 8, padding: "8px 16px", color: "white", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>Try it</button>
                    <button onClick={() => setSkipPhase("done")} style={{ background: "transparent", border: "1px solid #C2D9C3", borderRadius: 8, padding: "8px 14px", color: "#8C7B6B", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Skip</button>
                  </div>
                </div>
              )}

              {skipPhase === "quiz" && (
                <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <div style={{ color: "#5A7A5C", fontSize: 14, fontWeight: 500, marginBottom: 16 }}>⚡ Two quick questions</div>
                  {chapter.skipQuestions.map((q, qi) => (
                    <div key={qi} style={{ marginBottom: 16 }}>
                      <div style={{ color: "#2C1810", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{qi + 1}. {q.q}</div>
                      {q.options.map((opt, oi) => (
                        <div key={oi} onClick={() => handleSkipAnswer(qi, oi)}
                          style={{ padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${skipAnswers[qi] === oi ? "#5A7A5C" : "#E2D9CE"}`, background: skipAnswers[qi] === oi ? "#EEF5EE" : "#FAF7F2", cursor: "pointer", fontSize: 13, color: skipAnswers[qi] === oi ? "#5A7A5C" : "#5C3D2E", transition: "all 0.15s", marginBottom: 6 }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button onClick={submitSkip} disabled={skipAnswers.some(a => a === null)}
                    style={{ background: "#5A7A5C", border: "none", borderRadius: 8, padding: "9px 20px", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", opacity: skipAnswers.some(a => a === null) ? 0.5 : 1 }}>
                    Submit
                  </button>
                </div>
              )}

              {skipPhase === "done" && skipResult === "passed" && (
                <div style={{ background: "#EEF5EE", border: "1px solid #C2D9C3", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ color: "#5A7A5C", fontSize: 14, fontWeight: 500 }}>✅ Nailed it! Chapter skipped. +30 🪙</div>
                </div>
              )}
              {skipPhase === "done" && skipResult === "failed" && (
                <div style={{ background: "#FDF5E6", border: "1px solid #E8D098", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ color: "#C9952A", fontSize: 14, fontWeight: 500 }}>Almost! Go through the chapter — the MCQ below will help it click.</div>
                </div>
              )}

              {/* SUMMARY */}
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 22, marginBottom: 16, animation: "fadeUp 0.4s 0.1s ease both" }}>
                <div style={{ color: "#2C1810", fontSize: 13, fontWeight: 500, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>📖 Summary</div>
                <p style={{ color: "#5C3D2E", lineHeight: 1.85, fontSize: 14, margin: 0 }}>{chapter.summary}</p>
              </div>

              {/* MCQ */}
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 22, marginBottom: 16, animation: "fadeUp 0.4s 0.15s ease both" }}>
                <div style={{ color: "#2C1810", fontSize: 13, fontWeight: 500, marginBottom: 14 }}>❓ Check your understanding</div>
                <p style={{ color: "#2C1810", fontSize: 15, fontWeight: 500, marginBottom: 16, lineHeight: 1.5 }}>{chapter.mcq.question}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {chapter.mcq.options.map((opt, i) => {
                    let bg = "#FAF7F2", border = "#E2D9CE", color = "#5C3D2E";
                    if (submitted) {
                      if (i === chapter.mcq.correct) { bg = "#EEF5EE"; border = "#C2D9C3"; color = "#5A7A5C"; }
                      else if (i === selected) { bg = "#FEF0EE"; border = "#F0C4B8"; color = "#A8501F"; }
                    } else if (i === selected) { bg = "#FDF0E8"; border = "#C4622D"; color = "#C4622D"; }
                    return (
                      <div key={i} className={submitted ? "" : "aw-option"}
                        onClick={() => !submitted && setSelected(i)}
                        style={{ padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: bg, cursor: submitted ? "default" : "pointer", display: "flex", gap: 10, alignItems: "center", transition: "all 0.15s" }}>
                        <span style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${border}`, background: i === selected ? (submitted ? (i === chapter.mcq.correct ? "#5A7A5C" : "#C4622D") : "#C4622D") : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>
                          {["A","B","C","D"][i]}
                        </span>
                        <span style={{ color, fontSize: 14 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                {!submitted ? (
                  <button onClick={handleMCQ} disabled={selected === null}
                    style={{ background: selected === null ? "#F3EDE3" : "#C4622D", border: "none", borderRadius: 8, padding: "10px 22px", color: selected === null ? "#B5A898" : "white", fontSize: 13, fontWeight: 500, cursor: selected === null ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                    Submit Answer
                  </button>
                ) : (
                  <div style={{ padding: 14, borderRadius: 10, background: feedback?.correct ? "#EEF5EE" : "#FEF0EE", border: `1px solid ${feedback?.correct ? "#C2D9C3" : "#F0C4B8"}` }}>
                    <div style={{ color: feedback?.correct ? "#5A7A5C" : "#A8501F", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      {feedback?.correct ? "✅ Correct! +50 🪙" : "❌ Not quite"}
                    </div>
                    <div style={{ color: "#5C3D2E", fontSize: 13, lineHeight: 1.6 }}>{chapter.mcq.explanation}</div>
                    {!feedback?.correct && <div style={{ color: "#C9952A", fontSize: 12, marginTop: 8, fontStyle: "italic" }}>📝 Saved to your notes</div>}
                  </div>
                )}
              </div>

              {/* CODE */}
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 22, marginBottom: 16, animation: "fadeUp 0.4s 0.2s ease both" }}>
                <div style={{ color: "#2C1810", fontSize: 13, fontWeight: 500, marginBottom: 10 }}>💻 Coding Challenge</div>
                <p style={{ color: "#8C7B6B", fontSize: 13, marginBottom: 14, fontStyle: "italic" }}>{chapter.code.prompt}</p>
                <div style={{ background: "#1A1412", borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 6, padding: "10px 14px", background: "#231A17", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                    <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>solution.jsx</span>
                  </div>
                  <textarea value={codeVal} onChange={e => setCodeVal(e.target.value)}
                    style={{ width: "100%", background: "transparent", border: "none", color: "#E8D9CC", fontFamily: "'DM Mono',monospace", fontSize: 13, lineHeight: 1.7, padding: 16, resize: "vertical", minHeight: 180, outline: "none", boxSizing: "border-box" }} />
                </div>
                {!codeSubmitted ? (
                  <button onClick={handleCodeSubmit} style={{ background: "#2C1810", border: "none", borderRadius: 8, padding: "10px 22px", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    Submit Code
                  </button>
                ) : (
                  <div style={{ padding: 12, borderRadius: 8, background: "#EEF5EE", border: "1px solid #C2D9C3" }}>
                    <div style={{ color: "#5A7A5C", fontSize: 13, fontWeight: 500 }}>✅ Submitted! +50 🪙</div>
                  </div>
                )}
              </div>

              {/* PRACTICE PROBLEMS */}
              {(submitted || codeSubmitted) && (
                <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 22, marginBottom: 16, animation: "fadeUp 0.4s ease both" }}>
                  <div style={{ color: "#2C1810", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>🏋️ Practice Problems</div>
                  <p style={{ color: "#8C7B6B", fontSize: 13, marginBottom: 16, fontStyle: "italic" }}>Ready to go deeper? Pick your level.</p>
                  {chapter.practiceProblems.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="aw-practice-row"
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#FAF7F2", border: "1px solid #E2D9CE", borderRadius: 10, textDecoration: "none", marginBottom: 8, transition: "all 0.15s" }}>
                      <span style={{ fontSize: 11, color: LEVEL_COLORS[p.level], background: "#F3EDE3", padding: "2px 8px", borderRadius: 20, fontWeight: 600, minWidth: 50, textAlign: "center" }}>{p.level}</span>
                      <span style={{ flex: 1, color: "#2C1810", fontSize: 14 }}>{p.name}</span>
                      <span style={{ fontSize: 11, color: PLATFORM_COLORS[p.platform], fontWeight: 500 }}>{p.platform} →</span>
                    </a>
                  ))}
                </div>
              )}

              {/* UNLOCK BANNER */}
              {unlockBanner && chapter.id < chapters.length && (
                <div style={{ background: "#EEF5EE", border: "1px solid #C2D9C3", borderRadius: 14, padding: 20, animation: "unlock 0.4s ease both", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#2C1810", fontWeight: 500 }}>Chapter {chapter.id + 1} unlocked 🎉</div>
                    <div style={{ color: "#8C7B6B", fontSize: 13, marginTop: 3 }}>{chapters[chapter.id]?.title}</div>
                  </div>
                  <button onClick={() => setActiveId(chapter.id + 1)} style={{ background: "#5A7A5C", border: "none", borderRadius: 8, padding: "9px 18px", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Continue →</button>
                </div>
              )}

              {unlockBanner && chapter.id === chapters.length && (
                <div style={{ background: "#FDF0E8", border: "1px solid #F0C4A8", borderRadius: 14, padding: 24, animation: "unlock 0.4s ease both", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🏆</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#2C1810", marginBottom: 6 }}>Course complete!</div>
                  <div style={{ color: "#8C7B6B", fontSize: 14, marginBottom: 16 }}>You've finished all chapters. Check your dashboard.</div>
                  <button onClick={() => navigate("/dashboard")} style={{ background: "#C4622D", border: "none", borderRadius: 8, padding: "10px 22px", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>View Dashboard →</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}