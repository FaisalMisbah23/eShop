const apiOrigin = (
  process.env.REACT_APP_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

/** REST API base (includes /api/v2 prefix) */
export const server = `${apiOrigin}/api/v2`;

/** Socket.IO server origin (no path suffix) */
export const socketUrl = (
  process.env.REACT_APP_SOCKET_URL || "http://localhost:5000"
).replace(/\/$/, "");
