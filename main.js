// https://gist.github.com/tatsuyasusukida/b21c4c7d73c5e3d91ab97d8c040bc48e

async function main() {
  const buttonStart = document.querySelector("#buttonStart");
  const buttonStop = document.querySelector("#buttonStop");
  const videoLive = document.querySelector("#videoLive");
  const videoRecorded = document.querySelector("#videoRecorded");

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
    mediaRecorder.start(); // <4>
    buttonStart.setAttribute("disabled", "");
    buttonStart.classList.add("opacity-50");
    buttonStop.removeAttribute("disabled");
    buttonStop.classList.remove("opacity-50");
    buttonStop.classList.remove("cursor-not-allowed");
  });

  buttonStop.addEventListener("click", () => {
    mediaRecorder.stop(); // <5>
    buttonStart.removeAttribute("disabled");
    buttonStart.classList.remove("opacity-50");
    buttonStop.setAttribute("disabled", "");
    buttonStop.classList.add("opacity-50");
    buttonStop.classList.add("cursor-not-allowed");
  });

  mediaRecorder.addEventListener("dataavailable", (event) => {
    videoRecorded.src = URL.createObjectURL(event.data); // <6>
  });
}

main();
