/**
 * TMDB proxy routes — forwards requests to api.themoviedb.org
 * using the TMDB_API_KEY environment variable.
 *
 * All routes are mounted at /api/tmdb (see routes/index.ts).
 */
import { Router, type Request, type Response, type NextFunction } from "express";

const router = Router();

const TMDB_BASE = "https://api.themoviedb.org/3";

const VALID_MEDIA_TYPES = new Set(["movie", "tv"]);
const VALID_TRENDING_TYPES = new Set(["all", "movie", "tv"]);

function assertMediaType(type: string): void {
  if (!VALID_MEDIA_TYPES.has(type)) {
    throw Object.assign(
      new Error(`Invalid type "${type}". Must be "movie" or "tv".`),
      { statusCode: 400 },
    );
  }
}

function assertTrendingType(type: string): void {
  if (!VALID_TRENDING_TYPES.has(type)) {
    throw Object.assign(
      new Error(`Invalid type "${type}". Must be "all", "movie", or "tv".`),
      { statusCode: 400 },
    );
  }
}

function getApiKey(): string {
  const key = process.env["TMDB_API_KEY"];
  if (!key) throw new Error("TMDB_API_KEY environment variable is not set");
  return key;
}

async function tmdbFetch(
  path: string,
  params: Record<string, string | undefined> = {},
): Promise<unknown> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", getApiKey());
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = Object.assign(new Error(`TMDB error ${res.status}: ${body}`), {
      statusCode: res.status,
    });
    throw err;
  }
  return res.json();
}

type ProxyFn = (req: Request) => Promise<unknown>;

function proxy(fn: ProxyFn) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn(req);
      res.json(data);
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string };
      if (e.statusCode) {
        res.status(e.statusCode).json({ error: e.message });
      } else {
        next(err);
      }
    }
  };
}

// GET /api/tmdb/trending?type=all|movie|tv
router.get(
  "/trending",
  proxy(async (req) => {
    const type = (req.query["type"] as string) || "all";
    assertTrendingType(type);
    return tmdbFetch(`/trending/${type}/week`, { language: "en-US" });
  }),
);

// GET /api/tmdb/discover?type=movie|tv&sort_by=...&with_genres=...&page=...
router.get(
  "/discover",
  proxy(async (req) => {
    const q = req.query as Record<string, string>;
    const { type, sort_by, with_genres, page, with_watch_providers, watch_region } = q;
    if (!type) {
      throw Object.assign(new Error("type query param is required"), { statusCode: 400 });
    }
    assertMediaType(type);
    return tmdbFetch(`/discover/${type}`, {
      sort_by: sort_by || "popularity.desc",
      with_genres,
      page: page || "1",
      with_watch_providers,
      watch_region,
      language: "en-US",
      include_adult: "false",
    });
  }),
);

// GET /api/tmdb/anime?type=tv|movie&page=...
router.get(
  "/anime",
  proxy(async (req) => {
    const q = req.query as Record<string, string>;
    const type = q["type"] || "tv";
    assertMediaType(type);
    const page = q["page"] || "1";
    return tmdbFetch(`/discover/${type}`, {
      with_genres: "16", // Animation
      with_original_language: "ja",
      sort_by: "popularity.desc",
      page,
      language: "en-US",
      include_adult: "false",
    });
  }),
);

// GET /api/tmdb/genres  →  { movie: [...], tv: [...] }
router.get(
  "/genres",
  proxy(async () => {
    const [movieRes, tvRes] = await Promise.all([
      tmdbFetch("/genre/movie/list", { language: "en-US" }),
      tmdbFetch("/genre/tv/list", { language: "en-US" }),
    ]);
    return {
      movie: (movieRes as { genres: unknown[] }).genres ?? [],
      tv: (tvRes as { genres: unknown[] }).genres ?? [],
    };
  }),
);

// GET /api/tmdb/details/:type/:id
router.get(
  "/details/:type/:id",
  proxy(async (req) => {
    const { type, id } = req.params;
    assertMediaType(type);
    const data = (await tmdbFetch(`/${type}/${id}`, {
      language: "en-US",
      append_to_response: "credits,similar,recommendations,videos,reviews,images",
      include_image_language: "en,null",
    })) as Record<string, unknown>;
    return {
      details: data,
      credits: data["credits"],
      similar: data["similar"],
      recommendations: data["recommendations"],
      videos: data["videos"],
      reviews: data["reviews"],
      images: data["images"],
    };
  }),
);

// GET /api/tmdb/season/:id/:season
router.get(
  "/season/:id/:season",
  proxy(async (req) => {
    const { id, season } = req.params;
    return tmdbFetch(`/tv/${id}/season/${season}`, { language: "en-US" });
  }),
);

// GET /api/tmdb/watch-providers/:type/:id
router.get(
  "/watch-providers/:type/:id",
  proxy(async (req) => {
    const { type, id } = req.params;
    assertMediaType(type);
    return tmdbFetch(`/${type}/${id}/watch/providers`);
  }),
);

// GET /api/tmdb/search?query=...
router.get(
  "/search",
  proxy(async (req) => {
    const query = req.query["query"] as string;
    if (!query) {
      throw Object.assign(new Error("query param is required"), { statusCode: 400 });
    }
    return tmdbFetch("/search/multi", {
      query,
      language: "en-US",
      include_adult: "false",
    });
  }),
);

// GET /api/tmdb/providers?watch_region=US
router.get(
  "/providers",
  proxy(async (req) => {
    const watch_region = (req.query["watch_region"] as string) || "US";
    return tmdbFetch("/watch/providers/movie", {
      language: "en-US",
      watch_region,
    });
  }),
);

// GET /api/tmdb/person/:id
router.get(
  "/person/:id",
  proxy(async (req) => {
    const { id } = req.params;
    const data = (await tmdbFetch(`/person/${id}`, {
      language: "en-US",
      append_to_response: "combined_credits",
    })) as Record<string, unknown>;
    return {
      details: data,
      credits: data["combined_credits"],
    };
  }),
);

// GET /api/tmdb/collection/:id
router.get(
  "/collection/:id",
  proxy(async (req) => {
    const { id } = req.params;
    return tmdbFetch(`/collection/${id}`, { language: "en-US" });
  }),
);

export default router;
