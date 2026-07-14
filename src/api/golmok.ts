import type {
  DragResponse,
  Region,
  Restaurant,
  SearchResponse,
  SimilarResponse,
} from "../types/restaurant";

const BASE = import.meta.env.VITE_API_BASE;
const SEARCH_CACHE_TTL = 5 * 60 * 1000;
const SEARCH_CACHE_LIMIT = 20;

type SearchCacheEntry = {
  response: SearchResponse;
  expiresAt: number;
};

const searchCache = new Map<string, SearchCacheEntry>();
const pendingSearches = new Map<string, Promise<SearchResponse>>();

const normalizeQuery = (query: string) => query.trim().replace(/\s+/g, " ");

const searchKey = (neighborhood: string, query: string, force: boolean) =>
  JSON.stringify([neighborhood.trim(), normalizeQuery(query), force]);

const cacheSearch = (key: string, response: SearchResponse) => {
  searchCache.delete(key);
  searchCache.set(key, { response, expiresAt: Date.now() + SEARCH_CACHE_TTL });

  if (searchCache.size > SEARCH_CACHE_LIMIT) {
    const oldestKey = searchCache.keys().next().value;
    if (oldestKey) searchCache.delete(oldestKey);
  }
};

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

  return res.json() as Promise<T>;
}

export const api = {
  regions: () => req<{ regions: Region[] }>("/api/regions"),

  search: (neighborhood: string, query: string, force = false) => {
    const normalizedQuery = normalizeQuery(query);
    const key = searchKey(neighborhood, normalizedQuery, force);
    const cached = searchCache.get(key);

    if (cached && cached.expiresAt > Date.now())
      return Promise.resolve(cached.response);
    if (cached) searchCache.delete(key);

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
};
