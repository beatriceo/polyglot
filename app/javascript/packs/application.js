import "bootstrap";

import { triggerModalEvent } from "../components/modal.js";

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

const triggerCalleeModalEvent = () => {
  $("#calleeModal").modal('show');
}

export { triggerCalleeModalEvent }
