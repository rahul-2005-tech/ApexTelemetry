const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

const BACKEND_DOWN_MESSAGE =
  "Can't reach the ApexTelemetry backend. Start it with `uvicorn app.main:app --port 8001` " +
  "from the backend folder (see README), then retry.";

export class ApiError extends Error {
  constructor(message, { status = 0, code = "unknown" } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * GET helper for the FastAPI backend. Resolves to the success envelope
 * `{ source, data, meta }` and throws ApiError with a readable message
 * otherwise. It never substitutes sample data.
 */
export async function apiGet(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(BACKEND_DOWN_MESSAGE, { code: "backend_unreachable" });
  }

  const body = await readJson(response);

  if (!response.ok) {
    const apiMessage = body?.error?.message;
    if (apiMessage) {
      throw new ApiError(apiMessage, {
        status: response.status,
        code: body.error.code ?? "unknown",
      });
    }
    // No JSON error body: typically the Vite dev proxy failing to reach the backend.
    throw new ApiError(
      response.status >= 500
        ? BACKEND_DOWN_MESSAGE
        : `Request failed (HTTP ${response.status}).`,
      { status: response.status, code: "backend_unreachable" },
    );
  }

  if (!body || body.data === undefined || !body.source) {
    throw new ApiError("The backend returned an unexpected response.", {
      status: response.status,
      code: "bad_response",
    });
  }
  return body;
}
