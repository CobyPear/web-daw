<script>
  import { isPlayingStore } from './store';
  const meters = [1, 2, 4, 8, 16, 32];
  let chosenMeter = 4;
  let chosenBeats = 4;
  /**@type string*/
  let chosenTimeSignature;
  const handlePlay = () => {
    if (!chosenMeter || !chosenBeats) {
      return;
    }
    chosenTimeSignature = `${chosenBeats}/${chosenMeter}`;
    isPlayingStore.set(!$isPlayingStore);
  };
</script>

<section class="bg-green-500 p-5 mt-8 min-w-[20rem] min-h-[18rem]">
  <button
    id="play"
    class="border-2 border-black rounded p-2"
    on:click={handlePlay}>
    {#if !$isPlayingStore}
      <svg height="75" width="90">
        <polygon
          points="0,0 0,75 90,37.5"
          class="fill-emerald-600 hover:fill-emerald-800" />
      </svg>
    {:else}
      <svg height="75" width="90">
        <g class="stroke-blue-500 hover:stroke-blue-400">
          <line x1="30" x2="30" y1="0" y2="90" stroke-width="15" />
          <line x1="45" x2="45" y1="0" y2="90" stroke-width="15" class="stroke-green-500" />
          <line x1="60" x2="60" y1="0" y2="90" stroke-width="15" />
        </g>
      </svg>
    {/if}
  </button>
  <button class="border-2 border-black rounded p-2">
    <svg height="75" width="75">
      <rect height="75" width="75" class="fill-red-600 hover:fill-red-500" />
    </svg>
  </button>
  <div class="flex">
    <form id="timeSignatureContainer" class="flex flex-col w-fit">
      <span>Time Signature</span>
      <label for="beatsPerMeasure"> Beats Per Measure </label>
      <input
        id="beatsPerMeasure"
        type="number"
        required
        min="1"
        class="w-[34px]"
        bind:value={chosenBeats} />
      <label for="meter"> Meter </label>
      <input
        id="meter"
        list="meters"
        name="timeSig"
        class="w-[34px]"
        min="1"
        max="32"
        required
        bind:value={chosenMeter} />
      <datalist id="meters">
        {#each meters as meter}
          <option value={meter}>{meter}</option>
        {/each}
      </datalist>
    </form>
    <div id="chosenTimeSignature" class="text-6xl ml-auto mr-12 mt-auto mb-8">
      {chosenTimeSignature ? chosenTimeSignature : ''}
    </div>
  </div>
</section>

<style></style>
