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
      let i = 0;
      for (const user of data) {
        const row = tbody.insertRow();
        row.setAttribute('id', 'userRow-' + i);
        const idCell = row.insertCell();
        idCell.textContent = user.id;
        const nameCell = row.insertCell();
        nameCell.setAttribute('name', 'name-' + i);
        nameCell.textContent = user.name;
        const birthdayCell = row.insertCell();
        birthdayCell.setAttribute('name', 'birthday-' + i);
        birthdayCell.textContent = new Date(user.birthday).toLocaleDateString('uk-UA');
        const cityCell = row.insertCell();
        cityCell.setAttribute('name', 'city-' + i);
        cityCell.textContent = user.city;
        const actionsCell = row.insertCell();
        actionsCell.setAttribute('name', 'actions-' + i);
        actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id = "Edit" onclick="editUser(${user.id})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button class="btn btn-info" id = "Delete" onclick="deleteUser(${user.id})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
        i++;
      }
      button.disabled = true;
      button.textContent = 'Cannot add users';

    })
};


function editUser(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    console.log(user);


    // use user data here
    document.getElementById("nameInput").value = user.name;
    document.getElementById("birthdayInput").value = user.birthday;
    document.getElementById("cityInput").value = user.city;
    // Change the text and show the popup
    document.getElementById("buttonModale").textContent = "Save user";
    document.getElementById("editModalUser").textContent = "Edit user";
    document.getElementById("popup").style.display = "block";
    let popup = document.getElementById("editUserModal");
    popup.classList.toggle("show");
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
}



function addUser(userId) {
  const nameInput = document.querySelector('#nameInput');
  const birthdayInput = document.querySelector('#birthdayInput');
  const cityInput = document.querySelector('#cityInput');
  const table = document.querySelector('#table');
  const row = table.insertRow();
  const idCell = row.insertCell();
  idCell.textContent = users.length + 1;
  const nameCell = row.insertCell();
  nameCell.textContent = nameInput.value;
  const birthdayCell = row.insertCell();
  birthdayCell.textContent = new Date(birthdayInput.value).toLocaleDateString('uk-UA');
  const cityCell = row.insertCell();
  cityCell.textContent = cityInput.value;
}
const addButton = document.querySelector('#buttonModale');
addButton.addEventListener('click', addUser);

function saveUser(userId) {
  const nameInput = document.querySelector('#nameInput');
  const birthdayInput = document.querySelector('#birthdayInput');
  const cityInput = document.querySelector('#cityInput');
  const table = document.querySelector('#table');
  const row = table.insertRow();
  const idCell = row.insertCell();
  idCell.textContent = userId;
  const nameCell = row.insertCell();
  nameCell.textContent = nameInput.value;
  const birthdayCell = row.insertCell();
  birthdayCell.textContent = new Date(birthdayInput.value).toLocaleDateString('uk-UA');
  const cityCell = row.insertCell();
  cityCell.textContent = cityInput.value;
}

const saveButton = document.querySelector('#buttonModale');
saveButton.addEventListener('click', function () {
  saveUser(users.length + 1);
});




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

