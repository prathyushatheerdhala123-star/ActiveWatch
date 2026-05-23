// ─────────────────────────────────────────────────────────────────────────────
// api.js  —  All backend calls live here.
// If the backend is offline every function falls back to realistic mock data
// so the frontend always works for demos.
//
// Backend contract (share this with Aashritha):
//   POST /save          body: { url }
//   POST /verify-answer body: { question, options, userAnswer, correctAnswer }
//   All responses documented inline below.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "http://localhost:8000";

// ── Generic helper ────────────────────────────────────────────────────────────
async function callBackend(endpoint, body, mockFn) {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[ActiveWatch] Backend offline (${endpoint}) — using mock data`);
    return mockFn(body);
  }
}

// ── POST /save ────────────────────────────────────────────────────────────────
// Request:  { url: string }
// Response: {
//   mode:       "grow" | "collect" | "unwind",
//   title:      string,
//   video_id:   string,
//   chapters?:  Chapter[]   // only if mode === "grow"
//   coins_earned: number
// }
// Chapter: { id, title, duration, locked, summary, mcq, practice_problems }
// MCQ:     { question, options: string[], correct: number, explanation }
// ─────────────────────────────────────────────────────────────────────────────
export async function saveVideo(url) {
  return callBackend("/save", { url }, () => {
    // Rotate between three mock results so all modes are demo-able
    const mocks = [
      {
        mode: "grow",
        title: "React Hooks Full Course (Demo)",
        video_id: "demo_grow_001",
        coins_earned: 0,
        chapters: [
          {
            id: 1, title: "useState & useEffect", duration: "12 min", locked: false,
            summary: "useState lets you add reactive state to functional components. useEffect handles side effects like data fetching and DOM manipulation. Together they replace class-component lifecycle methods.",
            mcq: {
              question: "What's the correct way to update state based on the previous value?",
              options: ["setState(state + 1)", "setState(prev => prev + 1)", "state = state + 1", "setState({ state })"],
              correct: 1,
              explanation: "Use the functional form setState(prev => prev + 1) — React may batch updates, so always derive from prev when new state depends on old state.",
            },
            practice_problems: [
              { level: "Easy",   platform: "LeetCode",   name: "Design Counter Component",       url: "https://leetcode.com/problems/create-hello-world-function/" },
              { level: "Medium", platform: "HackerRank", name: "Implement useToggle Custom Hook", url: "https://www.hackerrank.com/domains/react" },
              { level: "Hard",   platform: "GFG",        name: "Build useState from Scratch",     url: "https://www.geeksforgeeks.org/reactjs-hooks/" },
            ],
          },
          { id: 2, title: "useContext & useRef",  duration: "14 min", locked: true  },
          { id: 3, title: "Custom Hooks",          duration: "18 min", locked: true  },
          { id: 4, title: "Performance Hooks",     duration: "20 min", locked: true  },
        ],
      },
      {
        mode: "collect",
        title: "How to Build Deep Work Habits — Cal Newport",
        video_id: "demo_collect_001",
        coins_earned: 0,
      },
      {
        mode: "unwind",
        title: "A Day in My Life as a Developer",
        video_id: "demo_unwind_001",
        coins_earned: 0,
      },
    ];
    // Cycle deterministically so demo always starts with "grow"
    const idx = parseInt(localStorage.getItem("aw_demo_idx") || "0");
    localStorage.setItem("aw_demo_idx", String((idx + 1) % mocks.length));
    return mocks[idx];
  });
}

// ── POST /verify-answer ───────────────────────────────────────────────────────
// Request:  { question, options, userAnswer: number, correctAnswer: number }
// Response: {
//   correct:      boolean,
//   coins_earned: number,
//   feedback:     string,
//   note?:        { concept: string, explanation: string }  // only if wrong
// }
// ─────────────────────────────────────────────────────────────────────────────
export async function verifyAnswer({ question, options, userAnswer, correctAnswer }) {
  return callBackend(
    "/verify-answer",
    { question, options, userAnswer, correctAnswer },
    ({ userAnswer, correctAnswer }) => {
      const isCorrect = userAnswer === correctAnswer;
      return {
        correct: isCorrect,
        coins_earned: isCorrect ? 50 : 0,
        feedback: isCorrect
          ? "Correct. This concept is foundational — make sure you understand the why, not just the what."
          : "Not quite. Review the chapter summary and study the correct answer above before moving on.",
        note: isCorrect ? null : {
          concept: "Review needed",
          explanation: "Re-read the chapter summary and focus on the highlighted correct answer.",
        },
      };
    }
  );
}

// ── localStorage helpers ──────────────────────────────────────────────────────
// These keep Dashboard, GrowMode and Nav in sync without Firebase.
// Once Firebase is wired, replace these with Firestore reads/writes.

export function getCoins() {
  return parseInt(localStorage.getItem("aw_coins") || "120", 10);
}
export function addCoins(amount) {
  const updated = getCoins() + amount;
  localStorage.setItem("aw_coins", String(updated));
  // Dispatch a storage event so Nav re-reads the coin badge immediately
  window.dispatchEvent(new Event("aw_coins_updated"));
  return updated;
}

export function getStreak() {
  return parseInt(localStorage.getItem("aw_streak") || "7", 10);
}

export function getNotes() {
  try { return JSON.parse(localStorage.getItem("aw_notes") || "[]"); }
  catch { return []; }
}
export function addNote(note) {
  const notes = getNotes();
  notes.push({ id: Date.now(), ...note });
  localStorage.setItem("aw_notes", JSON.stringify(notes));
  return notes;
}

export function getCompletedTopics() {
  try {
    return JSON.parse(
      localStorage.getItem("aw_completed_topics") || '["useState","useEffect"]'
    );
  } catch { return []; }
}
export function addCompletedTopic(topic) {
  const topics = getCompletedTopics();
  if (!topics.includes(topic)) {
    topics.push(topic);
    localStorage.setItem("aw_completed_topics", JSON.stringify(topics));
  }
  return topics;
}