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
    updateStore,
  } from './store';
  interface HTMLMediaElementWithCaptureStream extends HTMLAudioElement {
    captureStream(): MediaStream;
  }
  export let trackName: string;
  let canvas: HTMLCanvasElement;
  let audioURL: string;
  let isMuted: boolean;
  let amplitude: number;
  let currentTrack: HTMLMediaElementWithCaptureStream;

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
      const stream = currentTrack.captureStream();
      console.log('stream', stream);
      console.log('Starting Vizualizer...');
      console.log(
        `$vizualizerStore[${trackName}]`,
        $vizualizerStore[trackName],
      );
      updateStore(vizualizerStore, {
        [trackName]: {
          ...$vizualizerStore[trackName],
          source:
            $vizualizerStore[trackName].audioCtx.createMediaStreamSource(
              stream,
            ),
          stream: stream,
        },
      });
      vizualiser(canvas, stream);
    }
  });
  isPaused.subscribe((value) => {
    if (value && ($isPlaying || $isPaused) && currentTrack) {
      currentTrack.pause();
      console.log('Stopping Vizualizer...');
      cancelAnimationFrame(drawVisual);
    }
  });
  isStopped.subscribe((value) => {
    if (value && ($isPlaying || $isPaused) && currentTrack) {
      currentTrack.pause();
      currentTrack.currentTime = 0;
      console.log('Stopping Vizualizer...');
      cancelAnimationFrame(drawVisual);
    }
  });
  function vizualiser(canvas: HTMLCanvasElement, stream: MediaStream) {
    if (!canvas || !stream) {
      return;
    }
    // TODO: Needs cleanup. If we are recording, vizualize incoming sound.
    // otherwise vizualse recorded sound, but only when it is playing.
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;
    // const { source, analyser, audioCtx, dataArray, bufferLength } =
    //   $vizualizerStore[trackName];
    const bufferLength = 2048;
    const dataArray = new Uint8Array(bufferLength);
    const canvasCtx = canvas.getContext('2d');
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    let source;
    if (currentTrack.captureStream()) {
      source = audioCtx.createMediaStreamSource(currentTrack.captureStream());
    }
    source?.connect(analyser);
    analyser.connect(audioCtx.destination);
    if (!canvasCtx) {
      return;
    }
    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    const draw = function () {
      console.log('Drawing...');
      drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);
      console.log(
        'analyser.getByteTimeDomainData(dataArray);',
        analyser.getByteTimeDomainData(dataArray),
      );
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

  let drawVisual: number;
  $: if (
    ($vizualizerStore[trackName] && 'stream' in $vizualizerStore[trackName]) ||
    currentTrack?.captureStream()
  ) {
    console.log('Starting Vizualizer...');
    vizualiser(
      canvas,
      currentTrack.captureStream() ||
        ($vizualizerStore[trackName].stream as MediaStream),
    );
  }
  $: if ($vizualizerStore[trackName]) {
    if (currentTrack.captureStream() === undefined) {
      console.log('Stopping Vizualizer...');
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
