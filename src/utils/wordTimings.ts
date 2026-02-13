// DEPRECATED: Word timing data has moved to per-module JSON files
// Location: public/timings/module{N}.json
// 
// Use the new loader instead:
//   import { useModuleTimings } from "../hooks/useModuleTimings";
//   const { timings } = useModuleTimings(moduleNumber);
//
// These type exports are kept for backwards compatibility

export interface WordTiming {
  text: string;
  start: number;
  end: number;
}

export interface SlideWordTimings {
  slideName: string;
  words: WordTiming[];
}

export interface LineMapping {
  id: string;
  line: number;
  wordRange: [number, number];
}

// DEPRECATED: Use useModuleTimings hook instead
// These empty exports exist only for backwards compatibility
// New code should load from public/timings/module{N}.json
export const wordTimings: Record<string, SlideWordTimings> = {};
export const lineMappings: Record<string, LineMapping[]> = {};
