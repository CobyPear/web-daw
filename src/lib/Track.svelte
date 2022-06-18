<script lang="ts">
  import { audioUrlStore, isPlaying, isRecording, sliderStore } from './store';
  export let trackName: string;
  let audioURL: string;
  let isMuted: boolean;
  let amplitude: number;
  let currentTrack: HTMLMediaElement;
  audioUrlStore.subscribe((value) => {
    audioURL = value[trackName] as string;
  });
  sliderStore.subscribe((value) => {
    if (trackName in value) {
      amplitude = value[trackName.toString()].amplitude;
      isMuted = !value[trackName.toString()].amplitude;
    }
  });
  isPlaying.subscribe((value) => {
    if (value && !$isRecording && audioURL) {
      currentTrack?.play();
    }
  });
</script>

<audio
  src={audioURL}
  volume={amplitude / 100}
  muted={isMuted}
  bind:this={currentTrack}
  on:play={(e) => {
    console.log(e);
  }} />
