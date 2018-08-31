import ActionCable from 'actioncable'

// create App object with key cable == new cosumer
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
    // console.log(data["message"]["user_id"])
    // console.log(userId)
    console.log("received broadcast")
    // console.log(data.body)
    if (data.head === 302 && data.body["caller"] === userId && data.path) {
      window.location.pathname = data.path
    } else if (data["message"]["user_id"] === userId) { // Some error appears here but it is not fatal
      console.log("TRIGGER MODAL")
      const acceptButton = document.getElementById('accept-button')
      acceptButton.style.display = "block"

      chatRoomId = data["message"]["chat_room_id"]
      console.log(`user with id: ${userId} needs to subscribe to chatroom ${[chatRoomId]}`)
    } else {
      console.log(data)
    }


  }
})


const acceptButton = document.getElementById('accept-button')

acceptButton.addEventListener('click', event => {
  // event.preventDefault()
  document.getElementById('chat-room-id').value = chatRoomId
})
