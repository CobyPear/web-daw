import { writable } from 'svelte/store';
import type { SliderStore, IndexableStore, AudioStore } from 'src/types';

export const isRecording = writable(false)
export const isPlaying = writable(false)
export const isPaused = writable(false)
export const isStopped = writable(true)
export const isLooping = writable(false)

export const audioStore = writable<IndexableStore<AudioStore>>({})
export const sliderStore = writable<IndexableStore<SliderStore>>({})
