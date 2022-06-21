<script lang="ts">
  import { beforeUpdate, afterUpdate, onMount } from 'svelte';
  import { audioStore } from '$lib/store';
  import Recording from './Recording.svelte';

  export let trackName: string;
  let canvas: HTMLCanvasElement;

  let stream: MediaStream;
  let draw: (() => void) | undefined;
    onMount(() => {
      function visualize(canvas: HTMLCanvasElement, stream: MediaStream) {
        if (!canvas || !stream) return;
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
      let frame: number;
      const drawIfStream = () => {
        if (trackName in $audioStore && 'stream' in $audioStore[trackName]) {
          stream = $audioStore[trackName]?.stream;
          draw = visualize(canvas, stream);
        }
        return draw;
      };
      requestAnimationFrame(() => drawIfStream);
      return () => cancelAnimationFrame(frame);
    });
</script>

<canvas height="100" width="1000" bind:this={canvas} />
