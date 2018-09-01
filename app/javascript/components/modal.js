const triggerModalEvent = () => {

  const buttons = document.querySelectorAll(".modalTrigger");

  buttons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', function(event) {
        const btnId = btn.getAttribute('data-user-id')
        $("#myModal"+`${btnId}`).modal('show');
      });
    }
  })
}

export { triggerModalEvent }
