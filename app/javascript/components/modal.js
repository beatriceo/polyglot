const triggerModalEvent = () => {
  const btn = document.getElementById("modalTrigger");
  const modal = document.getElementById("myModal");

  if (btn) {
    btn.addEventListener('click', function(event) {
      $('#myModal').modal('show');
    });
  }
}

export { triggerModalEvent }
