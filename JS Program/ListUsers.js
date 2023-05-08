const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");
const cancelButton = document.querySelector(".cancel-button");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
cancelButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

function loadUsers() {
   fetch('ListUsers.json')
     .then(response => response.json())
     .then(data => console.log(data));
}
