<script lang="ts">
  import { isPaused, isPlaying, isStopped } from './store';
  export let title: string;
  let isArmed = false;
  let audioURL: string;
  let track: MediaRecorder;
  let chunks: any = [];

  const onStop = () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' });
    audioURL = window.URL.createObjectURL(blob);
    chunks = [];
  };
  const onPause = () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' });
    audioURL = window.URL.createObjectURL(blob);
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
          track.ondataavailable = function (e) {
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
  };

  // start the track if it's armed and 'play' on the transport is hit
  $: track && $isStopped && isArmed && track.start();
  // pause the track if it's armed and 'pause' on the transport is hit and we are recording
  $: track &&
    track.state === 'recording' &&
    $isPlaying &&
    isArmed &&
    track.pause();
  // stop the track if it's armed and 'stop' on the transport is hit and we are recording
  $: track &&
    ($isPlaying || $isPaused) &&
    isArmed &&
    (track.state === 'recording' || track.state === 'paused') &&
    track.stop();

  $: console.log(track && track.state)
</script>

<span>{title}</span>
<button on:click={armTrack}>{isArmed ? '🔴' : '🔵'}</button>
<audio controls src={audioURL} />
