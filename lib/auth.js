/**
 * Simple cookie-based session helpers (no third-party auth library).
 * Uses a JSON payload encoded in base64 stored in an HttpOnly cookie.
 */

const COOKIE_NAME = "tilestore_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

/**
 * Encode a session payload into a base64 string.
 */
function encodeSession(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/**
 * Decode a base64 session string back to a payload object.
 */
function decodeSession(encoded) {
  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

/**
 * Build a Set-Cookie header string for the session.
 */
function buildSessionCookie(payload) {
  const encoded = encodeSession(payload);
  return `${COOKIE_NAME}=${encoded}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

/**
 * Build a Set-Cookie header string that clears the session.
 */
function buildClearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Get the decoded session payload from an incoming Request object.
 * Returns null if no valid session cookie is found.
 */
function getSession(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );
  const raw = cookies[COOKIE_NAME];
  if (!raw) return null;
  return decodeSession(raw);
}

module.exports = {
  buildSessionCookie,
  buildClearCookie,
  getSession,
};
