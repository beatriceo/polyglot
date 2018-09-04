import NodeSocket from './nodeserver';
// Broadcast Types

const JOIN_ROOM = "JOIN_ROOM";
const EXCHANGE = "EXCHANGE";
const REMOVE_USER = "REMOVE_USER";

// DOM Elements
let currentUser;
let localVideo;
let remoteVideoContainer;

// Objects
let pcPeers = {}; // peer connection
let localstream;
let nodeSocket = new NodeSocket("http://localhost:1337");

window.onload = () => {
  currentUser = document.getElementById("current-user").innerHTML;
  localVideo = document.getElementById("local-video");
  remoteVideoContainer = document.getElementById("remote-video-container");
};

// Ice Credentials
const ice = { iceServers: [{urls: ['stun:stun.l.google.com:19302', 'stun:stun.1.google.com:19302']}]};

// Initialize user's own video
document.onreadystatechange = async () => {
  if (document.readyState === "interactive") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })

      localstream = stream;
      localVideo.srcObject = stream
      nodeSocket.grabAudio(stream);
      localVideo.muted = true

    } catch (e) { console.error(e); }
  }
};


const chatroomId = document.getElementById('chatroom-hook').dataset["chatroomId"]

const handleJoinSession = async () => {
  App['chatroom' + chatroomId] = await App.cable.subscriptions.create({
    channel: "ChatRoomsChannel",
    room: chatroomId
  }, {
    connected: () => {
      broadcastData({
        type: JOIN_ROOM,
        from: currentUser,
        room: chatroomId
      });
    },
    received: data => {
      if (data.from === currentUser) return;
      switch (data.type) {
        case JOIN_ROOM:
          return joinRoom(data);
        case EXCHANGE:
          if (data.to !== currentUser) return;
          return exchange(data);
        case REMOVE_USER:
          return removeUser(data);
        default:
          return;
      }
    }
  });
};

const handleLeaveSession = () => {
  for (user in pcPeers) {
    pcPeers[user].close();
  }
  pcPeers = {};

  App.session.unsubscribe();

  remoteVideoContainer.innerHTML = "";

  broadcastData({
    type: REMOVE_USER,
    from: currentUser
  });
};

const joinRoom = data => {
  createPC(data.from, true);
};

const removeUser = data => {
  let video = document.getElementById(`remoteVideoContainer+${data.from}`);
  video && video.remove();
  delete pcPeers[data.from];
};


const broadcastData = data => {
  fetch("chat_room_sessions", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
  });
};

const createPC = (userId, isOffer) => {
  let pc = new RTCPeerConnection(ice);
  let test = userId
  pcPeers[userId] = pc;
  pc.addStream(localstream);
  if (isOffer) {
    pc
      .createOffer()
      .then(offer => {
        pc.setLocalDescription(offer);
        broadcastData({
          type: EXCHANGE,
          from: currentUser,
          to: userId,
          sdp: JSON.stringify(pc.localDescription),
          room: chatroomId
        });
      })
      .catch(logError);
  }

  pc.onicecandidate = event => {
    if (event.candidate) {
      broadcastData({
        type: EXCHANGE,
        from: currentUser,
        to: userId,
        candidate: JSON.stringify(event.candidate),
        room: chatroomId
      });
    }
  };

  pc.onaddstream = event => {
    const element = document.createElement("video");
    element.id = `remoteVideoContainer+${userId}`;  // why is the userId being interpolated?
    element.autoplay = "autoplay";
    element.srcObject = event.stream;
    element.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    remoteVideoContainer.appendChild(element);
    localVideo.classList.add("video-sm");
  };

  pc.oniceconnectionstatechange = event => {
    if (pc.iceConnectionState == "disconnected") {
      console.log("Disconnected:", userId);
      broadcastData({
        type: REMOVE_USER,
        from: userId
      });
    }
  };

  return pc;
};


const exchange = data => {
  let pc;

  if (!pcPeers[data.from]) {
    pc = createPC(data.from, false);
  } else {
    pc = pcPeers[data.from];
  }

  if (data.candidate) {
    pc
      .addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
      .then(() => console.log("Ice candidate added"))
      .catch(logError);
  }

  if (data.sdp) {
    const sdp = JSON.parse(data.sdp);
    pc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => {
        if (sdp.type === "offer") {
          pc.createAnswer().then(answer => {
            pc.setLocalDescription(answer);
            broadcastData({
              type: EXCHANGE,
              from: currentUser,
              to: data.from,
              sdp: JSON.stringify(pc.localDescription),
              room: chatroomId
            });
          });
        }
      })
      .catch(logError);
  }
};

const logError = error => console.warn("Whoops! Error:", error);


const joinButton = document.getElementById("join-btn")
joinButton.addEventListener('click', event => {
  handleJoinSession()
})

// WARNING: COMPLETELY HACKISH SOLUTION --> MUST INTRODUCE SOME SORT OF DELAY!
setTimeout(function() {
  joinButton.click()
}, 5000);

