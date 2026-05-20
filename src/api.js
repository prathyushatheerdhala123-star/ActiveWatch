const BASE = "http://localhost:8000";

async function callBackend(endpoint, body, mockFn) {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch {
    console.warn(`[ActiveWatch] Backend offline — using mock for ${endpoint}`);
    return mockFn(body);
  }
}

export async function saveVideo(url) {
  return callBackend("/save", { url }, () => {
    const mocks = [
      {
        mode: "grow",
        title: "React Hooks Full Course",
        video_id: "abc123",
        chapters: [
          { id: 1, title: "useState & useEffect", duration: "12 min", locked: false },
          { id: 2, title: "useContext & useRef",  duration: "14 min", locked: true  },
          { id: 3, title: "Custom Hooks",          duration: "18 min", locked: true  },
          { id: 4, title: "Performance Hooks",     duration: "20 min", locked: true  },
        ],
        coins_earned: 0,
        topic: "react hooks",
        practice_problems: [
          { level: "Easy",   platform: "LeetCode",   name: "Implement useState-like Hook",      url: "https://leetcode.com" },
          { level: "Medium", platform: "HackerRank", name: "Custom useFetch Implementation",    url: "https://hackerrank.com" },
          { level: "Hard",   platform: "GFG",        name: "Build a Redux-like State Manager",  url: "https://geeksforgeeks.org" },
        ],
      },
      {
        mode: "collect",
        title: "How to Build Deep Work Habits — Cal Newport",
        video_id: "def456",
        coins_earned: 0,
      },
      {
        mode: "unwind",
        title: "A Day in My Life as a Developer",
        video_id: "ghi789",
        coins_earned: 0,
      },
    ];
    return mocks[Math.floor(Math.random() * mocks.length)];
  });
}

export async function verifyAnswer({ question, options, userAnswer, correctAnswer }) {
  return callBackend("/verify-answer", { question, options, userAnswer, correctAnswer }, ({ userAnswer, correctAnswer }) => {
    const isCorrect = userAnswer === correctAnswer;
    return {
      correct: isCorrect,
      coins_earned: isCorrect ? 50 : 0,
      feedback: isCorrect
        ? "Great job! That is correct. This concept is fundamental — make sure you understand why before moving on."
        : "Not quite. Review the chapter summary and look at the correct answer highlighted above.",
      note: isCorrect ? null : {
        concept: "Review needed",
        explanation: "Re-read the chapter summary and focus on the highlighted correct answer before moving on.",
      },
    };
  });
}

// Coin helpers — localStorage keeps Dashboard in sync with GrowMode
export function getCoins() {
  return parseInt(localStorage.getItem("aw_coins") || "120", 10);
}
export function addCoins(amount) {
  const updated = getCoins() + amount;
  localStorage.setItem("aw_coins", String(updated));
  return updated;
}
export function getStreak() {
  return parseInt(localStorage.getItem("aw_streak") || "7", 10);
}
export function getNotes() {
  try { return JSON.parse(localStorage.getItem("aw_notes") || "[]"); } catch { return []; }
}
export function addNote(note) {
  const notes = getNotes();
  notes.push({ id: Date.now(), ...note });
  localStorage.setItem("aw_notes", JSON.stringify(notes));
  return notes;
}
export function getCompletedTopics() {
  try { return JSON.parse(localStorage.getItem("aw_completed_topics") || '["useState","useEffect"]'); } catch { return []; }
}
export function addCompletedTopic(topic) {
  const topics = getCompletedTopics();
  if (!topics.includes(topic)) {
    topics.push(topic);
    localStorage.setItem("aw_completed_topics", JSON.stringify(topics));
  }
  return topics;
}
