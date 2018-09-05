export default class FileTransfer {
  constructor() {
    this.local = document.querySelector("#remote-video-container #local-video");
    this.remote = document.querySelector(`#remote-video-container>video`);
    this.sendChannel = null;
    this.recieveChannel = null;
    this.files = null;

    this.recieveBuffer = [];
    this.recievedSize = 0;


    this.listen();
  }

  listen() {
    this.remote.addEventListener('dragover', (e) => {
      e.preventDefault();
    })
    this.remote.addEventListener('drop', (e) => {
      e.preventDefault();
      this.files = e.dataTransfer.files;

      fetch("chat_room_sessions", {
          method: "POST",
          body: JSON.stringify({
            type: "FILE_METADATA",
            size: this.files[0].size,
            name: this.files[0].name
          }),
          headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
        });
    }, false);
  }

  addPeer(connection) {
    this.sendChannel = connection.createDataChannel('sendDataChannel');
    this.sendChannel.binaryType = 'arraybuffer';
    console.log("Created Send Channel.");

    this.sendChannel.addEventListener('open', this.onSendOpen);
    this.sendChannel.addEventListener('close', this.onSendClose);
    this.sendChannel.addEventListener('error', this.onSendError);

    connection.addEventListener('datachannel', this.onRecieveChannel);
  }

  onSendOpen() {
    const state = this.sendChannel.readyState;
    if (state === "open") this.send();
  }

  onSendClose() {
    console.log("Send Channel is Closed.");
  }

  send() {
    const file = this.files[0];
    console.log("Sending File: " + file.name);

    if (file.size === 0) {
      throw new Error("0 is an invalid size...");
    }

    const chunkSize = 16384; //Why is this?
    const reader = new FileReader();
    let offset = 0;

    reader.addEventListener('error', console.error);
    reader.addEventListener('abort', console.info);
    reader.addEventListener('load', (e) => {
      console.log("Loading File...", e);
      this.sendChannel.send(e.target.result);
      offset += e.target.result.byteLength;

      if (offset < file.size) readSlice(offset);
    });

    const readSlice = offset => {
      reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
    }
    readSlice(0);
  }

  end() {
    this.sendChannel.close();
    if (this.recieveChannel) this.recieveChannel.close();
  }

  onRecieveChannel(e) {
    this.recieveChannel = e.channel;
    this.recieveChannel.binaryType = 'arraybuffer';
    this.recieveChannel.onmessage = this.onMessageRecieve;
    this.recieveChannel.onopen = this.onOpenRecieve;
    this.recieveChannel.onclose = this.onCloseRecieve;
  }

  onOpenRecieve() {
    console.log("Recieve Channel is Open");
  }

  onCloseRecieve() {
    console.log("Recieve Channel is Closed.");
  }

  onMessageRecieve(e) {
    this.recieveBuffer.push(e.data);
    this.recievedSize += e.data.byteLength;

    //File Size needs to be recieved from ActionCable
    if (this.recievedSize === file.size) {
      const recieved = new Blob(this.recieveBuffer);
      this.recieveBuffer = [];


      const url = URL.createObjectURL(recieved);
      //Get File Name Through ActionCable

      this.end();
    }
  }
}
