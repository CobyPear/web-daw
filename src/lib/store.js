import { writable } from 'svelte/store';

export const isRecording = writable(false)
export const isPlaying = writable(false)
export const isPaused = writable(false)
export const isStopped = writable(true)