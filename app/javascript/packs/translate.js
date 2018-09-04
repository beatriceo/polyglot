const languageForm1 = document.getElementById('lang-1')
const languageForm2 = document.getElementById('lang-2')
const chatroomId = document.getElementById('chatroom-hook').dataset["chatroomId"]

languageForm1.addEventListener('submit', event => {
  event.preventDefault()
  const original = document.getElementById('language-1').value
  const target = document.getElementById('language-2').value
  const text = document.getElementById('language-1-input').value

  fetch(`/chat_rooms/${chatroomId}/translate` , {
    method: 'POST',
    body: JSON.stringify({
      original,
      target,
      text,
      input: 1
    }),
    headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
  })
  // post request and change form 1
})

languageForm2.addEventListener('submit', event => {
  event.preventDefault()
  const original = document.getElementById('language-2').value
  const target = document.getElementById('language-1').value
  const text = document.getElementById('language-2-input').value
  // post request and change form 2

  fetch(`/chat_rooms/${chatroomId}/translate` , {
    method: 'POST',
    body: JSON.stringify({
      original: original,
      target: target,
      text: text,
      input: 2
    }),
    headers: { "content-type": "application/json", "X-CSRF-Token": document.querySelector('meta[name=csrf-token]').content }
  })
})
