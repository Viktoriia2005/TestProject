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
        nameCell.setAttribute('name', 'userName');
        nameCell.textContent = user.name;
        const birthdayCell = row.insertCell();
        birthdayCell.setAttribute('name', 'userBirthday' );
        birthdayCell.textContent = new Date(user.birthday).toLocaleDateString('uk-UA');
        const cityCell = row.insertCell();
        cityCell.setAttribute('name', 'userCity' );
        cityCell.textContent = user.city;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id = "Edit" onclick="showEditUser(${user.id})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button class="btn btn-info" id = "Delete" onclick="deleteUser(${user.id})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
        i++;
      }

      button.disabled = true;
      button.textContent = 'Cannot add users';

      const addButton = document.querySelector('#buttonModale');
      addButton.removeEventListener('click', addUser);
      addButton.removeEventListener('click', saveUser);
      addButton.addEventListener('click', addUser);
    })
};

function getMaxId() {
  let maxId = 0;
  for (const user of users) {
    if (user.id > maxId) {
      maxId = user.id;
    }
  }
  return maxId;
}

function addUser() {
  const name = document.querySelector('#nameInput').value;
  const birthday = document.querySelector('#birthdayInput').value;
  const city = document.querySelector('#cityInput').value;
  const tmp = document.getElementById("buttonModale");
  console.log(tmp);
  const maxId = getMaxId();
  const id = maxId + 1;

  const tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];
  const newRow = tableRef.insertRow();
  newRow.id = 'user' + id;

  const newCell = newRow.insertCell(0);
  const newText = document.createTextNode(id);
  newCell.appendChild(newText);

  const newCell2 = newRow.insertCell(1);
  newCell2.setAttribute('name', 'userName');
  const newText2 = document.createTextNode(name);
  newCell2.appendChild(newText2);

  const newCell3 = newRow.insertCell(2);
  newCell3.setAttribute('name', 'userBirthday' );
  const newText3 = document.createTextNode(birthday);
  newCell3.appendChild(newText3);

  const newCell4 = newRow.insertCell(3);
  newCell4.setAttribute('name', 'userCity' );
  const newText4 = document.createTextNode(city);
  newCell4.appendChild(newText4);

  // Update maxId value
  const updatedMaxId = maxId + 1;

  // Update users with a new user
  const newUser = { id: updatedMaxId, name, birthday, city };
  users.push(newUser);

  // Reset Input Field Values
  document.querySelector('#nameInput').value = '';
  document.querySelector('#birthdayInput').value = '';
  document.querySelector('#cityInput').value = '';

  // Update row id of table
  newRow.setAttribute('id', 'userRow-' + updatedMaxId);

  // Add action buttons for a new user
  const actionsCell = newRow.insertCell();
  actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id="Edit" onclick="showEditUser(${updatedMaxId})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button class="btn btn-info" id="Delete" onclick="deleteUser(${updatedMaxId})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
  const modal = document.querySelector('#editUserModal');
  $(modal).modal('hide');
}

function showEditUser(userId) {
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
    let saveButton = document.querySelector('#buttonModale');
    const newSaveButton = saveButton.cloneNode(true);
    saveButton.replaceWith(newSaveButton);
    newSaveButton.addEventListener('click', () => saveUser(userId));
    let popup = document.getElementById("editUserModal");
    popup.classList.toggle("show");
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
}

function saveUser(userId) {
  const nameInput = document.querySelector('#nameInput');
  const birthdayInput = document.querySelector('#birthdayInput');
  const cityInput = document.querySelector('#cityInput');
  const table = document.querySelector('#table');
  const row = table.rows[userId];
  if (row) {
    const nameCell = row.querySelector(`td[name="userName"]`);
    nameCell.textContent = nameInput.value;
    const birthdayCell = row.querySelector(`td[name="userBirthday"]`);
    birthdayCell.textContent = new Date(birthdayInput.value).toLocaleDateString('uk-UA');
    const cityCell = row.querySelector(`td[name="userCity"]`);
    cityCell.textContent = cityInput.value;
    const user = users.find(u => u.id === userId);
    user.name = nameInput.value;
    user.birthday = birthdayInput.value;
    user.city = cityInput.value;
    console.log(users);
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
  const modal = document.querySelector('#editUserModal');
  $(modal).modal('hide');

}

function showAddUserPopup() {
  document.querySelector('#nameInput').value = '';
  document.querySelector('#birthdayInput').value = '';
  document.querySelector('#cityInput').value = '';
  let addButton = document.querySelector('#buttonModale');
  const newAddButton = addButton.cloneNode(true);
  addButton.replaceWith(newAddButton);
  newAddButton.addEventListener('click', () => addUser());
  document.getElementById("buttonModale").textContent = "Add user";
  document.getElementById("editModalUser").textContent = "Add new user";
  let popup = document.getElementById("editUserModal");
  popup.classList.toggle("show");
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

