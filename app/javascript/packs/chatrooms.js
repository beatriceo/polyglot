import ActionCable from 'actioncable'
// import { scrollLastMessageIntoView } from './chatrooms'
// create App object with key cable == new cosumer
(function() {
  window.App || (window.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);

// find chatroom id
const chatroomId = document.getElementById('chatroom-hook').dataset["chatroomId"]
const userId = document.getElementById('current-user').innerText
console.log(userId)

// create subsciptions
App['chatroom' + chatroomId] = App.cable.subscriptions.create({
    channel: 'ChatRoomsChannel',
    room: chatroomId
  }, {
    connected: () => {},
    received: data => {
      if (data["chat_message"] && data["chat_message"]["userId"] == userId) {
        const chatMessage = data["chat_message"]
        const message = `${chatMessage["message"]}`
        const messagesContainer = document.getElementById('messages-container')

        // Div Settings
        const messageDiv = document.createElement("div")
        messageDiv.classList.add("messageDiv")
        messageDiv.classList.add("right")

        // Photo Settings
        const photo = document.createElement("img")
        photo.src = chatMessage["photo_url"]
        photo.classList.add("img-circle")
        photo.classList.add("avatar-sm")
        photo.classList.add("margin-left")

        // Text Settings
        const messageElement = document.createElement("p")
        messageElement.classList.add("message")
        messageElement.classList.add("no-margin")
        messageElement.innerText = message

        // Add message and photo to div
        messageDiv.appendChild(photo)
        messageDiv.appendChild(messageElement)

        // Add message to container
        messagesContainer.appendChild(messageDiv)
        messagesContainer.scrollTop = div.scrollHeight

      } else if (data["chat_message"] && data["chat_message"]["userId"] != userId) {
        // const callerName = document.getElementById('caller-name')
        // callerName.innerText = data["chat_message"]["user_info"]
        // console.log(data["chat_message"]["user_info"]["name"])

        // const photo = data["chat_message"]["photo_url"]
        // photo.height = '20px'
        // photo.width = '20px'
        // const chatInfo = document.querySelector('chat-information')
        // chatInfo.insertBefore(photo, chatInfo.firstChild)

        const chatMessage = data["chat_message"]
        const target = document.getElementById('language-1').value
        const message = `${chatMessage["message"]}`

        fetch(`/chat_rooms/${chatroomId}/translate_message` , {
          method: 'POST',
          body: JSON.stringify({
            message: message,
            target: target,
            userId: userId,
            photo_url: chatMessage["photo_url"]
          }),
          headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
        })
        const messagesContainer = document.getElementById('messages-container')
        messagesContainer.scrollTop = div.scrollHeight
      } else if (data["translated_message"] && data["userId"] == userId) {
          const messagesContainer = document.getElementById('messages-container')

          const messageDiv = document.createElement("div")
          messageDiv.classList.add("messageDiv")

          const photo = document.createElement("img")
          photo.src = data["photo_url"]
          photo.classList.add("img-circle")
          photo.classList.add("avatar-sm")
          photo.classList.add("margin-right")

          const messageElement = document.createElement("p")
          messageElement.classList.add("message")
          messageElement.classList.add("no-margin")
          messageElement.innerText = data["translated_message"]
          messageElement.setAttribute('data-original', `${data["original_message"]}`)
          messageElement.setAttribute('data-translated', `${data["translated_message"]}`)

          messageDiv.appendChild(photo)
          messageDiv.appendChild(messageElement)

          messageDiv.addEventListener('mouseover', event => {
            messageElement.innerText = data["original_message"]
          })
          messageDiv.addEventListener('mouseout', event => {
            messageElement.innerText = data["translated_message"]
          })

          messagesContainer.appendChild(messageDiv)
          messagesContainer.scrollTop = div.scrollHeight
      } else {
        // console.log(data)
        const messagesContainer = document.getElementById('messages-container')
        messagesContainer.scrollTop = div.scrollHeight
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

// const originalBtn = document.getElementById('original-btn')
// originalBtn.addEventListener('click', event => {
//   originalBtn.classList.toggle('original')
//   const allMessages = document.querySelectorAll('.messageDiv:not(.right) > p')

//   if (originalBtn.classList.contains('original')) {
//     originalBtn.innerText = "Show Original"
//     allMessages.forEach(message => {
//       message.innerText = message.dataset.translated
//     })
//   } else {
//     originalBtn.innerText = "Show Translated"
//     allMessages.forEach(message => {
//       message.innerText = message.dataset.original
//     })
//   }
// })

const sendBtn = document.getElementById('send-btn')
sendBtn.addEventListener('click', event => {
  const chatInput = document.getElementById('chat-input')
  if (chatInput && chatInput.value != chatInput.value.match(/^\s*$/g)) {
    fetch(`/chat_rooms/${chatroomId}/send_message` , {
      method: 'POST',
      body: JSON.stringify({message: chatInput.value, userId: userId}),
      headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
    })
  }
  chatInput.value = ""
})


