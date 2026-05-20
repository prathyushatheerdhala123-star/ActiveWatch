import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAnswer, getCoins, addCoins, addNote, getNotes, addCompletedTopic } from "../api.js";

const CHAPTERS = [
  {
    id: 1, title: "useState & useEffect", duration: "12 min", locked: false,
    topic: "useState",
    summary: "useState lets you add reactive state to functional components. useEffect handles side effects like data fetching, subscriptions, and DOM manipulation. Together they replace class component lifecycle methods.",
    skipQuestions: [
      { q: "What does useState return?", options: ["A value only", "A setter only", "An array: [value, setter]", "An object"], correct: 2 },
      { q: "When does useEffect run by default?", options: ["Only once on mount", "Only on unmount", "After every render", "Never automatically"], correct: 2 },
    ],
    mcq: {
      question: "What is the correct way to update state based on the previous value?",
      options: ["setState(state + 1)", "setState(prev => prev + 1)", "state = state + 1", "setState({ state: state + 1 })"],
      correct: 1,
      explanation: "Using the functional form setState(prev => prev + 1) is safer because React may batch state updates. Always use the functional form when the new state depends on the old state.",
    },
    code: {
      prompt: "Fix this component so it fetches user data on mount and displays it:",
      starter: `function UserCard({ userId }) {
  const [user, setUser] = useState(null);

  // TODO: fetch user on mount
  // fetch(\`/api/users/\${userId}\`)
  //   .then(r => r.json())
  //   .then(data => setUser(data));

  return <div>{user ? user.name : "Loading..."}</div>;
}`,
    },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Design Counter Component",        url: "https://leetcode.com/problems/create-hello-world-function/" },
      { level: "Medium", platform: "HackerRank", name: "Implement useToggle Custom Hook", url: "https://www.hackerrank.com/domains/react" },
      { level: "Hard",   platform: "GFG",        name: "Build useState from Scratch",     url: "https://www.geeksforgeeks.org/reactjs-hooks/" },
    ],
  },
  {
    id: 2, title: "useContext & useRef", duration: "14 min", locked: true,
    topic: "useContext",
    summary: "useContext lets you read and subscribe to context without prop drilling. useRef gives you a mutable ref object that persists across renders without causing re-renders — perfect for DOM access and storing previous values.",
    skipQuestions: [
      { q: "What problem does useContext solve?", options: ["State management", "Prop drilling", "Performance", "Side effects"], correct: 1 },
      { q: "Does updating a useRef value trigger a re-render?", options: ["Yes always", "No never", "Only in strict mode", "Depends on the value"], correct: 1 },
    ],
    mcq: {
      question: "What must you do before using useContext in a component?",
      options: ["Import React", "Wrap the component tree in a Provider", "Call createContext inside the component", "None of the above"],
      correct: 1,
      explanation: "You must wrap the component tree in a Context.Provider with a value prop. Components that call useContext will re-render whenever the Provider's value changes.",
    },
    code: {
      prompt: "Use useRef to focus an input when the button is clicked:",
      starter: `function FocusInput() {
  // TODO: create a ref
  // TODO: attach it to the input
  // TODO: call .focus() on button click

  return (
    <div>
      <input placeholder="Click the button to focus me" />
      <button onClick={/* TODO */}>Focus Input</button>
    </div>
  );
}`,
    },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Theme Switcher with Context",    url: "https://leetcode.com" },
      { level: "Medium", platform: "HackerRank", name: "Auth Context Implementation",    url: "https://hackerrank.com" },
      { level: "Hard",   platform: "GFG",        name: "Build React Context from Scratch", url: "https://geeksforgeeks.org" },
    ],
  },
  {
    id: 3, title: "Custom Hooks", duration: "18 min", locked: true,
    topic: "custom hooks",
    summary: "Custom Hooks let you extract component logic into reusable functions. A Custom Hook is just a JavaScript function whose name starts with 'use' and can call other hooks. They're the primary way to share stateful logic between components.",
    skipQuestions: [
      { q: "Custom hooks must start with which prefix?", options: ["hook", "use", "custom", "get"], correct: 1 },
      { q: "Can custom hooks call other hooks?", options: ["No", "Yes", "Only built-in hooks", "Only in production"], correct: 1 },
    ],
    mcq: {
      question: "Which of these is a valid Custom Hook?",
      options: ["function getData() { useState(null) }", "function useData() { return useState(null) }", "const useData = { state: null }", "class useData extends Hook {}"],
      correct: 1,
      explanation: "A custom hook must be a function prefixed with 'use' and can call other hooks inside it. The return value is up to you — usually state and functions to manipulate it.",
    },
    code: {
      prompt: "Extract this fetch logic into a reusable useFetch hook:",
      starter: `// Convert this component logic into a custom useFetch hook
// It should accept a URL and return { data, loading, error }

function useFetch(url) {
  // TODO: implement using useState and useEffect
}

// Usage:
// const { data, loading, error } = useFetch('/api/posts');`,
    },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Implement useLocalStorage",  url: "https://leetcode.com" },
      { level: "Medium", platform: "HackerRank", name: "Build useDebounce Hook",      url: "https://hackerrank.com" },
      { level: "Hard",   platform: "GFG",        name: "Create useInfiniteScroll",    url: "https://geeksforgeeks.org" },
    ],
  },
  {
    id: 4, title: "Performance Hooks", duration: "20 min", locked: true,
    topic: "useMemo",
    summary: "useMemo memoizes expensive computations so they only re-run when dependencies change. useCallback memoizes functions so child components don't re-render unnecessarily. React.memo prevents re-renders when props haven't changed.",
    skipQuestions: [
      { q: "What does useMemo prevent?", options: ["State updates", "Re-renders", "Expensive recalculations", "Network calls"], correct: 2 },
      { q: "useCallback memoizes what?", options: ["Values", "Functions", "Components", "State"], correct: 1 },
    ],
    mcq: {
      question: "When should you use useMemo?",
      options: ["For every variable", "Only for API calls", "For expensive calculations that depend on changing values", "For all state updates"],
      correct: 2,
      explanation: "useMemo is for expensive computations. Using it everywhere adds overhead. Only memoize when you have a genuinely expensive calculation and profiling shows it's a bottleneck.",
    },
    code: {
      prompt: "Fix this component with useMemo to avoid expensive recalculation on every render:",
      starter: `function ProductList({ products, filterTerm }) {
  // This runs on EVERY render — expensive!
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  // TODO: wrap the above in useMemo
  // so it only recalculates when products or filterTerm changes

  return filtered.map(p => <div key={p.id}>{p.name}</div>);
}`,
    },
    practiceProblems: [
      { level: "Easy",   platform: "LeetCode",   name: "Memoize Function Results",       url: "https://leetcode.com/problems/memoize/" },
      { level: "Medium", platform: "HackerRank", name: "Optimise List with useMemo",     url: "https://hackerrank.com" },
      { level: "Hard",   platform: "GFG",        name: "React Performance Optimisation", url: "https://geeksforgeeks.org" },
    ],
  },
];

const PLATFORM_COLORS = {
  LeetCode:   { color: "#F89F1B", bg: "#FEF3E8", border: "#F0CEAA" },
  HackerRank: { color: "#2EC866", bg: "#E6F9EE", border: "#A8E6C0" },
  GFG:        { color: "#2F8D46", bg: "#E8F5E9", border: "#A5D6A7" },
};
const LEVEL_COLORS = {
  Easy:   { color: "#2A7D52", bg: "#E6F4EE" },
  Medium: { color: "#C47B2B", bg: "#FEF3E8" },
  Hard:   { color: "#E24B4A", bg: "#FCEBEB" },
};

export default function GrowMode() {
  const navigate = useNavigate();
  const [chapters, setChapters]     = useState(CHAPTERS);
  const [activeId, setActiveId]     = useState(1);
  const [coins, setCoins]           = useState(getCoins());
  const [coinPop, setCoinPop]       = useState(null);
  const [selected, setSelected]     = useState(null);
  const [submitted, setSubmitted]   = useState(false);
  const [feedback, setFeedback]     = useState(null);
  const [codeVal, setCodeVal]       = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [unlockBanner, setUnlockBanner]   = useState(false);
  const [activeTab, setActiveTab]   = useState("learn"); // "learn" | "notes"
  const [notes, setNotes]           = useState(getNotes());

  // Skip If You Know This
  const [skipPhase, setSkipPhase]   = useState("prompt"); // "prompt" | "quiz" | "done"
  const [skipAnswers, setSkipAnswers] = useState([null, null]);
  const [skipResult, setSkipResult]   = useState(null); // "passed" | "failed"

  const chapter = chapters.find(c => c.id === activeId);

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
    setFeedback(null);
    setCodeVal(chapter?.code?.starter || "");
    setCodeSubmitted(false);
    setUnlockBanner(false);
    setSkipPhase("prompt");
    setSkipAnswers([null, null]);
    setSkipResult(null);
  }, [activeId]);

  function popCoins(amount) {
    const updated = addCoins(amount);
    setCoins(updated);
    setCoinPop(`+${amount}`);
    setTimeout(() => setCoinPop(null), 1200);
  }

  async function handleMCQ() {
    if (selected === null) return;
    const res = await verifyAnswer({
      question: chapter.mcq.question,
      options: chapter.mcq.options,
      userAnswer: selected,
      correctAnswer: chapter.mcq.correct,
    });
    setFeedback(res);
    setSubmitted(true);
    if (res.correct) {
      popCoins(50);
    } else if (res.note) {
      const newNote = {
        chapter: chapter.title,
        concept: chapter.mcq.question,
        explanation: res.feedback,
        correct: chapter.mcq.options[chapter.mcq.correct],
      };
      const updated = addNote(newNote);
      setNotes(updated);
    }
    if (res.correct && codeSubmitted) triggerUnlock();
  }

  function handleCodeSubmit() {
    setCodeSubmitted(true);
    popCoins(50);
    if (submitted && feedback?.correct) triggerUnlock();
    else if (!submitted) triggerUnlock();
  }

  function triggerUnlock() {
    addCompletedTopic(chapter.topic);
    setUnlockBanner(true);
    const nextId = chapter.id + 1;
    if (nextId <= chapters.length) {
      setChapters(prev => prev.map(c => c.id === nextId ? { ...c, locked: false } : c));
    }
  }

  // Skip logic
  function handleSkipAnswer(qIdx, optIdx) {
    const updated = [...skipAnswers];
    updated[qIdx] = optIdx;
    setSkipAnswers(updated);
  }

  function submitSkip() {
    const allCorrect = chapter.skipQuestions.every((q, i) => skipAnswers[i] === q.correct);
    setSkipResult(allCorrect ? "passed" : "failed");
    if (allCorrect) {
      popCoins(30);
      addCompletedTopic(chapter.topic);
      const nextId = chapter.id + 1;
      if (nextId <= chapters.length) {
        setChapters(prev => prev.map(c => c.id === nextId ? { ...c, locked: false } : c));
      }
      setSkipPhase("done");
    } else {
      setSkipPhase("done");
    }
  }

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes coinFloat{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-48px)}}
        @keyframes unlock{0%{opacity:0;transform:scale(0.9)}100%{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .aw-nav-btn:hover{color:#7C6FCD!important;}
        .aw-chapter:hover{background:#F7F6FB!important;}
        .aw-option:hover{border-color:#C9C2F0!important;}
        .aw-tab:hover{color:#7C6FCD!important;}
      `}</style>

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => navigate("/")}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C6FCD" }} />
          <span style={{ color: "#1E1B2E", fontWeight: 600 }}>Active</span>
          <span style={{ color: "#7C6FCD", fontWeight: 600 }}>Watch</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {[["Home", "/"], ["Dashboard", "/dashboard"], ["Collect", "/collect"]].map(([l, p]) => (
            <button key={l} className="aw-nav-btn" onClick={() => navigate(p)}
              style={{ background: "none", border: "none", color: "#9794A8", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>{l}</button>
          ))}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, background: "#FEF3E8", border: "1px solid #F0CEAA", borderRadius: 20, padding: "5px 12px", fontSize: 14, color: "#C47B2B", fontFamily: "'JetBrains Mono',monospace" }}>
            🪙 {coins.toLocaleString()}
            {coinPop && (
              <span style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", color: "#C47B2B", fontWeight: 700, fontSize: 14, animation: "coinFloat 1.2s ease forwards", pointerEvents: "none", whiteSpace: "nowrap" }}>
                {coinPop} 🪙
              </span>
            )}
          </div>
        </div>
      </nav>

      <div style={S.layout}>
        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          <div style={{ fontSize: 11, color: "#C9C2F0", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 14 }}>GROW MODE</div>
          <div style={{ fontSize: 13, color: "#1E1B2E", fontWeight: 600, marginBottom: 16, lineHeight: 1.4 }}>React Hooks Full Course</div>
          {chapters.map(c => (
            <div key={c.id} className="aw-chapter"
              onClick={() => !c.locked && setActiveId(c.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 8, cursor: c.locked ? "not-allowed" : "pointer",
                background: c.id === activeId ? "#EDE9FB" : "transparent",
                borderLeft: c.id === activeId ? "3px solid #7C6FCD" : "3px solid transparent",
                opacity: c.locked ? 0.5 : 1, transition: "all 0.15s", marginBottom: 4,
              }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: c.locked ? "#F0EEF9" : c.id < activeId ? "#7C6FCD" : c.id === activeId ? "#EDE9FB" : "#F0EEF9", border: `1.5px solid ${c.locked ? "#D8D4EC" : c.id < activeId ? "#7C6FCD" : c.id === activeId ? "#7C6FCD" : "#D8D4EC"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>
                {c.locked ? "🔒" : c.id < activeId ? <span style={{ color: "white" }}>✓</span> : <span style={{ color: c.id === activeId ? "#7C6FCD" : "#9794A8", fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }}>{c.id}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: c.id === activeId ? "#7C6FCD" : "#1E1B2E", fontSize: 13, fontWeight: c.id === activeId ? 600 : 400 }}>{c.title}</div>
                <div style={{ color: "#9794A8", fontSize: 11 }}>{c.duration}</div>
              </div>
            </div>
          ))}

          {/* Notes count badge in sidebar */}
          {notes.length > 0 && (
            <div style={{ marginTop: 20, padding: "10px 12px", background: "#FEF3E8", border: "1px solid #F0CEAA", borderRadius: 8, cursor: "pointer" }} onClick={() => setActiveTab("notes")}>
              <div style={{ fontSize: 12, color: "#C47B2B", fontWeight: 600 }}>📝 {notes.length} note{notes.length > 1 ? "s" : ""}</div>
              <div style={{ fontSize: 11, color: "#9794A8", marginTop: 2 }}>Concepts to revisit</div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main style={S.main}>

          {/* TABS */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E8E4F0", marginBottom: 20 }}>
            {[["learn", "📖 Chapter Content"], ["notes", `📝 My Notes ${notes.length > 0 ? `(${notes.length})` : ""}`]].map(([tab, label]) => (
              <button key={tab} className="aw-tab" onClick={() => setActiveTab(tab)}
                style={{ background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab ? "#7C6FCD" : "transparent"}`, color: activeTab === tab ? "#7C6FCD" : "#9794A8", fontSize: 14, fontWeight: activeTab === tab ? 600 : 400, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", marginBottom: -1 }}>
                {label}
              </button>
            ))}
          </div>

          {/* NOTES TAB */}
          {activeTab === "notes" && (
            <div style={{ animation: "fadeUp 0.3s ease both" }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ color: "#1E1B2E", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>My Notes</h2>
                <p style={{ color: "#9794A8", fontSize: 13, margin: 0 }}>Auto-generated from questions you got wrong. Review these before moving on.</p>
              </div>
              {notes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#C9C2F0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                  <div style={{ fontSize: 15, marginBottom: 6 }}>No notes yet</div>
                  <div style={{ fontSize: 13 }}>Notes appear here when you get a question wrong — they help you review the right concepts.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {notes.map((note, i) => (
                    <div key={note.id || i} style={{ background: "#FFFFFF", border: "1px solid #F0CEAA", borderLeft: "4px solid #C47B2B", borderRadius: 10, padding: 16, animation: "fadeUp 0.3s ease both" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "#C47B2B", background: "#FEF3E8", padding: "2px 8px", borderRadius: 20, fontWeight: 600, border: "1px solid #F0CEAA" }}>📖 {note.chapter}</span>
                      </div>
                      <div style={{ color: "#1E1B2E", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Q: {note.concept}</div>
                      <div style={{ color: "#2A7D52", fontSize: 13, marginBottom: 6 }}><strong>✓ Correct answer:</strong> {note.correct}</div>
                      <div style={{ color: "#6B6880", fontSize: 13, lineHeight: 1.6 }}>{note.explanation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LEARN TAB */}
          {activeTab === "learn" && chapter && (
            <>
              {/* CHAPTER HEADER */}
              <div style={{ animation: "fadeUp 0.4s ease both", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#9794A8", marginBottom: 6 }}>Chapter {chapter.id} of {chapters.length}</div>
                <h2 style={{ color: "#1E1B2E", fontSize: 22, fontWeight: 600, margin: "0 0 4px", letterSpacing: "-0.3px" }}>{chapter.title}</h2>
                <span style={{ fontSize: 11, color: "#7C6FCD", background: "#EDE9FB", padding: "2px 10px", borderRadius: 20, fontWeight: 600, border: "1px solid #C9C2F0" }}>🎓 Grow Mode</span>
              </div>

              {/* SKIP IF YOU KNOW THIS */}
              {skipPhase === "prompt" && (
                <div style={{ ...S.card, border: "1px solid #C9C2F0", background: "#EDE9FB", marginBottom: 20, animation: "fadeUp 0.4s 0.05s ease both" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#7C6FCD", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>⚡ Skip If You Know This</div>
                      <div style={{ color: "#6B6880", fontSize: 13 }}>Answer 2 quick questions correctly to skip this chapter and earn 30 🪙</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setSkipPhase("quiz")}
                        style={{ background: "#7C6FCD", border: "none", borderRadius: 8, padding: "8px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Try it
                      </button>
                      <button onClick={() => setSkipPhase("done")}
                        style={{ background: "transparent", border: "1px solid #C9C2F0", borderRadius: 8, padding: "8px 16px", color: "#9794A8", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        Skip this
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {skipPhase === "quiz" && (
                <div style={{ ...S.card, border: "1px solid #C9C2F0", marginBottom: 20, animation: "fadeUp 0.3s ease both" }}>
                  <div style={{ color: "#7C6FCD", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>⚡ Fast Check — 2 Questions</div>
                  {chapter.skipQuestions.map((q, qi) => (
                    <div key={qi} style={{ marginBottom: 16 }}>
                      <div style={{ color: "#1E1B2E", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{qi + 1}. {q.q}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {q.options.map((opt, oi) => (
                          <div key={oi} onClick={() => handleSkipAnswer(qi, oi)}
                            style={{ padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${skipAnswers[qi] === oi ? "#7C6FCD" : "#E8E4F0"}`, background: skipAnswers[qi] === oi ? "#EDE9FB" : "#FAFAFA", cursor: "pointer", fontSize: 13, color: skipAnswers[qi] === oi ? "#7C6FCD" : "#6B6880", transition: "all 0.15s" }}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={submitSkip} disabled={skipAnswers.some(a => a === null)}
                    style={{ background: "#7C6FCD", border: "none", borderRadius: 8, padding: "9px 20px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: skipAnswers.some(a => a === null) ? 0.5 : 1 }}>
                    Submit
                  </button>
                </div>
              )}

              {skipPhase === "done" && skipResult === "passed" && (
                <div style={{ ...S.card, border: "1px solid #B2D9C4", background: "#E6F4EE", marginBottom: 20, animation: "unlock 0.4s ease both" }}>
                  <div style={{ color: "#2A7D52", fontSize: 14, fontWeight: 600 }}>✅ You passed! Chapter skipped. +30 🪙 earned.</div>
                </div>
              )}

              {skipPhase === "done" && skipResult === "failed" && (
                <div style={{ ...S.card, border: "1px solid #F0CEAA", background: "#FEF3E8", marginBottom: 20, animation: "fadeUp 0.3s ease both" }}>
                  <div style={{ color: "#C47B2B", fontSize: 14, fontWeight: 600 }}>Not quite — but that's fine! Go through the chapter and try the MCQ below.</div>
                </div>
              )}

              {/* SUMMARY */}
              <div style={{ ...S.card, animation: "fadeUp 0.4s 0.1s ease both", marginBottom: 16 }}>
                <div style={S.sectionTitle}>📖 Summary</div>
                <p style={{ color: "#6B6880", lineHeight: 1.8, fontSize: 14, margin: 0 }}>{chapter.summary}</p>
              </div>

              {/* MCQ */}
              <div style={{ ...S.card, animation: "fadeUp 0.4s 0.15s ease both", marginBottom: 16 }}>
                <div style={S.sectionTitle}>❓ Comprehension Check</div>
                <p style={{ color: "#1E1B2E", fontSize: 14, fontWeight: 500, marginBottom: 14 }}>{chapter.mcq.question}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {chapter.mcq.options.map((opt, i) => {
                    let bg = "#FAFAFA", border = "#E8E4F0", color = "#6B6880";
                    if (submitted) {
                      if (i === chapter.mcq.correct) { bg = "#E6F4EE"; border = "#B2D9C4"; color = "#2A7D52"; }
                      else if (i === selected) { bg = "#FCEBEB"; border = "#F09595"; color = "#A32D2D"; }
                    } else if (i === selected) { bg = "#EDE9FB"; border = "#7C6FCD"; color = "#7C6FCD"; }
                    return (
                      <div key={i} className={submitted ? "" : "aw-option"} onClick={() => !submitted && setSelected(i)}
                        style={{ padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${border}`, background: bg, cursor: submitted ? "default" : "pointer", display: "flex", gap: 10, alignItems: "center", transition: "all 0.15s" }}>
                        <span style={{ width: 22, height: 22, borderRadius: 5, border: `1.5px solid ${border}`, background: i === selected ? (submitted ? (i === chapter.mcq.correct ? "#2A7D52" : "#E24B4A") : "#7C6FCD") : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", flexShrink: 0, fontFamily: "'JetBrains Mono',monospace", transition: "all 0.15s" }}>
                          {["A","B","C","D"][i]}
                        </span>
                        <span style={{ color, fontSize: 14 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                {!submitted ? (
                  <button onClick={handleMCQ} disabled={selected === null}
                    style={{ background: selected === null ? "#F0EEF9" : "#7C6FCD", border: "none", borderRadius: 8, padding: "10px 20px", color: selected === null ? "#C9C2F0" : "white", fontSize: 13, fontWeight: 600, cursor: selected === null ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                    Submit Answer
                  </button>
                ) : (
                  <div style={{ padding: 12, borderRadius: 8, background: feedback?.correct ? "#E6F4EE" : "#FCEBEB", border: `1px solid ${feedback?.correct ? "#B2D9C4" : "#F09595"}` }}>
                    <div style={{ color: feedback?.correct ? "#2A7D52" : "#A32D2D", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      {feedback?.correct ? "✅ Correct! +50 🪙" : "❌ Incorrect"}
                    </div>
                    <div style={{ color: feedback?.correct ? "#2A7D52" : "#6B6880", fontSize: 13, lineHeight: 1.6 }}>{chapter.mcq.explanation}</div>
                    {!feedback?.correct && <div style={{ color: "#C47B2B", fontSize: 12, marginTop: 6 }}>📝 Added to your Notes tab for review</div>}
                  </div>
                )}
              </div>

              {/* CODE CHALLENGE */}
              <div style={{ ...S.card, animation: "fadeUp 0.4s 0.2s ease both", marginBottom: 16 }}>
                <div style={S.sectionTitle}>💻 Coding Challenge</div>
                <p style={{ color: "#6B6880", fontSize: 13, marginBottom: 12 }}>{chapter.code.prompt}</p>
                <div style={{ background: "#1E1B2E", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 6, padding: "10px 14px", background: "#2A2740", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
                    <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>solution.jsx</span>
                  </div>
                  <textarea value={codeVal} onChange={e => setCodeVal(e.target.value)}
                    style={{ width: "100%", background: "transparent", border: "none", color: "#E2E8F0", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.7, padding: 16, resize: "vertical", minHeight: 180, outline: "none", boxSizing: "border-box" }} />
                </div>
                {!codeSubmitted ? (
                  <button onClick={handleCodeSubmit}
                    style={{ background: "#7C6FCD", border: "none", borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Submit Code
                  </button>
                ) : (
                  <div style={{ padding: 12, borderRadius: 8, background: "#E6F4EE", border: "1px solid #B2D9C4" }}>
                    <div style={{ color: "#2A7D52", fontSize: 13, fontWeight: 600 }}>✅ Code submitted! +50 🪙</div>
                  </div>
                )}
              </div>

              {/* PRACTICE PROBLEMS */}
              {(submitted || codeSubmitted) && (
                <div style={{ ...S.card, animation: "fadeUp 0.4s ease both", marginBottom: 16 }}>
                  <div style={S.sectionTitle}>🏋️ Practice Problems</div>
                  <p style={{ color: "#9794A8", fontSize: 13, marginBottom: 14 }}>Reinforce what you just learned. Pick your level.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {chapter.practiceProblems.map((p, i) => {
                      const lc = LEVEL_COLORS[p.level];
                      const pc = PLATFORM_COLORS[p.platform];
                      return (
                        <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#FAFAFA", border: "1px solid #E8E4F0", borderRadius: 10, textDecoration: "none", transition: "all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "#C9C2F0"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "#E8E4F0"}>
                          <span style={{ fontSize: 11, color: lc.color, background: lc.bg, padding: "2px 8px", borderRadius: 20, fontWeight: 600, flexShrink: 0, minWidth: 52, textAlign: "center" }}>{p.level}</span>
                          <span style={{ flex: 1, color: "#1E1B2E", fontSize: 14 }}>{p.name}</span>
                          <span style={{ fontSize: 11, color: pc.color, background: pc.bg, padding: "2px 8px", borderRadius: 20, border: `1px solid ${pc.border}`, fontWeight: 500, flexShrink: 0 }}>{p.platform}</span>
                          <span style={{ color: "#C9C2F0", fontSize: 12 }}>→</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* UNLOCK BANNER */}
              {unlockBanner && chapter.id < chapters.length && (
                <div style={{ ...S.card, border: "1px solid #B2D9C4", background: "#E6F4EE", animation: "unlock 0.5s ease both", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#2A7D52", fontSize: 15, fontWeight: 600 }}>🎉 Chapter {chapter.id + 1} Unlocked!</div>
                      <div style={{ color: "#9794A8", fontSize: 13, marginTop: 4 }}>{chapters[chapter.id]?.title}</div>
                    </div>
                    <button onClick={() => setActiveId(chapter.id + 1)}
                      style={{ background: "#2A7D52", border: "none", borderRadius: 8, padding: "9px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {unlockBanner && chapter.id === chapters.length && (
                <div style={{ ...S.card, border: "1px solid #C9C2F0", background: "#EDE9FB", animation: "unlock 0.5s ease both", marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
                  <div style={{ color: "#7C6FCD", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Course Complete!</div>
                  <div style={{ color: "#9794A8", fontSize: 13 }}>You've completed all chapters. Check your Dashboard to see your progress.</div>
                  <button onClick={() => navigate("/dashboard")} style={{ marginTop: 14, background: "#7C6FCD", border: "none", borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    View Dashboard →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const S = {
  root:         { minHeight: "100vh", background: "#F7F6FB", fontFamily: "'Space Grotesk',sans-serif", color: "#6B6880", display: "flex", flexDirection: "column" },
  nav:          { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 32px", borderBottom: "1px solid #E8E4F0", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
  logo:         { display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" },
  layout:       { display: "flex", flex: 1 },
  sidebar:      { width: 260, flexShrink: 0, borderRight: "1px solid #E8E4F0", padding: "24px 16px", background: "#FFFFFF", minHeight: "calc(100vh - 57px)", position: "sticky", top: 57, alignSelf: "flex-start", height: "calc(100vh - 57px)", overflowY: "auto" },
  main:         { flex: 1, padding: "28px 36px", maxWidth: 760 },
  card:         { background: "#FFFFFF", border: "1px solid #E8E4F0", borderRadius: 12, padding: 18, boxShadow: "0 1px 3px rgba(124,111,205,0.04)" },
  sectionTitle: { color: "#1E1B2E", fontSize: 14, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 },
};
