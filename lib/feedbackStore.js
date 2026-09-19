// Mock feedback store. No backend yet — submissions just live in memory for
// this session. `submitFeedback` is the seam: swap its body for a real
// `await fetch("/api/feedback", { method: "POST", body: JSON.stringify(payload) })`
// later and nothing calling it needs to change, since the async shape and
// return value are already what a real API call would look like.

const submissions = [];

export async function submitFeedback(payload) {
  const record = {
    ...payload,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    submittedAt: new Date().toISOString(),
  };
  submissions.push(record);
  return record;
}

export function getFeedbackSubmissions() {
  return submissions;
}
