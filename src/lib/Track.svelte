<script lang="ts">
  import { isPlayingStore } from './store';

  let isArmed = false;
  let audioURL: string;
  let track: MediaRecorder;

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

  $: track && $isPlayingStore && isArmed ? track.start() : track?.stop();
</script>

<audio src={audioURL} />
<button on:click={armTrack}>{isArmed ? "🔴" : "🔵"}</button>
