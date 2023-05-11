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


function editUser() {
  // Get the values of each input field
  let name = document.getElementById("nameInput").value;
  let birthday = document.getElementById("birthdayInput").value;
  let city = document.getElementById("cityInput").value;

  // Send the data to the server using AJAX
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/edit-user");
  xhr.setRequestHeader("Content-Type", "ListUsers.json");
  xhr.send(JSON.stringify({ name: name, birthday: birthday, city: city }));

  // Change the text and show the popup
  document.getElementById("buttonModale").textContent = "Save user";
  document.getElementById("editModalUser").textContent = "Edit user";
  document.getElementById("popup").style.display = "block";
}


function showEditPopup(user) {
  let popup = document.getElementById("editUserModal");
  popup.classList.toggle("show");

  // use user data here
  document.getElementById("nameInput").value = user.name;
  document.getElementById("birthdayInput").value = user.birthday;
  document.getElementById("cityInput").value = user.city;
}
function addUser() {
  // Get the values of each input field
  let name = document.getElementById("nameInput").value;
  let birthday = document.getElementById("birthdayInput").value;
  let city = document.getElementById("cityInput").value;

  // Send the data to the server using AJAX
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/add-user");
  xhr.setRequestHeader("Content-Type", "ListUsers.json");
  xhr.send(JSON.stringify({ name: name, birthday: birthday, city: city }));

  // Clear the input fields
  document.getElementById("nameInput").value = "";
  document.getElementById("birthdayInput").value = "";
  document.getElementById("cityInput").value = "";

  // Change the text and show the popup
  document.getElementById("buttonModale").textContent = "Add user";
  document.getElementById("editModalUser").textContent = "New user";
  document.getElementById("popup").style.display = "block";
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

