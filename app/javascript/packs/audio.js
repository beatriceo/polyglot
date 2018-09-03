const AUDIO_DATA = "AUDIO_DATA";

export default class AudioData {
  constructor(host, reciever, room) {
    this.host = host;
    this.reciever = reciever;
    this.room = room;
    this.decoder = new TextDecoder("ascii");
  }
  async intercept(stream) { // MediaStream

    AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processor.connect(ctx.destination);
    processor.onaudioprocess = e => this.handleBuffer(e);

    ctx.createMediaStreamSource(stream).connect(processor);
    ctx.resume();

  }

  broadcast(data) {
    fetch("chat_room_sessions", {
      method: "POST",
      body: JSON.stringify({
        type: AUDIO_DATA,
        from: this.host,
        to: this.reciever,
        room: this.room,
        audio: data.toString()
      }),
      headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
    })
  }

  handleBuffer(e) {
    const l = e.inputBuffer.getChannelData(0)
    const l16 = convertF32ToInt16(l);
    this.broadcast(this.decoder.decode(l16));

    function convertF32ToInt16(buffer) {
      let l = buffer.length;

      let buf = new Int16Array(l / 3);

      while (l--) {
        if (l % 3 == 0) {
          buf[l / 3] = buffer[l] * 0xFFFF;
        }
      }
      return buf;
    }
  }
}
