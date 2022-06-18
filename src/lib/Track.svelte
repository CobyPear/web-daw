<script lang="ts">
  import {
    audioUrlStore,
    isPlaying,
    isPaused,
    isRecording,
    isStopped,
    isLooping,
    sliderStore,
  } from './store';
  export let trackName: string;
  let audioURL: string;
  let isMuted: boolean;
  let amplitude: number;
  let currentTrack: HTMLMediaElement;
  audioUrlStore.subscribe((value) => {
    audioURL = value[trackName] as string;
  });
  sliderStore.subscribe((value) => {
    if (trackName in value && currentTrack) {
      currentTrack.volume = value[trackName.toString()].amplitude;
      currentTrack.muted = !value[trackName.toString()].amplitude;
    }
  });
  isPlaying.subscribe((value) => {
    if (value && !$isRecording && audioURL && currentTrack) {
      console.log('Starting audio...');
      currentTrack.play();
    }
  });
  isPaused.subscribe((value) => {
    if (value && ($isPlaying || $isPaused) && currentTrack) {
      currentTrack.pause();
    }
  });
  isStopped.subscribe((value) => {
    if (value && ($isPlaying || $isPaused) && currentTrack) {
      currentTrack.pause();
      currentTrack.currentTime = 0;
    }
  });
</script>

<audio
  src={audioURL}
  volume={amplitude}
  muted={isMuted}
  loop={Boolean($isLooping)}
  bind:this={currentTrack}
  on:play={(e) => {}}
  on:ended={() => {
    isPlaying.set(false);
  }} />
