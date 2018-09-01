import "bootstrap";

import { triggerModalEvent } from "../components/modal.js";

triggerModalEvent();

const links = document.querySelector('links');
const linksList = document.querySelectorAll('.links div');

const getSiblings = function (elem) {
  const siblings = [];
  let sibling = elem.parentNode.firstChild;
  const skipMe = elem;
  for ( ; sibling; sibling = sibling.nextSibling )
    if ( sibling.nodeType == 1 && sibling != elem )
      siblings.push( sibling );
  return siblings;
}

linksList.forEach(link => {
  link.addEventListener('click', event => {
    // event.preventDefault()
    link.classList.add('active')
    const siblings = getSiblings(link)
    siblings.forEach(sibling => {
      sibling.classList.remove('active');
    })
  })
})
