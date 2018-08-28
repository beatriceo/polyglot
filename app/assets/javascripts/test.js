contactsVideo = document.getElementById("contacts-video");
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })

  localstream = stream;
  contactsVideo.srcObject = stream
  contactsVideo.muted = true
} catch (e) {
  console.error(e);
}
