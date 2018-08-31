const contactsVideo = document.getElementById("contacts-video")

try {
  const contactsStream = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then(stream => {
    contactsVideo.srcObject = stream;
    contactsVideo.muted = true;
  })
} catch(e) {
  console.error(e);
  contactsVideo.innerHTML = "Unable to getUserMedia()";
}
