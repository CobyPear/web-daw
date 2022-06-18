<script lang="ts">
  let amplitude = 75;
  let lastAmplitude: number;
  export let track: string;

  const handleMute = (e: Event) => {
    if (e.target instanceof Element) {
      const currentState = e.target.innerHTML;
      if (currentState === '🔊') {
        lastAmplitude = amplitude;
        amplitude = 0;
      } else {
        amplitude = lastAmplitude;
      }
      e.target.innerHTML = currentState === '🔇' ? '🔊' : '🔇';
    }
  };
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
  max="100"
  bind:value={amplitude} />
