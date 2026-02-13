// Scalable timing loader - loads per-module JSON files
// This replaces the monolithic wordTimings.ts approach

import { staticFile } from "remotion";

export interface WordTiming {
  text: string;
  start: number;
  end: number;
}

export interface LineMapping {
  id: string;
  line: number;
  wordRange: [number, number];
}

export interface SlideTimings {
  words: WordTiming[];
}

export interface ModuleTimings {
  moduleNumber: number;
  title: string;
  slides: Record<string, SlideTimings>;
  lineMappings: Record<string, LineMapping[]>;
}

// Cache for loaded module timings
const timingsCache: Record<number, ModuleTimings | null> = {};
const loadingPromises: Record<number, Promise<ModuleTimings | null>> = {};

/**
 * Get the URL for a module's timing file
 */
export function getTimingsUrl(moduleNumber: number): string {
  return staticFile(`timings/module${moduleNumber}.json`);
}

/**
 * Load timings for a specific module (async)
 * Returns null if the file doesn't exist or fails to load
 */
export async function loadModuleTimings(moduleNumber: number): Promise<ModuleTimings | null> {
  // Return from cache if available
  if (timingsCache[moduleNumber] !== undefined) {
    return timingsCache[moduleNumber];
  }

  // If already loading, wait for that promise
  if (loadingPromises[moduleNumber]) {
    return loadingPromises[moduleNumber];
  }

  // Start loading
  loadingPromises[moduleNumber] = (async () => {
    try {
      const url = getTimingsUrl(moduleNumber);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`No timings file for module ${moduleNumber}`);
        timingsCache[moduleNumber] = null;
        return null;
      }

      const data: ModuleTimings = await response.json();
      timingsCache[moduleNumber] = data;
      return data;
    } catch (error) {
      console.warn(`Failed to load timings for module ${moduleNumber}:`, error);
      timingsCache[moduleNumber] = null;
      return null;
    }
  })();

  return loadingPromises[moduleNumber];
}

/**
 * Synchronous access to cached timings
 * Returns undefined if not yet loaded, null if doesn't exist
 */
export function getCachedTimings(moduleNumber: number): ModuleTimings | null | undefined {
  return timingsCache[moduleNumber];
}

/**
 * Get word timings for a specific slide from cached data
 */
export function getSlideTimings(
  moduleNumber: number,
  slideName: string
): SlideTimings | null {
  const moduleData = timingsCache[moduleNumber];
  if (!moduleData) return null;
  return moduleData.slides[slideName] || null;
}

/**
 * Get line mappings for a specific slide from cached data
 */
export function getLineMappings(
  moduleNumber: number,
  slideName: string
): LineMapping[] | null {
  const moduleData = timingsCache[moduleNumber];
  if (!moduleData) return null;
  return moduleData.lineMappings[slideName] || null;
}

/**
 * Preload timings for a module (call early in component lifecycle)
 */
export function preloadModuleTimings(moduleNumber: number): void {
  loadModuleTimings(moduleNumber);
}

/**
 * Clear the cache (useful for hot reloading during development)
 */
export function clearTimingsCache(): void {
  Object.keys(timingsCache).forEach(key => {
    delete timingsCache[Number(key)];
  });
  Object.keys(loadingPromises).forEach(key => {
    delete loadingPromises[Number(key)];
  });
}
