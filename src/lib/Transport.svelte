<script>
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
  };
</script>

<section class="bg-green-500 p-5 m-8 w-1/4">
  <button
    id="play"
    class="border-2 border-black rounded p-2"
    on:click={handlePlay}>
    <svg height="75" width="90">
      <polygon
        points="0,0 0,75 90,37.5"
        class="fill-emerald-600 hover:fill-emerald-500" />
    </svg>
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
