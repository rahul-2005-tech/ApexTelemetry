import { useCallback, useEffect, useState } from "react";

/**
 * Runs `load` whenever `key` changes and tracks loading/error state.
 * `key === null` disables loading (useful for dependent queries).
 * Stale responses are ignored. `retry()` reruns the request for the same key.
 *
 * State is stored together with the request id it belongs to, so a change of
 * key or a retry immediately reads as "loading" without a synchronous setState.
 */
export function useAsyncData(key, load) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ requestId: null, response: null, error: null });

  const requestId = key === null ? null : `${key}#${attempt}`;

  useEffect(() => {
    if (requestId === null) return undefined;
    let cancelled = false;

    load()
      .then((response) => {
        if (!cancelled) setState({ requestId, response, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ requestId, response: null, error });
      });

    return () => {
      cancelled = true;
    };
    // `load` is intentionally keyed by `requestId`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  const isCurrent = requestId !== null && state.requestId === requestId;
  return {
    data: isCurrent ? (state.response?.data ?? null) : null,
    source: isCurrent ? (state.response?.source ?? null) : null,
    meta: isCurrent ? (state.response?.meta ?? null) : null,
    error: isCurrent ? state.error : null,
    isLoading: requestId !== null && !isCurrent,
    retry,
  };
}
