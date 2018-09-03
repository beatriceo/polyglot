import ActionCable from 'actioncable'
import { triggerCalleeModalEvent } from "./application.js";

// create App object with key cable == new consumer
(function() {
  window.App || (window.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);


const userId = parseInt(document.getElementById("my-user-id").dataset["userId"])
let chatRoomId = null

App.cable.subscriptions.create({
  channel: 'NotificationsChannel'
}, {
  connected: () => {
    console.log('Connected to NotificationsChannel')
  },
  received: data => {
    console.log("received broadcast")

    if (data.head === 302 && data.body["caller"] === userId && data.path) {
      window.location.pathname = data.path
    } else if (data["message"]["user_id"] === userId) {

      // DISPLAY ACCEPT BUTTON
      const acceptButton = document.getElementById('accept-button')
      acceptButton.style.display = "block"

      triggerCalleeModalEvent()
      document.getElementById('caller-name').innerHTML = data["message"]["caller_info"]
      document.getElementById('caller-photo').src = data["message"]["caller_photo"]

      chatRoomId = data["message"]["chat_room_id"]
      console.log(`user with id: ${userId} needs to subscribe to chatroom ${[chatRoomId]}`)
    } else {
      console.log(data)
    }


  }
})

// Receive information from index.html.erb
const acceptButton = document.getElementById('accept-button')

acceptButton.addEventListener('click', event => {
  document.getElementById('chat-room-id').value = chatRoomId
})
