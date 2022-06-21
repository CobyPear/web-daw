<script lang="ts">
  import { beforeUpdate, onMount } from 'svelte';
  import TrackVisualizer from './TrackVisualizer.svelte';
  import {
    audioStore,
    isPlaying,
    isPaused,
    isRecording,
    isStopped,
    isLooping,
    sliderStore,
  } from './store';
  export let trackName: string;
  let canvas: HTMLCanvasElement;
  let frame: number

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

  function visualize(canvas: HTMLCanvasElement, stream: MediaStream) {
      // if (!canvas || !stream) return;
      const audioCtx = new AudioContext();
      const canvasCtx = canvas.getContext('2d');

      const source = audioCtx.createMediaStreamSource(stream);

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      function draw() {
        if (!canvasCtx) return;
        console.log('DRAWING');
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(180, 180, 180)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        const sliceWidth = (WIDTH * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] ?? 0) / 128.0;
          const y = (v * HEIGHT) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }

      return draw;
    }

    beforeUpdate(() => {
      console.log("onPlay")
      const draw = visualize(canvas, $audioStore[trackName].stream);
      frame = window.requestAnimationFrame(draw);
      return () => window.cancelAnimationFrame(frame);
    })
  
</script>

<audio
  src={audioURL || null}
  volume={amplitude}
  muted={isMuted}
  loop={Boolean($isLooping)}
  bind:this={currentTrack}
  on:play={() => {

 }}
  on:ended={() => {
    isPlaying.set(false);
  }} />
<canvas height="100" width="1000" bind:this={canvas} />
