import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAnswer, getCoins, addCoins } from "../api.js";

// ─── Chapter data with real coding challenges ────────────────────────────────
const CHAPTERS = [
  {
    id: 1,
    title: "useState & useEffect",
    duration: "12 min",
    summary: "useState lets you store values that change over time inside a component. When state changes, React re-renders the component. useEffect lets you run code after the component renders — perfect for fetching data, timers, or subscriptions.",
    mcq: {
      question: "Which hook would you use to fetch data when a component first loads?",
      options: ["useState", "useEffect", "useContext", "useRef"],
      answer: 1,
    },
    challenge: {
      title: "Fix the counter",
      description: "The counter below is broken — clicking the button does nothing. Fix the useState call so the count starts at 0 and the button increments it correctly.",
      starterCode:
`function Counter() {
  // Fix this line — count should start at 0
  const [count, setCount] = useState();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
      // What we actually run to test their solution
      testCode: (userCode) => {
        // Extract what they passed to useState
        const match = userCode.match(/useState\s*\(\s*([^)]*)\s*\)/);
        if (!match) return { pass: false, message: "Could not find useState() call in your code." };
        const arg = match[1].trim();
        if (arg === "0") return { pass: true, message: "All tests passed! useState(0) correctly initialises count to 0." };
        if (arg === "") return { pass: false, message: "useState() has no argument. It should be useState(0) to start at 0." };
        return { pass: false, message: `useState(${arg}) is wrong. The count should start at 0, so use useState(0).` };
      },
      hint: "useState takes one argument — the initial value. If count should start at 0, write useState(0).",
    },
  },
  {
    id: 2,
    title: "useContext & useRef",
    duration: "14 min",
    summary: "useContext lets components read from a shared context without passing props through every level. useRef gives you a reference to a DOM element — for example, to focus an input programmatically without triggering a re-render.",
    mcq: {
      question: "Which hook gives you direct access to a DOM element without causing a re-render?",
      options: ["useState", "useContext", "useRef", "useMemo"],
      answer: 2,
    },
    challenge: {
      title: "Focus the input",
      description: "Complete the SearchBar so that clicking the 'Focus' button programmatically focuses the input field. Use useRef to create a reference to the input.",
      starterCode:
`function SearchBar() {
  // Step 1: create a ref
  const inputRef = useRef(___);

  function handleFocus() {
    // Step 2: call .focus() on the ref
    inputRef.current.___;
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={handleFocus}>Focus</button>
    </div>
  );
}`,
      testCode: (userCode) => {
        const hasNull  = userCode.includes("useRef(null)");
        const hasFocus = userCode.includes("inputRef.current.focus()");
        if (!hasNull && !hasFocus) return { pass: false, message: "Two things missing: useRef(null) and inputRef.current.focus()." };
        if (!hasNull) return { pass: false, message: "useRef needs an initial value of null. Write useRef(null)." };
        if (!hasFocus) return { pass: false, message: "To focus the input, write inputRef.current.focus() inside handleFocus." };
        return { pass: true, message: "All tests passed! useRef(null) creates the ref, and .focus() activates it." };
      },
      hint: "useRef(null) creates the ref. Then inputRef.current.focus() calls the browser's native focus method.",
    },
  },
  {
    id: 3,
    title: "Custom Hooks",
    duration: "18 min",
    summary: "A custom hook is a JavaScript function whose name starts with 'use'. It can call other hooks inside it, letting you extract and reuse stateful logic across multiple components — keeping your components clean and focused.",
    mcq: {
      question: "What must every custom hook name start with?",
      options: ["hook", "my", "use", "custom"],
      answer: 2,
    },
    challenge: {
      title: "Build a useToggle hook",
      description: "Complete the useToggle custom hook. It should return a boolean value and a function to flip it. Then use it in the component below.",
      starterCode:
`// Complete this custom hook
function useToggle(initialValue) {
  const [value, setValue] = useState(___);

  function toggle() {
    setValue(prev => ___);
  }

  return [value, toggle];
}

function DarkModeButton() {
  const [isDark, toggleDark] = useToggle(false);
  return (
    <button onClick={toggleDark}>
      Mode: {isDark ? "Dark" : "Light"}
    </button>
  );
}`,
      testCode: (userCode) => {
        const hasInitial = userCode.includes("useState(initialValue)");
        const hasToggle  = userCode.includes("!prev") || userCode.includes("prev => !prev");
        if (!hasInitial && !hasToggle) return { pass: false, message: "Two things missing: useState(initialValue) and the toggle logic prev => !prev." };
        if (!hasInitial) return { pass: false, message: "The hook should initialise with the argument: useState(initialValue)." };
        if (!hasToggle)  return { pass: false, message: "The toggle should flip the value: setValue(prev => !prev)." };
        return { pass: true, message: "All tests passed! Your useToggle hook correctly initialises and flips the boolean." };
      },
      hint: "The initial state comes from the argument: useState(initialValue). To flip a boolean: setValue(prev => !prev).",
    },
  },
  {
    id: 4,
    title: "Performance Hooks",
    duration: "20 min",
    summary: "useMemo memoizes an expensive computed value so it only recalculates when its dependencies change. useCallback does the same for functions. Both prevent unnecessary re-renders when used correctly.",
    mcq: {
      question: "Which hook memoizes an expensive calculated value?",
      options: ["useEffect", "useCallback", "useMemo", "useRef"],
      answer: 2,
    },
    challenge: {
      title: "Memoize the filtered list",
      description: "The component below filters a large list on every render, even when nothing changes. Wrap the filtered calculation in useMemo so it only recalculates when items or filter changes.",
      starterCode:
`function ItemList({ items, filter }) {
  // This runs on EVERY render — fix it with useMemo
  const filtered = items.filter(item => item.includes(filter));

  return (
    <ul>
      {filtered.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}`,
      testCode: (userCode) => {
        const hasMemo  = userCode.includes("useMemo(");
        const hasDeps  = userCode.includes("[items, filter]") || userCode.includes("[items,filter]");
        const hasFilter = userCode.includes(".filter(");
        if (!hasMemo)   return { pass: false, message: "You need to wrap the calculation in useMemo(() => ..., [dependencies])." };
        if (!hasFilter) return { pass: false, message: "The filter logic is missing. Keep items.filter(item => item.includes(filter)) inside useMemo." };
        if (!hasDeps)   return { pass: false, message: "useMemo needs a dependency array [items, filter] so it knows when to recalculate." };
        return { pass: true, message: "All tests passed! useMemo with [items, filter] correctly memoizes the filtered list." };
      },
      hint: "Wrap the whole filter expression: const filtered = useMemo(() => items.filter(...), [items, filter]);",
    },
  },
];

const COIN_REWARD = 50;

export default function LearnMode() {
  const navigate = useNavigate();
  const [activeId, setActiveId]           = useState(1);
  const [unlockedIds, setUnlockedIds]     = useState([1]);
  const [selected, setSelected]           = useState(null);
  const [submitted, setSubmitted]         = useState(false);
  const [mcqCorrect, setMcqCorrect]       = useState(false);
  const [aiFeedback, setAiFeedback]       = useState("");
  const [verifying, setVerifying]         = useState(false);
  const [code, setCode]                   = useState(CHAPTERS[0].challenge.starterCode);
  const [codeResult, setCodeResult]       = useState(null);  // {pass, message}
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [totalCoins, setTotalCoins]       = useState(getCoins);
  const [coinPop, setCoinPop]             = useState(false);
  const [showHint, setShowHint]           = useState(false);
  const [attempts, setAttempts]           = useState(0);

  const chapter = CHAPTERS.find(c => c.id === activeId);
  const allDone = submitted && mcqCorrect && codeSubmitted && codeResult?.pass;

  function selectChapter(c) {
    if (!unlockedIds.includes(c.id)) return;
    setActiveId(c.id);
    setSelected(null); setSubmitted(false); setMcqCorrect(false);
    setAiFeedback(""); setCode(c.challenge.starterCode);
    setCodeResult(null); setCodeSubmitted(false);
    setShowHint(false); setAttempts(0);
  }

  async function submitMCQ() {
    if (selected === null) return;
    setVerifying(true);
    const result = await verifyAnswer({
      question: chapter.mcq.question,
      options: chapter.mcq.options,
      userAnswer: selected,
      correctAnswer: chapter.mcq.answer,
    });
    setMcqCorrect(result.correct);
    setAiFeedback(result.feedback);
    setSubmitted(true);
    setVerifying(false);
    if (result.correct) triggerCoins(COIN_REWARD);
  }

  function runCode() {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 2) setShowHint(true);

    const result = chapter.challenge.testCode(code);
    setCodeResult(result);

    if (result.pass) {
      setCodeSubmitted(true);
      triggerCoins(COIN_REWARD);
      // unlock next chapter
      const next = chapter.id + 1;
      if (next <= CHAPTERS.length && !unlockedIds.includes(next)) {
        setTimeout(() => setUnlockedIds(prev => [...prev, next]), 600);
      }
    }
  }

  function triggerCoins(amount) {
    setTotalCoins(addCoins(amount));
    setCoinPop(true);
    setTimeout(() => setCoinPop(false), 2000);
  }

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes coinFloat{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-40px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ch-item:hover{background:rgba(124,111,205,0.06)!important;}
        .opt-btn:hover{border-color:#7C6FCD!important;background:#EDE9FB!important;}
        .aw-nav-btn:hover{color:#7C6FCD!important;}
        .submit-btn:hover:not(:disabled){background:#6358B5!important;transform:translateY(-1px);}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .run-btn:hover:not(:disabled){background:#2A7D52!important;transform:translateY(-1px);}
        .run-btn:disabled{opacity:0.5;cursor:not-allowed;}
        textarea{tab-size:2;}
        textarea:focus{outline:none;border-color:#7C6FCD!important;box-shadow:0 0 0 3px rgba(124,111,205,0.1)!important;}
      `}</style>

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => navigate("/")}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C6FCD" }} />
          <span style={{ color: "#1E1B2E", fontWeight: 600 }}>Active</span>
          <span style={{ color: "#7C6FCD", fontWeight: 600 }}>Watch</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {[["Home", "/"], ["Dashboard", "/dashboard"], ["Capture", "/capture"]].map(([l, p]) => (
            <button key={l} className="aw-nav-btn" onClick={() => navigate(p)}
              style={{ background: "none", border: "none", color: "#9794A8", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>{l}</button>
          ))}
          <div style={S.coinBadge}>
            <span style={{ fontSize: 14 }}>🪙</span>
            <span style={{ color: "#C47B2B", fontWeight: 600 }}>{totalCoins}</span>
            {coinPop && (
              <span style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", color: "#C47B2B", fontSize: 13, fontWeight: 700, animation: "coinFloat 2s ease forwards", whiteSpace: "nowrap" }}>
                +{COIN_REWARD} 🪙
              </span>
            )}
          </div>
        </div>
      </nav>

      <div style={S.layout}>
        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #E8E4F0" }}>
            <div style={{ fontSize: 10, color: "#C9C2F0", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>COURSE</div>
            <div style={{ color: "#1E1B2E", fontWeight: 600, fontSize: 13 }}>React Hooks Full Course</div>
          </div>
          <div style={{ padding: "8px" }}>
            {CHAPTERS.map((c, i) => {
              const unlocked = unlockedIds.includes(c.id);
              const active   = activeId === c.id;
              const done     = unlockedIds.includes(c.id + 1) || (c.id === CHAPTERS.length && codeSubmitted && codeResult?.pass && activeId === c.id);
              return (
                <div key={c.id} className="ch-item" onClick={() => selectChapter(c)}
                  style={{ ...S.chItem, opacity: unlocked ? 1 : 0.4, cursor: unlocked ? "pointer" : "not-allowed", background: active ? "#EDE9FB" : "transparent", borderLeft: active ? "3px solid #7C6FCD" : "3px solid transparent" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? "#7C6FCD" : active ? "#EDE9FB" : "#F0EEF9", border: `1px solid ${done || active ? "#7C6FCD" : "#D8D4EC"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: done ? "white" : active ? "#7C6FCD" : "#C9C2F0", flexShrink: 0, fontFamily: "'JetBrains Mono',monospace" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div>
                    <div style={{ color: active ? "#1E1B2E" : "#6B6880", fontSize: 13, fontWeight: active ? 500 : 400 }}>{c.title}</div>
                    <div style={{ color: "#C9C2F0", fontSize: 11 }}>{c.duration} {!unlocked && "🔒"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={S.content}>
          {/* Chapter header */}
          <div style={S.chapterHeader}>
            <span style={{ fontSize: 11, color: "#7C6FCD", fontWeight: 600, letterSpacing: "0.08em" }}>CHAPTER {chapter.id} OF {CHAPTERS.length}</span>
            <h2 style={{ color: "#1E1B2E", fontSize: 22, fontWeight: 600, margin: "6px 0 0", letterSpacing: "-0.3px" }}>{chapter.title}</h2>
          </div>

          {/* Summary */}
          <div style={S.section}>
            <div style={S.sectionLabel}>📖 Summary</div>
            <p style={{ color: "#6B6880", lineHeight: 1.75, fontSize: 15 }}>{chapter.summary}</p>
          </div>

          {/* MCQ */}
          <div style={S.section}>
            <div style={S.sectionLabel}>❓ Quick Check</div>
            <p style={{ color: "#1E1B2E", fontSize: 15, marginBottom: 16, fontWeight: 500 }}>{chapter.mcq.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {chapter.mcq.options.map((opt, i) => {
                let bg = "#FAFAFA"; let border = "1px solid #E8E4F0"; let color = "#6B6880";
                if (submitted) {
                  if (i === chapter.mcq.answer) { bg = "#E6F4EE"; border = "1px solid #B2D9C4"; color = "#2A7D52"; }
                  else if (i === selected && !mcqCorrect) { bg = "#FCEBEB"; border = "1px solid #F09595"; color = "#A32D2D"; }
                } else if (i === selected) { bg = "#EDE9FB"; border = "1px solid #7C6FCD"; color = "#7C6FCD"; }
                return (
                  <button key={i} className={submitted ? "" : "opt-btn"} onClick={() => !submitted && setSelected(i)}
                    style={{ background: bg, border, borderRadius: 10, padding: "12px 16px", textAlign: "left", color, fontSize: 14, fontFamily: "inherit", cursor: submitted ? "default" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${i === selected && !submitted ? "#7C6FCD" : "#D8D4EC"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, color: i === selected && !submitted ? "#7C6FCD" : "#C9C2F0", fontFamily: "'JetBrains Mono',monospace" }}>
                      {["A", "B", "C", "D"][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {!submitted && (
              <button className="submit-btn" onClick={submitMCQ} disabled={selected === null || verifying}
                style={{ ...S.submitBtn, marginTop: 16, background: selected !== null ? "#7C6FCD" : "#D8D4EC", color: selected !== null ? "white" : "#9794A8" }}>
                {verifying
                  ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Checking…</span>
                  : "Submit Answer"}
              </button>
            )}
            {submitted && (
              <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 10, background: mcqCorrect ? "#E6F4EE" : "#FCEBEB", border: `1px solid ${mcqCorrect ? "#B2D9C4" : "#F09595"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: aiFeedback ? 6 : 0 }}>
                  <span style={{ fontSize: 16 }}>{mcqCorrect ? "✅" : "❌"}</span>
                  <span style={{ color: mcqCorrect ? "#2A7D52" : "#A32D2D", fontWeight: 500, fontSize: 14 }}>
                    {mcqCorrect ? "Correct! +50 🪙 coins earned" : "Not quite — see the correct answer highlighted above."}
                  </span>
                </div>
                {aiFeedback && <p style={{ color: "#6B6880", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{aiFeedback}</p>}
              </div>
            )}
          </div>

          {/* ── CODING CHALLENGE ── */}
          <div style={S.section}>
            <div style={S.sectionLabel}>💻 Coding Challenge</div>

            {/* Problem statement */}
            <div style={{ background: "#F7F6FB", border: "1px solid #E8E4F0", borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ color: "#1E1B2E", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{chapter.challenge.title}</div>
              <p style={{ color: "#6B6880", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{chapter.challenge.description}</p>
            </div>

            {/* Hint */}
            {showHint && !codeSubmitted && (
              <div style={{ background: "#FEF3E8", border: "1px solid #F0CEAA", borderRadius: 8, padding: "10px 14px", marginBottom: 12, animation: "fadeIn 0.3s ease" }}>
                <span style={{ fontSize: 13, color: "#C47B2B" }}>💡 Hint: {chapter.challenge.hint}</span>
              </div>
            )}

            {/* Editor */}
            <div style={S.editorWrap}>
              <div style={S.editorBar}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F09595" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FAC775" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#97C459" }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: "#9794A8", fontFamily: "'JetBrains Mono',monospace" }}>solution.jsx</span>
                {attempts > 0 && !codeSubmitted && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "#9794A8" }}>Attempt {attempts}{attempts >= 2 ? " — hint shown" : ""}</span>
                )}
              </div>
              <textarea
                value={code}
                onChange={e => { setCode(e.target.value); setCodeResult(null); }}
                disabled={codeSubmitted}
                spellCheck={false}
                style={{ width: "100%", minHeight: 220, background: codeSubmitted ? "#F7F9F7" : "#FAFAFA", border: "none", borderTop: "1px solid #E8E4F0", padding: "16px", color: "#1E1B2E", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.75, resize: "vertical", boxSizing: "border-box", transition: "background 0.2s" }}
              />
            </div>

            {/* Test result */}
            {codeResult && (
              <div style={{ marginTop: 10, padding: "12px 16px", borderRadius: 10, background: codeResult.pass ? "#E6F4EE" : "#FCEBEB", border: `1px solid ${codeResult.pass ? "#B2D9C4" : "#F09595"}`, animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{codeResult.pass ? "✅" : "❌"}</span>
                  <span style={{ color: codeResult.pass ? "#2A7D52" : "#A32D2D", fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
                    {codeResult.message}
                    {codeResult.pass && " +50 🪙 coins earned"}
                  </span>
                </div>
              </div>
            )}

            {!codeSubmitted ? (
              <button className="run-btn" onClick={runCode}
                style={{ ...S.runBtn, marginTop: 12 }}>
                ▶ Run & Check
              </button>
            ) : (
              <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: "#E6F4EE", border: "1px solid #B2D9C4", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <span style={{ color: "#2A7D52", fontWeight: 500, fontSize: 14 }}>Challenge complete! Well done.</span>
              </div>
            )}
          </div>

          {/* Unlock next chapter */}
          {allDone && chapter.id < CHAPTERS.length && (
            <div style={{ ...S.section, background: "#EDE9FB", border: "1px solid #C9C2F0", borderRadius: 12, padding: 24, textAlign: "center", animation: "fadeIn 0.4s ease" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
              <div style={{ color: "#7C6FCD", fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Chapter complete!</div>
              <div style={{ color: "#9794A8", fontSize: 14, marginBottom: 16 }}>Chapter {chapter.id + 1} has been unlocked.</div>
              <button onClick={() => selectChapter(CHAPTERS.find(c => c.id === chapter.id + 1))}
                style={{ ...S.submitBtn, background: "#7C6FCD", color: "white", display: "inline-block" }}>
                Continue to Chapter {chapter.id + 1} →
              </button>
            </div>
          )}

          {allDone && chapter.id === CHAPTERS.length && (
            <div style={{ ...S.section, background: "#EDE9FB", border: "1px solid #C9C2F0", borderRadius: 12, padding: 24, textAlign: "center", animation: "fadeIn 0.4s ease" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
              <div style={{ color: "#7C6FCD", fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Course complete!</div>
              <div style={{ color: "#9794A8", fontSize: 14, marginBottom: 16 }}>You have finished all chapters. Check your dashboard.</div>
              <button onClick={() => navigate("/dashboard")}
                style={{ ...S.submitBtn, background: "#7C6FCD", color: "white", display: "inline-block" }}>
                View Dashboard →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const S = {
  root:          { minHeight: "100vh", background: "#F7F6FB", fontFamily: "'Space Grotesk',sans-serif", color: "#6B6880", display: "flex", flexDirection: "column" },
  nav:           { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", borderBottom: "1px solid #E8E4F0", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 },
  logo:          { display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" },
  coinBadge:     { display: "flex", alignItems: "center", gap: 6, background: "#FEF3E8", border: "1px solid #F0CEAA", borderRadius: 20, padding: "5px 12px", fontSize: 14, position: "relative" },
  layout:        { display: "flex", flex: 1, overflow: "hidden" },
  sidebar:       { width: 250, borderRight: "1px solid #E8E4F0", background: "#FFFFFF", flexShrink: 0, overflowY: "auto" },
  chItem:        { padding: "10px 12px", borderRadius: 8, margin: "2px 4px", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10 },
  content:       { flex: 1, overflowY: "auto", padding: "32px 40px", maxWidth: 760 },
  chapterHeader: { marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #E8E4F0" },
  section:       { marginBottom: 32 },
  sectionLabel:  { fontSize: 12, fontWeight: 600, color: "#7C6FCD", letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 },
  editorWrap:    { background: "#FAFAFA", borderRadius: 10, border: "1px solid #E8E4F0", overflow: "hidden" },
  editorBar:     { display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "#F0EEF9", borderBottom: "1px solid #E8E4F0" },
  submitBtn:     { border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" },
  runBtn:        { background: "#2A7D52", border: "none", borderRadius: 10, padding: "11px 24px", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: "0 4px 14px rgba(42,125,82,0.25)" },
};
