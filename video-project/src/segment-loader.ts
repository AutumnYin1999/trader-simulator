export type VideoSegment = {
  id: string;
  voiceoverStartSec: number;
  voiceoverEndSec: number;
  recordingStartSec: number;
  recordingEndSec: number;
  src: string;
};

import edgeSegments from "../../segments-edge.json";
import elevenSegments from "../../segments-elevenlabs.json";

const REGISTRY: Record<string, VideoSegment[]> = {
  edge: edgeSegments as VideoSegment[],
  elevenlabs: elevenSegments as VideoSegment[],
};

export function loadSegments(provider: string): VideoSegment[] {
  const segments = REGISTRY[provider];
  if (!segments) throw new Error(`No segments for provider: ${provider}`);
  return segments;
}

export function playbackRateFor(seg: VideoSegment): number {
  const voDur = seg.voiceoverEndSec - seg.voiceoverStartSec;
  const recDur = seg.recordingEndSec - seg.recordingStartSec;
  return recDur > 0 ? recDur / voDur : 1.0;
}
