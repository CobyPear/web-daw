export type IndexableStore<T> = {
  [key: string]: {
    [K in keyof T]: T[K]
  }
}

export interface AudioStore {
  stream: MediaStream,
  url: string
}

export interface SliderStore {
  amplitude: number,
  lastAmplitude: number
}