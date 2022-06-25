<script lang="ts">
  import type { Writable } from 'svelte/store';
  import {
    isPaused,
    isPlaying,
    isRecording,
    isStopped,
    audioStore,
    vizualizerStore,
  } from './store';
  export let trackName: string;
  let audioURL: string;
  let isArmed = false;
  let track: MediaRecorder;
  let chunks: any = [];
  let currentStream;

  function updateStore<T>(store: Writable<T>, { ...args }: T) {
    store.set({
      ...store,
      ...args,
    });
  }

  const onStop = () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' });
    audioURL = window.URL.createObjectURL(blob);
    updateStore(audioStore, {
      [trackName]: {
        ...$audioStore[trackName],
        url: audioURL,
        track,
      },
    });
    $vizualizerStore[trackName].source.disconnect();

    chunks = [];
  };
  const onPause = () => {
    console.log('pushing chunks...');
    chunks.push(track.requestData());
    $vizualizerStore[trackName].source.disconnect();
  };
  const armTrack = () => {
    // Adapted from MDN docs and the following:
    // https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js#L123-L167
    // TODO: Add vizualization, recompontentize things to make it flow.
    // (maybe rewrite all/most in App then break things out as needed)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices
        .getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
          },
        )
        // Success callback
        .then(function (stream) {
          currentStream = stream;
          track = new MediaRecorder(stream);
          track.onstop = onStop;
          track.onpause = onPause;
          // track.onresume =
          let audioCtx, analyser, source;
          if (!$vizualizerStore[trackName]) {
            console.log('Setting vizualiser store...');
            //@ts-ignore
            audioCtx = new (AudioContext || webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            source = audioCtx.createMediaStreamSource(stream);
            const bufferLength = 2048;
            updateStore(vizualizerStore, {
              [trackName]: {
                ...$vizualizerStore[trackName],
                source,
                analyser,
                audioCtx,
                bufferLength,
                dataArray: new Uint8Array(bufferLength),
              },
            });
          }
          track.ondataavailable = function (e) {
            console.log('data is availlable. pushing data to chunks array...');
            chunks.push(e.data);
            updateStore(audioStore, {
              [trackName]: {
                ...$audioStore[trackName],
                track,
              },
            });
          };
        })
        // Error callback
        .catch(function (err) {
          console.log('The following getUserMedia error occurred: ' + err);
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
    isArmed = !isArmed;
    if ((!isArmed && $isRecording) || (!isArmed && $isRecording && $isPaused)) {
      // call stop if we disarm while recording
      // to save the blob
      onStop();
    }
  };
  isStopped.subscribe((value) => {
    if (value && track) {
      if (track.state.match(/recording|paused/) && $isRecording) {
        console.log('stopping recording...');
        track.stop();
        updateStore(audioStore, {
          [trackName]: {
            ...$audioStore[trackName],
            track,
          },
        });
      }
    }
  });
  isPlaying.subscribe((value) => {
    if (value && track) {
      if (track.state === 'paused' && !$isStopped && $isRecording) {
        console.log('resuming recording...');
        track.resume();
        updateStore(audioStore, {
          [trackName]: {
            ...$audioStore[trackName],
            track,
          },
        });
      }
    }
  });
  isPaused.subscribe((value) => {
    if (value && track) {
      if (track.state === 'recording' && $isRecording) {
        console.log('pausing recording...');
        chunks.push(track.requestData());
        track.pause();
        updateStore(audioStore, {
          [trackName]: {
            ...$audioStore[trackName],
            track,
          },
        });
      }
    }
  });
  isRecording.subscribe((value) => {
    if (value && track && isArmed) {
      if (track.state === 'inactive' || (track.state === 'paused' && isArmed)) {
        console.log('starting recording...');
        track.start();
      }
    }
  });
</script>

<section class="flex flex-row place-content-around">
  <button class="p-2 m-2" on:click={armTrack}>
    <span>
      {trackName}
    </span>
    {isArmed ? '🔴' : '🔵'}
  </button>
  <button
    class="p-4 m-2"
    on:click={() => {
      if ($audioStore[trackName]) {
        const answer = confirm('Are you sure you want to delete this?');
        if (answer) {
          delete $audioStore[trackName];
          audioStore.set($audioStore);
          console.log($audioStore);
        }
      }
    }}>
    ❌
  </button>
</section>
