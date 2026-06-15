const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isGet = !options?.method || options.method === "GET";
  const cacheKey = `salesmind_cache_${endpoint}`;

  if (isGet && typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      // Fetch in background to update cache for next time
      fetch(`${API_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      }).then(res => res.ok ? res.text() : null)
        .then(text => { if (text) localStorage.setItem(cacheKey, text); })
        .catch(() => {});
        
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Fallback to normal fetch if JSON parse fails
      }
    }
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (isGet && typeof window !== "undefined") {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    }
    return data;
  } catch {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
}

export const api = {
  leads: {
    list: () => fetchAPI<unknown[]>("/api/leads"),
    create: (data: unknown) =>
      fetchAPI("/api/leads", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: unknown) =>
      fetchAPI(`/api/leads/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      fetchAPI(`/api/leads/${id}`, { method: "DELETE" }),
  },
  ai: {
    scoreLead: (data: {
      client_notes: string;
      meeting_summary?: string;
      interaction_history?: string;
    }) =>
      fetchAPI("/api/ai/score-lead", { method: "POST", body: JSON.stringify(data) }),
    summarizeMeeting: (raw_notes: string) =>
      fetchAPI("/api/ai/summarize-meeting", {
        method: "POST",
        body: JSON.stringify({ raw_notes }),
      }),
    generateFollowup: (data: {
      context: string;
      lead_name: string;
      company?: string;
      tone: string;
      type: string;
    }) =>
      fetchAPI("/api/ai/generate-followup", { method: "POST", body: JSON.stringify(data) }),
    chatWithCopilot: (message: string, history: { role: string; content: string }[]) =>
      fetchAPI<{ reply: string }>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message, history }),
      }),
  },
  analytics: {
    summary: () => fetchAPI("/api/analytics/summary"),
  },
  activity: {
    list: () => fetchAPI("/api/activity"),
  },
  insights: {
    get: () => fetchAPI("/api/insights"),
  },
  signal: {
    dashboard: () => fetchAPI<any>("/api/signal/dashboard"),
    leads: () => fetchAPI<any>("/api/signal/leads"),
    analytics: () => fetchAPI<any>("/api/signal/analytics"),
    leaderboard: () => fetchAPI<any>("/api/signal/leaderboard"),
    accounts: () => fetchAPI<any>("/api/signal/accounts"),
    products: () => fetchAPI<any>("/api/signal/products"),
    transcripts: () => fetchAPI<any>("/api/signal/transcripts"),
    activities: () => fetchAPI<any>("/api/signal/activities"),
  },
};
