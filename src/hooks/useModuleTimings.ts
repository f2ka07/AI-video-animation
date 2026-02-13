// React hook for loading module timings in Remotion components
import { useEffect, useState } from "react";
import { delayRender, continueRender } from "remotion";
import {
  ModuleTimings,
  loadModuleTimings,
  getCachedTimings,
} from "../utils/timingsLoader";

interface UseModuleTimingsResult {
  timings: ModuleTimings | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to load module timings with Remotion's delay render pattern
 * This ensures the component waits for timings before rendering
 */
export function useModuleTimings(moduleNumber: number): UseModuleTimingsResult {
  const [timings, setTimings] = useState<ModuleTimings | null>(() => {
    // Try to get from cache synchronously first
    const cached = getCachedTimings(moduleNumber);
    return cached ?? null;
  });
  const [isLoading, setIsLoading] = useState(!timings);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If already have timings, nothing to do
    if (timings) return;

    // Delay render until timings are loaded
    const handle = delayRender(`Loading timings for module ${moduleNumber}`);

    loadModuleTimings(moduleNumber)
      .then((data) => {
        setTimings(data);
        setIsLoading(false);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`Failed to load timings for module ${moduleNumber}:`, err);
        setError(err);
        setIsLoading(false);
        continueRender(handle);
      });

    return () => {
      // Cleanup if component unmounts before loading completes
      continueRender(handle);
    };
  }, [moduleNumber, timings]);

  return { timings, isLoading, error };
}

/**
 * Simplified hook that just returns the timings (null if not available)
 * Use when you don't need loading state
 */
export function useSlideTimings(
  moduleNumber: number,
  slideName: string
): { words: Array<{ text: string; start: number; end: number }> } | null {
  const { timings } = useModuleTimings(moduleNumber);
  if (!timings) return null;
  return timings.slides[slideName] || null;
}

/**
 * Hook to get line mappings for a specific slide
 */
export function useLineMappings(
  moduleNumber: number,
  slideName: string
): Array<{ id: string; line: number; wordRange: [number, number] }> | null {
  const { timings } = useModuleTimings(moduleNumber);
  if (!timings) return null;
  return timings.lineMappings[slideName] || null;
}
