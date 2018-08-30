import ActionCable from 'actioncable'

// create App object with key cable == new cosumer
(function() {
  window.App || (window.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);


const userId = parseInt(document.getElementById("my-user-id").dataset["userId"])

App.cable.subscriptions.create({
  channel: 'NotificationsChannel'
}, {
  connected: () => {
    console.log('Connected to NotificationsChannel')
  },
  received: data => {
    console.log(data["message"]["user_id"])
    console.log(userId)
    if (data["message"]["user_id"] === userId) {
      console.log("TRIGGER MODAL")
      const acceptButton = document.getElementById('accept-button')
      acceptButton.style.display = "block"
      // const receiveCall = document.getElementById('receive-call')
      // receiveCall.dataset.toggle = 'modal'
      // receiveCall.dataset.target ='#calleeModal'
      // console.log(receiveCall)

      // const calleeModal = document.getElementById('calleeModal')
      // calleeModal.modal("show")

      console.log(`user with id: ${userId} needs to subscribe to chatroom ${data["message"]["chat_room_id"]}`)
    }
  }
})
