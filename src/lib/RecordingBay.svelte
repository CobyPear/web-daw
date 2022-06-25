<script lang="ts">
  import { isPlaying, isRecording, isPaused, isStopped } from './store';
  import Track from './Track.svelte';
  import TrackControls from './TrackControls.svelte';
  import { onMount } from 'svelte';
  let globalTime = 0;
  let seconds = 0;
  let minutes = 0;
  let miliseconds = 0;
  onMount(() => {
    let globalTimer: NodeJS.Timer | number;
    const tick = () => {
      ++globalTime;
      seconds = Math.floor(globalTime / 1000) % 60;
      minutes = Math.floor(seconds / 60) % 60;
      miliseconds = globalTime % 1000;
    };
    isPaused.subscribe((value) => {
      if (value && globalTimer) {
        clearInterval(globalTimer);
      }
    });
    isPlaying.subscribe((value) => {
      if (value) {
        globalTimer = setInterval(tick);
      }
    });
    isStopped.subscribe((value) => {
      if (value && globalTimer) {
        clearInterval(globalTimer);
        globalTimer = 0;
        seconds = 0;
        minutes = 0;
        miliseconds = 0;
      }
    });
  });
</script>

<article class="flex flex-col space-y-4 min-w-fit bg-yellow-500">
  <TrackControls trackName="track1" />
  <TrackControls trackName="track2" />
  <TrackControls trackName="track3" />
  <TrackControls trackName="track4" />
</article>
<article class="w-[100vw]">
  <!-- timer strip -->
  <section class="absolute top-0">
    <span>{minutes}:{seconds}:{miliseconds}</span>
  </section>
  <Track trackName="track1" />
  <Track trackName="track2" />
  <Track trackName="track3" />
  <Track trackName="track4" />
</article>
