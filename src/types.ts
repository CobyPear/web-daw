export type IndexableStore<T> = {
  [key: string]: {
    [K in keyof T]: T[K]
  }
}

export interface AudioStore {
  track: MediaRecorder,
  url: string,
}

export interface SliderStore {
  amplitude: number,
  lastAmplitude: number
}

export interface VizualizerStore {
  source: MediaStreamAudioSourceNode,
  analyser: AnalyserNode,
  audioCtx: AudioContext,
  bufferLength: number,
  dataArray: Uint8Array,
}