<script>
  import RecordingBay from '$lib/RecordingBay.svelte';
  import TrackBay from '$lib/TrackBay.svelte';
  import Transport from '$lib/Transport.svelte';
  import SliderBay from '$lib/SliderBay.svelte';
</script>

<main class="w-[100vw]">
  <section class="flex flex-row mt-8 overflow-x-scroll">
    <TrackBay />
    <RecordingBay />
  </section>
  <section class="flex flex-col md:flex-row">
    <Transport />
    <SliderBay />
  </section>
</main>
