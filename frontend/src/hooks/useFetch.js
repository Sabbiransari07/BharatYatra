// src/hooks/useFetch.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

/**
 * Reusable data fetching hook.
 *
 * @param {Function|null} fetchFunction
 * @param {boolean} immediate
 */
export default function useFetch(
  fetchFunction,
  immediate = true
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState(null);

  /**
   * Execute the provided API function.
   */
  const execute = useCallback(
    async (...args) => {
      if (
        typeof fetchFunction !== "function"
      ) {
        setError(
          new Error(
            "fetchFunction must be a function."
          )
        );

        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result =
          await fetchFunction(...args);

        setData(result);

        return result;
      } catch (err) {
        const fetchError =
          err instanceof Error
            ? err
            : new Error(
                "Something went wrong while fetching data."
              );

        setError(fetchError);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction]
  );

  /**
   * Automatically execute on mount.
   */
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  /**
   * Reset hook state.
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}