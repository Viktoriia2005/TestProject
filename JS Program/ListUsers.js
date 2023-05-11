let users;

function loadUsers() {
  const button = document.querySelector('#myButton');
  button.disabled = true;
  button.textContent = 'Loading...';
  fetch('ListUsers.json')
    .then(response => response.json())
    .then(data => {
      users = data;
      const table = document.querySelector('#table');
      const tbody = table.querySelector('tbody');
      for (const user of data) {
        const row = tbody.insertRow();
        const idCell = row.insertCell();
        idCell.textContent = user.id;
        const nameCell = row.insertCell();
        nameCell.textContent = user.name;
        const birthdayCell = row.insertCell();
        birthdayCell.textContent = new Date(user.birthday).toLocaleDateString('uk-UA');
        const cityCell = row.insertCell();
        cityCell.textContent = user.city;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id = "Edit" onclick="editUser(${user.id})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button class="btn btn-info" id = "Delete" onclick="deleteUser(${user.id})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
      }
      button.disabled = true;
      button.textContent = 'Cannot add users';
    })
};


function editUser(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    showEditPopup(user);
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
}

function showEditPopup(user) {
  let popup = document.getElementById("editUserModal");
  popup.classList.toggle("show");
  const button = document.querySelector('#buttonModale');
  button.textContent = 'Save user';
  const title = document.querySelector('#editModalUser');
  title.textContent = 'Edit user';

  // use user data here
  document.getElementById("nameInput").value = user.name;
  document.getElementById("birthdayInput").value = user.birthday;
  document.getElementById("cityInput").value = user.city;
  }

function deleteUser(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    console.log(user);
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
}

$(document).ready(function () {

  let userLang = navigator.language || navigator.userLanguage;

  let options = $.extend({},
    $.datepicker.regional[userLang], {
    dateFormat: "dd.mm.yy"
  }
  );

  $("#birthdayInput").datepicker(options);
});

