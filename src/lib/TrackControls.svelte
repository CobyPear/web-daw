<script lang="ts">
  import {
    update_await_block_branch,
    validate_each_argument,
  } from 'svelte/internal';

  import {
    isPaused,
    isPlaying,
    isRecording,
    isStopped,
    audioUrlStore,
  } from './store';
  export let trackName: string;
  let audioURL: string;
  let isArmed = false;
  let track: MediaRecorder;
  let chunks: any = [];

  const onStop = () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' });
    audioURL = window.URL.createObjectURL(blob);
    audioUrlStore.set({
      ...$audioUrlStore,
      [trackName]: audioURL,
    });
    chunks = [];
  };
  const onPause = () => {
    console.log('pushing chunks...');
    chunks.push(track.requestData());
  };
  const armTrack = () => {
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
          track = new MediaRecorder(stream);
          track.onstop = onStop;
          track.onpause = onPause;
          // track.onresume =
          track.ondataavailable = function (e) {
            console.log('data is avail', e);
            chunks.push(e.data);
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
      }
    }
  });
  isPlaying.subscribe((value) => {
    if (value && track) {
      if (track.state === 'paused' && !$isStopped && $isRecording) {
        console.log('resuming recording...');
        track.resume();
      }
    }
  });
  isPaused.subscribe((value) => {
    if (value && track) {
      if (track.state === 'recording' && $isRecording) {
        console.log('pausing recording...');
        chunks.push(track.requestData());
        track.pause();
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

<section>
  <button class="p-2 my-2" on:click={armTrack}>
    <span>
      {trackName}
    </span>
    {isArmed ? '🔴' : '🔵'}
  </button>
  <button
    on:click={() => {
      if ($audioUrlStore[trackName]) {
        const answer = confirm('Are you sure you want to delete this?');
        if (answer) {
          delete $audioUrlStore[trackName];
          audioUrlStore.set($audioUrlStore);
        }
      }
    }}>❌</button>
</section>
