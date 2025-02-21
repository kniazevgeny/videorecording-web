// based on https://gist.github.com/tatsuyasusukida/b21c4c7d73c5e3d91ab97d8c040bc48e

async function main() {
  const buttonStart = document.querySelector("#buttonStart");
  const buttonStop = document.querySelector("#buttonStop");
  const videoLive = document.querySelector("#videoLive");
  const videoRecorded = document.querySelector("#videoRecorded");
  const recordingIndicator = document.querySelector("#recordingIndicator");
  const stopwatch = document.querySelector("#stopwatch");
  const videoContainer = document.querySelector("#videoContainer");
  const playbackContainer = document.querySelector("#playbackContainer");
  const recordingStatus = document.querySelector("#recordingStatus");
  const buttonRestart = document.querySelector("#buttonRestart");

  let startTime;
  let stopwatchInterval;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function updateStopwatch() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${(
      seconds % 60
    )
      .toString()
      .padStart(2, "0")}`;
    stopwatch.textContent = formattedTime;
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    // <1>
    video: true,
    audio: true,
  });

  videoLive.srcObject = stream;

  if (!MediaRecorder.isTypeSupported("video/webm")) {
    // <2>
    console.warn("video/webm is not supported");
  }

  const mediaRecorder = new MediaRecorder(stream, {
    // <3>
    mimeType: "video/webm",
  });

  buttonStart.addEventListener("click", () => {
    mediaRecorder.start();
    startTime = Date.now();
    stopwatchInterval = setInterval(updateStopwatch, 1000);

    // Change theme color to red
    themeColorMeta.setAttribute("content", "#ff0000");

    // Show recording indicator and update status
    recordingIndicator
      .querySelector(".recordingIndicator__on")
      .classList.remove("hidden");
    recordingStatus.textContent =
      "Recording in progress... Press Stop when finished";

    // Update button states
    buttonStart.classList.add("hidden");
    buttonStop.removeAttribute("disabled");
    buttonStop.classList.remove("opacity-50", "cursor-not-allowed");
  });

  buttonStop.addEventListener("click", () => {
    mediaRecorder.stop();
    clearInterval(stopwatchInterval);

    // Reset theme color to original
    themeColorMeta.setAttribute("content", "#000000");

    // Update status text
    recordingStatus.textContent =
      "Recording complete - Video ready for playback";

    // Hide recording indicator and live video
    setTimeout(() => {
      recordingIndicator
        .querySelector(".recordingIndicator__on")
        .classList.add("hidden");
      videoContainer.classList.add("hidden");

      // Show recorded video
      playbackContainer.classList.remove("hidden");

      // Mirror the video when rewinding
      videoRecorded.classList.add("mirror");

      // Show the restart button
      buttonRestart.classList.remove("hidden");
    }, 1500); // Give user time to read the completion message

    // Update button states
    buttonStop.setAttribute("disabled", "");
    buttonStop.classList.add("opacity-50", "cursor-not-allowed");
    buttonStart.classList.remove("hidden");
  });

  // Add event listener for the restart button
  buttonRestart.addEventListener("click", () => {
    // Reset the application state
    videoRecorded.classList.remove("mirror");
    playbackContainer.classList.add("hidden");
    videoContainer.classList.remove("hidden");
    recordingIndicator.classList.add("hidden");
    buttonRestart.classList.add("hidden");
    buttonStart.classList.remove("hidden");
    buttonStop.setAttribute("disabled", "");
    buttonStop.classList.add("opacity-50", "cursor-not-allowed");
    recordingStatus.textContent = "Press Start to begin recording";
    stopwatch.textContent = "00:00";
  });

  // Show initial status
  recordingIndicator.classList.remove("hidden");
  recordingStatus.textContent = "Press Start to begin recording";

  mediaRecorder.addEventListener("dataavailable", (event) => {
    videoRecorded.src = URL.createObjectURL(event.data); // <6>
  });
}

main();
