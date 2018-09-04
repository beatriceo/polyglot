import "bootstrap";
import ActionCable from 'actioncable'

import { triggerModalEvent } from "../components/modal.js";

import { loadDynamicBannerText } from '../components/banner';
loadDynamicBannerText();

triggerModalEvent();

const settingsPage = document.getElementById('settings-page');
const contactsPage = document.getElementById('contacts-page');

const getSiblings = (element) => {
  const siblings = [];
  let sibling = element.parentNode.firstChild;
  const skipMe = element;
  for ( ; sibling; sibling = sibling.nextSibling )
    if ( sibling.nodeType == 1 && sibling != element )
      siblings.push( sibling );
  return siblings;
}

const removeActiveClass = (element) => {
  const siblings = getSiblings(element);
  siblings.forEach(sibling => {
    sibling.classList.remove('active');
  });
}

if (settingsPage) {
  const settings = document.getElementById('settings')
  settings.classList.add('active');
  removeActiveClass(settings);
}

if (contactsPage) {
  const contacts = document.getElementById('contacts')
  contacts.classList.add('active');
  removeActiveClass(contacts);
}

// const triggerCalleeModalEvent = () => {
//   $("#calleeModal").modal('show');
// }

// export { triggerCalleeModalEvent }
const triggerCalleeModalEvent = () => {
  $("#calleeModal").modal('show');
}

// create App object with key cable == new consumer
(function() {
  window.App || (window.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);


const userIdElement = document.getElementById("my-user-id")
let userId = null
if (userIdElement) {
  userId = parseInt(document.getElementById("my-user-id").dataset["userId"])
}

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

if (acceptButton) {
  acceptButton.addEventListener('click', event => {
    document.getElementById('chat-room-id').value = chatRoomId
  })
}
