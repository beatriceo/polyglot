import ActionCable from 'actioncable'

// create App object with key cable == new cosumer
(function() {
  window.App || (window.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);

// find chatroom id
const chatroomId = document.getElementById('chatroom-hook').dataset["chatroomId"]
const userId = document.getElementById('current-user').innerText

// create subsciptions
App['chatroom' + chatroomId] = App.cable.subscriptions.create({
    channel: 'ChatRoomsChannel',
    room: chatroomId
  }, {
    connected: () => {},
    received: data => {
      if (data["chat_message"]) {
        const chatMessage = data["chat_message"]
        const messagesContainer = document.getElementById('messages-container')
        const message = document.createElement("p")
        message.innerText = `${chatMessage["time_stamp"]} ${chatMessage["user_info"]["name"]}: ${chatMessage["message"]}`
        messagesContainer.appendChild(message)
      } else if (data["translation"] && data["userId"] == userId) {
        if (data["input"] == 1) {
          document.getElementById('language-2-input').value = data["translation"].text
        } else {
          document.getElementById('language-1-input').value = data["translation"].text
        }
      } else {
        // console.log(data)
      }
      if (data.hangUp) {
        document.location.pathname = '/contacts'
      }
    },
    disconnected: () => {
      document.location.pathname = '/contacts'
    }
})

const hangUpIcon = document.querySelector('.fa-hand-paper')
hangUpIcon.addEventListener('click', event => {
  fetch(`/chat_rooms/${chatroomId}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').content
    }
  })
  document.location.pathname = '/contacts'
})

// Testing ActionCable
// const testBtn = document.getElementById('test-btn')
// testBtn.addEventListener('click', event => {
//   fetch(`/chat_rooms/${chatroomId}/cable_testing` , {
//     method: 'POST',
//     body: JSON.stringify({})
//   })
// })


const sendBtn = document.getElementById('send-btn')
sendBtn.addEventListener('click', event => {
  const chatInput = document.getElementById('chat-input')
  if (chatInput && chatInput.value != chatInput.value.match(/^\s*$/g)) {
    console.log(chatInput.value)
    fetch(`/chat_rooms/${chatroomId}/send_message` , {
      method: 'POST',
      body: JSON.stringify({message: chatInput.value}),
      headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
    })
  }
  chatInput.value = ""
})


