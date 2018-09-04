import ActionCable from 'actioncable'

// create App object with key cable == new cosumer
(function() {
  window.App || (window.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);

// find chatroom id
const chatroomId = document.getElementById('chatroom-hook').dataset["chatroomId"]

// create subsciptions
App['chatroom' + chatroomId] = App.cable.subscriptions.create({
  channel: 'ChatRoomsChannel',
  room: chatroomId
}, {
  connected: () => {
  },
  received: data => {
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



