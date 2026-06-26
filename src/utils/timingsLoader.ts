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

export interface PhraseTime {
  start: number;
  end: number;
}

export interface SlideTimings {
  words: WordTiming[];
  phraseTimes?: (PhraseTime | null)[];
  leftPhraseTimes?: (PhraseTime | null)[];
  rightPhraseTimes?: (PhraseTime | null)[];
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
const bulletStartsCache: Record<number, Record<string, number[]> | null> = {};
const bulletStartsLoadingPromises: Record<number, Promise<Record<string, number[]> | null>> = {};

/**
 * Get the URL for a module's timing file
 */
export function getTimingsUrl(moduleNumber: number): string {
  return staticFile(`timings/module${moduleNumber}.json`);
}

export function getBulletStartsUrl(moduleNumber: number): string {
  return staticFile(`timings/module${moduleNumber}-bulletStarts.json`);
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

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.warn(`Timings for module ${moduleNumber} returned non-JSON (${contentType})`);
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
 * Load precomputed bullet start times per slide (optional; runtime can derive from words).
 */
export async function loadBulletStarts(
  moduleNumber: number
): Promise<Record<string, number[]> | null> {
  if (bulletStartsCache[moduleNumber] !== undefined) {
    return bulletStartsCache[moduleNumber];
  }

  if (bulletStartsLoadingPromises[moduleNumber]) {
    return bulletStartsLoadingPromises[moduleNumber];
  }

  bulletStartsLoadingPromises[moduleNumber] = (async () => {
    try {
      const url = getBulletStartsUrl(moduleNumber);
      const response = await fetch(url);
      if (!response.ok) {
        bulletStartsCache[moduleNumber] = null;
        return null;
      }
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        bulletStartsCache[moduleNumber] = null;
        return null;
      }
      const data = (await response.json()) as Record<string, number[]>;
      bulletStartsCache[moduleNumber] = data;
      return data;
    } catch (error) {
      console.warn(`Failed to load bullet starts for module ${moduleNumber}:`, error);
      bulletStartsCache[moduleNumber] = null;
      return null;
    }
  })();

  return bulletStartsLoadingPromises[moduleNumber];
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
  Object.keys(bulletStartsCache).forEach(key => {
    delete bulletStartsCache[Number(key)];
  });
  Object.keys(bulletStartsLoadingPromises).forEach(key => {
    delete bulletStartsLoadingPromises[Number(key)];
  });
}
