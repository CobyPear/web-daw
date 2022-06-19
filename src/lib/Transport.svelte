<script lang="ts">
  import {
    isLooping,
    isPaused,
    isPlaying,
    isRecording,
    isStopped,
  } from './store';
  const meters = [1, 2, 4, 8, 16, 32];
  let chosenMeter = 4;
  let chosenBeats = 4;
  let chosenTimeSignature: string;
  const handleRecord = () => {
    if (!chosenMeter || !chosenBeats) {
      return;
    }
    chosenTimeSignature = `${chosenBeats}/${chosenMeter}`;
    isRecording.set(!$isRecording);
    isPaused.set($isPlaying);
    isPlaying.set($isRecording);
    isStopped.set(false);
  };

  isPlaying.subscribe((value) => {
    isPaused.set(!value);
  });
  const handlePlayPause = () => {
    // TODO: clean this up...
    if (
      (!$isPlaying && $isStopped) ||
      (!$isPlaying && !$isStopped && $isPaused)
    ) {
      isPlaying.set(true);
      isPaused.set(false);
      isStopped.set(false);
      return;
    }
    if (
      ($isPlaying && $isRecording) ||
      (!$isPaused && $isPlaying && !$isStopped)
    ) {
      isPlaying.set(false);
      isPaused.set(true);
      return;
    }
  };
  // TODO: also reset the scrubber & time to 0
  const handleStop = () => {
    isStopped.set(true);
    isRecording.set(false);
    isPaused.set(true);
    isPlaying.set(false);
  };

  // debug
  // $: {
  //   console.log('isStopped', $isStopped);
  //   console.log('isRecording', $isRecording);
  //   console.log('isPlaying', $isPlaying);
  //   console.log('isPaused', $isPaused);
  // }
</script>

<article class="bg-green-500 p-5 mx-auto md:mx-0 min-w-[26rem] max-w-fit min-h-[18rem]">
  <section class="flex md:flex-row justify-between ">
    <button
      id="play"
      class="border-2 border-black rounded p-2 max-w-fit"
      on:click={handlePlayPause}>
      {#if !$isPlaying && $isPaused}
        <svg height="75" width="75">
          <polygon
            points="0,0 0,75 75,37.5"
            class="fill-emerald-600 hover:fill-emerald-500 active:fill-emerald-400 focus:fill-emerald-300" />
        </svg>
      {:else if $isPlaying && (!$isPaused || !$isStopped)}
        <svg height="75" width="75">
          <g class="stroke-blue-500 hover:stroke-blue-400 active:stroke-blue-300 focus:stroke-blue-200">
            <line x1="20" x2="20" y1="0" y2="75" stroke-width="20" />
            <line
              x1="37.5"
              x2="37.5"
              y1="0"
              y2="75"
              stroke-width="15"
              class="stroke-green-500" />
            <line x1="55" x2="55" y1="0" y2="75" stroke-width="20" />
          </g>
        </svg>
      {/if}
    </button>
    <button
      on:click={handleStop}
      class="border-2 border-black rounded p-2 max-w-fit">
      <svg height="75" width="75">
        <rect height="75" width="75" class="fill-red-600 hover:fill-red-500 active:fill-red-400 focus:fill-red-300" />
      </svg>
    </button>
    <button
      on:click={handleRecord}
      class="border-2 border-black rounded p-2 max-w-fit">
      <svg height="75" width="75">
        <circle
          cx="37.5"
          cy="37.5"
          r="36"
          class={`${
            $isRecording ? 'fill-red-200' : 'fill-red-600'
          } hover:fill-red-500 active:fill-red-400`} />
      </svg>
    </button>
    <button>
      Loop
      <span
        class="block text-4xl p-3 m-2 bg-stone-300 rounded-full w-fit hover:bg-stone-400 active:bg-stone-500 focus:bg-stone-600"
        on:click={(e) => {
          isLooping.set(!$isLooping);
          if (e.target instanceof Element) {
            e.target.classList.toggle('animate-spin');
          }
        }}>
        ♻️
      </span>
    </button>
  </section>
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
</article>
