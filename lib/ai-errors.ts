// User-facing mapping for AI / document-service failures.
//
// Raw provider errors (OpenRouter, the model, network) can contain billing
// details, internal URLs, and stack-y text — never show them to clients. The
// underlying raw error is still stored in the DB (documents.generation_error /
// ocr_error) for staff/debugging; this module maps it to friendly copy at the
// display + API boundary. Pure module — safe to import on client and server.

export interface AiErrorInfo {
  title: string;
  message: string;
  /** Likely to succeed on retry (capacity/credits/network) vs. a hard problem. */
  transient: boolean;
}

const UNAVAILABLE: AiErrorInfo = {
  title: "Service temporarily unavailable",
  message:
    "Our document service is temporarily unavailable. This is usually brief — please try again in a few minutes. If it keeps happening, contact support.",
  transient: true,
};

const MISSING_INPUT: AiErrorInfo = {
  title: "Missing required documents",
  message:
    "We're still missing some information needed for this document. Please make sure the required documents are uploaded and finished processing, then try again.",
  transient: false,
};

const GENERIC: AiErrorInfo = {
  title: "Couldn't generate document",
  message:
    "We couldn't generate this document. Please try again, or contact support if the problem continues.",
  transient: true,
};

// Conditions where a retry (now or shortly) is the right user action.
const UNAVAILABLE_SIGNALS = [
  "insufficient credit",
  "402",
  "rate limit",
  "429",
  "timeout",
  "timed out",
  "etimedout",
  "econnreset",
  "socket hang up",
  "network",
  "fetch failed",
  "overloaded",
  "temporarily unavailable",
  "no content returned",
  " 500",
  " 502",
  " 503",
  " 529",
];

export function isAiUnavailable(raw?: string | null): boolean {
  if (!raw) return false;
  const s = raw.toLowerCase();
  return UNAVAILABLE_SIGNALS.some((k) => s.includes(k));
}

export function describeAiError(raw?: string | null): AiErrorInfo {
  if (!raw) return GENERIC;
  const s = raw.toLowerCase();
  // Our own prerequisite errors, e.g. "FAD and UAS OCR text required…",
  // "IAD OCR text not found. Upload and process the IAD first."
  if (s.includes("ocr text") || (s.includes("required") && s.includes("upload"))) {
    return MISSING_INPUT;
  }
  if (isAiUnavailable(raw)) return UNAVAILABLE;
  return GENERIC;
}

/** Convenience for places that only need the message string. */
export function friendlyAiError(raw?: string | null): string {
  return describeAiError(raw).message;
}
