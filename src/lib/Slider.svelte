<script lang="ts">
  import { sliderStore } from './store';

  let amplitude = 0.75;
  let lastAmplitude: number;
  export let track: string;

  const handleMute = (e: Event) => {
    if (e.target instanceof Element) {
      const currentState = e.target.innerHTML;
      if (currentState === '🔊') {
        lastAmplitude = amplitude;
        amplitude = 0;
        sliderStore.set({
          ...$sliderStore,
          [track]: {
            lastAmplitude: lastAmplitude,
            amplitude: amplitude,
          },
        });
      } else {
        amplitude = lastAmplitude;
        sliderStore.set({
          ...$sliderStore,
          [track]: {
            lastAmplitude: lastAmplitude,
            amplitude: amplitude,
          },
        });
      }
      e.target.innerHTML = currentState === '🔇' ? '🔊' : '🔇';
    }
  };
  // $: {
  //   console.log(
  //     sliderStore.set({
  //       ...$sliderStore,
  //       [track]: {
  //         ...$sliderStore[track],
  //         amplitude,
  //       },
  //     }),
  //   );
  // }
</script>

<!-- slider -->
<div class="flex flex-col">
  <label for="slider">
    {track}
  </label>
  <span>mute</span>
  <button class="text-4xl" on:click={handleMute}>🔊</button>
</div>
<input
  id="slider"
  class="-rotate-90"
  type="range"
  min="0"
  max="1"
  step="0.1"
  bind:value={amplitude}
  on:change={() => {
    console.log(amplitude)
    sliderStore.set({
      ...$sliderStore,
      [track]: {
        ...$sliderStore[track],
        amplitude,
      },
    });
  }} />
