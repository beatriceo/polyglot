
const triggerModalEvent = () => {
  const btn = document.getElementById("modalTrigger");
  const modal = document.getElementById("myModal");

  btn.addEventListener('click', function(event) {
    $('#myModal').modal('show');
  });
}

export { triggerModalEvent }
