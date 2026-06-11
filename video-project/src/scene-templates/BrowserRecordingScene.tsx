import { Audio, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { Subtitles, Sentence } from "../Subtitles";
import { VideoSegment, playbackRateFor } from "../segment-loader";

export const BrowserRecordingScene: React.FC<{
  segment: VideoSegment;
  captions: Sentence[];
  audioSrc: string;
}> = ({ segment, captions, audioSrc }) => {
  const { fps } = useVideoConfig();
  const voDur = segment.voiceoverEndSec - segment.voiceoverStartSec;
  const rate = playbackRateFor(segment);
  const dur = Math.ceil(voDur * fps);
  const startFromFrames = Math.round(segment.recordingStartSec * fps) + 1;  // +1 frame dedup
  return (
    <Sequence durationInFrames={dur}>
      <Audio src={staticFile(audioSrc)} />
      <OffthreadVideo src={staticFile(segment.src)} startFrom={startFromFrames} playbackRate={rate} />
      <Subtitles sentences={captions} />
    </Sequence>
  );
};
