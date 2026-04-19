/**
 * Centralized API endpoint configuration.
 * Single source of truth for all backend routes.
 */
export const API = {
  AUTH: {
    SIGN_UP: "/v1/auth/sign-up",
    SIGN_IN: "/v1/auth/sign-in",
  },
  CONTENT: {
    REWRITE: "/v1/content/rewrite",
    EXPAND: "/v1/content/expand",
    SHORTEN: "/v1/content/shorten",
    ARTICLE: "/v1/content/article",
    SEO: "/v1/content/seo-content",
    HISTORY: "/v1/content/history",
  },
  IMAGE: {
    GENERATE: "/v1/image/generate",
    HISTORY: "/v1/image/history",
  },
  RESUME: {
    ANALYZE: "/v1/resume/analyze",
  },
};
