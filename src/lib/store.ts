import { writable } from 'svelte/store';

export const isRecording = writable(false)
export const isPlaying = writable(false)
export const isPaused = writable(false)
export const isStopped = writable(true)

type IndexableStore<T> = {
  [key: string]: T
}
interface SliderStore {
  amplitude: number,
  lastAmplitude: number
}
export const audioUrlStore = writable<IndexableStore<string>>({})
export const sliderStore = writable<IndexableStore<SliderStore>>({})
