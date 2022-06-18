<script>
  import RecordingBay from '$lib/RecordingBay.svelte';
  import TrackBay from '$lib/TrackBay.svelte';
  import Transport from '$lib/Transport.svelte';
  import SliderBay from '$lib/SliderBay.svelte';
</script>

<main>
  <section class="flex flex-row w-[100vw] h-[30vw] mt-8">
    <TrackBay />
    <RecordingBay />
  </section>
  <section class="flex flex-row w-[100vw]">
    <Transport />
    <SliderBay />
  </section>
</main>
