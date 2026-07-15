import type {
  AnalyticsEvent,
  DragResponse,
  Region,
  Restaurant,
  SearchResponse,
  SimilarResponse,
} from "../types/restaurant";

const BASE = import.meta.env.VITE_API_BASE;
const SEARCH_CACHE_STORAGE_KEY = "golmokgyeol-search-cache-v1";

const loadSearchCache = () => {
  if (typeof window === "undefined") return new Map<string, SearchResponse>();

  try {
    const stored = window.localStorage.getItem(SEARCH_CACHE_STORAGE_KEY);
    if (!stored) return new Map<string, SearchResponse>();

    const entries = JSON.parse(stored) as unknown;
    if (!Array.isArray(entries)) return new Map<string, SearchResponse>();

    return new Map(
      entries.filter(
        (entry): entry is [string, SearchResponse] =>
          Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "string",
      ),
    );
  } catch {
    return new Map<string, SearchResponse>();
  }
};

const searchCache = loadSearchCache();
const pendingSearches = new Map<string, Promise<SearchResponse>>();

const cacheSearch = (key: string, response: SearchResponse) => {
  searchCache.set(key, response);

  try {
    window.localStorage.setItem(
      SEARCH_CACHE_STORAGE_KEY,
      JSON.stringify([...searchCache.entries()]),
    );
  } catch {
    // Keep the in-memory cache available when persistent storage is unavailable.
  }
};

const normalizeQuery = (query: string) => query.trim().replace(/\s+/g, " ");

const searchKey = (neighborhood: string, query: string, force: boolean) =>
  JSON.stringify([neighborhood.trim(), normalizeQuery(query), force]);

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  regions: () => req<{ regions: Region[] }>("/api/regions"),

  search: (neighborhood: string, query: string, force = false) => {
    const normalizedQuery = normalizeQuery(query);
    const key = searchKey(neighborhood, normalizedQuery, force);
    const cached = searchCache.get(key);

    if (cached) return Promise.resolve(cached);

    const pending = pendingSearches.get(key);
    if (pending) return pending;

    const request = req<SearchResponse>("/api/search", {
      method: "POST",
      body: JSON.stringify({
        neighborhood: neighborhood.trim(),
        query: normalizedQuery,
        force,
      }),
    })
      .then((response) => {
        cacheSearch(key, response);
        return response;
      })
      .finally(() => pendingSearches.delete(key));

    pendingSearches.set(key, request);
    return request;
  },

  drag: (sessionId: string, x: number, y: number) =>
    req<DragResponse>("/api/drag", {
      method: "POST",
      body: JSON.stringify({ sessionId, x, y }),
    }),

  restaurant: (id: number) => req<Restaurant>(`/api/restaurants/${id}`),

  similar: (id: number) =>
    req<SimilarResponse>(`/api/restaurants/${id}/similar`),

  event: (event: AnalyticsEvent) =>
    req<void>("/api/events", {
      method: "POST",
      body: JSON.stringify(event),
    }),
};
