<script lang="ts">
  import {
    isPaused,
    isPlaying,
    isRecording,
    isStopped,
    audioStore,
  } from './store';
  export let trackName: string;
  let audioURL: string;
  let isArmed = false;
  let track: MediaRecorder;
  let chunks: any = [];

  const onStop = () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' });
    audioURL = window.URL.createObjectURL(blob);
    audioStore.set({
      ...$audioStore,
      [trackName]: {
        ...$audioStore[trackName],
        url: audioURL,
      },
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
            console.log('data is availlable. pushing data to chunks array...');
            chunks.push(e.data);
          };
          audioStore.set({
            ...$audioStore,
            [trackName]: {
              ...$audioStore[trackName],
              stream: stream
            },
          });
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
      if ($audioStore[trackName]) {
        const answer = confirm('Are you sure you want to delete this?');
        if (answer) {
          delete $audioStore[trackName];
          audioStore.set($audioStore);
          console.log($audioStore)
        }
      }
    }}>❌</button>
</section>
