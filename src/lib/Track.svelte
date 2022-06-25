<script lang="ts">
  import { browser } from '$app/env';

  import { onDestroy } from 'svelte';

  import {
    audioStore,
    isPlaying,
    isPaused,
    isRecording,
    isStopped,
    isLooping,
    sliderStore,
    vizualizerStore,
  } from './store';
  export let trackName: string;
  let canvas: HTMLCanvasElement;
  let audioURL: string;
  let isMuted: boolean;
  let amplitude: number;
  let currentTrack: HTMLMediaElement;
  audioStore.subscribe((value) => {
    if (value[trackName]) {
      audioURL = value[trackName].url;
      if (!('url' in value[trackName])) {
      }
    } else {
      audioURL = '';
    }
  });
  sliderStore.subscribe((value) => {
    if (value && trackName in value && currentTrack) {
      currentTrack.volume = value[trackName].amplitude;
      currentTrack.muted = !value[trackName].amplitude;
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

  let drawVisual: number;
  $: if ($audioStore[trackName] && 'track' in $audioStore[trackName]) {
    console.log('Starting Vizualizer...');
    vizualiser(canvas, $audioStore[trackName].track.stream);
    function vizualiser(canvas: HTMLCanvasElement, stream: MediaStream) {
      if (!canvas || !stream) {
        return;
      }
      // TODO: Needs cleanup. If we are recording, vizualize incoming sound.
      // otherwise vizualse recorded sound, but only when it is playing.
      let WIDTH = canvas.width;
      let HEIGHT = canvas.height;
      const { source, analyser, audioCtx, dataArray, bufferLength } =
        $vizualizerStore[trackName];
      const canvasCtx = canvas.getContext('2d');
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      if (!canvasCtx) {
        return;
      }
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      const draw = function () {
        console.log('Drawing...');
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = (WIDTH * 1.0) / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = (v * HEIGHT) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      };

      draw();
    }
  }
  $: if ($vizualizerStore[trackName]) {
    if (!('source' in $vizualizerStore[trackName])){
      console.log('Stopping Vizualizer...')
      cancelAnimationFrame(drawVisual);
    }
  }

  onDestroy(() => {
    if (browser) {
      return cancelAnimationFrame(drawVisual);
    }
  });
</script>

<audio
  src={audioURL || null}
  volume={amplitude}
  muted={isMuted}
  loop={Boolean($isLooping)}
  bind:this={currentTrack}
  on:play={() => {}}
  on:ended={() => {
    isPlaying.set(false);
    return window.cancelAnimationFrame(drawVisual);
  }} />
<canvas height="100" width="1000" bind:this={canvas} />
