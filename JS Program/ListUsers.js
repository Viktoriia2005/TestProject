let users;
let cities;

function loadUsers() {
  const button = document.querySelector('#myButton');
  button.disabled = true;
  button.textContent = 'Loading...';
  Promise.all([
    fetch('http://localhost:5000/users').then(response => response.json()),
    fetch('http://localhost:5000/cities').then(response => response.json())
  ])
    .then(([userData, cityData]) => {
       users = userData;
       cities = cityData;
      cities.sort((a, b) => a.name.localeCompare(b.name));
      const table = document.querySelector('#table');
      const tbody = table.querySelector('tbody');
      for (const user of users) {
        const row = tbody.insertRow();
        row.setAttribute('id', 'userRow-' + user.id);
        const idCell = row.insertCell();
        idCell.textContent = user.id;
        const nameCell = row.insertCell();
        nameCell.setAttribute('name', 'userName');
        nameCell.textContent = user.name;
        const birthdayCell = row.insertCell();
        birthdayCell.setAttribute('name', 'userBirthday');
        birthdayCell.textContent = new Date(user.birthday).toLocaleDateString('uk-UA');
        const cityCell = row.insertCell();
        cityCell.setAttribute('name', 'userCity');
        let cityData = cities.find(city => city.id === user.city);
        cityCell.textContent = cityData ? cityData.name : '';
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id="Edit" onclick="showEditUserPopup(${user.id})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="Delete" onclick="showDeleteUserPopup(${user.id})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
      }

      button.disabled = true;
      button.textContent = 'Cannot load users';

      const addButton = document.querySelector('#buttonModale');
      addButton.removeEventListener('click', addUser);
      addButton.removeEventListener('click', saveUser);
      addButton.addEventListener('click', addUser);

      let select = document.getElementById('cityInput');

      cities.forEach(city => {
        let option = document.createElement('option');
        option.value = city.id;
        option.text = city.name;

        select.appendChild(option);
      });
    });
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
  newCell3.setAttribute('name', 'userBirthday');
  const newText3 = document.createTextNode(birthday);
  newCell3.appendChild(newText3);

  const newCell4 = newRow.insertCell(3);
  newCell4.setAttribute('name', 'userCity');
  const cityId = Number(city);
  const cityData = cities.find(city => city.id === cityId);
  const newText4 = document.createTextNode(cityData.name);
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
  actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id="Edit" onclick="showEditUserPopup(${updatedMaxId})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="Delete" onclick="showDeleteUserPopup(${updatedMaxId})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
  const modal = document.querySelector('#editUserModal');
  $(modal).modal('hide');
}

function showEditUserPopup(userId) {
  let user = users.find(u => u.id === userId);
  if (user) {
    // Fetch user data from the server
    fetch(`http://localhost:5000/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // use user data here
        document.getElementById("nameInput").value = data.name;
        document.getElementById("birthdayInput").value = data.birthday;
        document.getElementById("cityInput").value = data.city;
        document.getElementById("isAdminInput").checked = data.isAdmin;

        // Show the popup
        document.getElementById("buttonModale").textContent = "Save user";
        document.getElementById("editModalUser").textContent = "Edit user";
        document.getElementById("popup").style.display = "block";

        // Replace save button with a cloned button
        let saveButton = document.querySelector('#buttonModale');
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.replaceWith(newSaveButton);
        newSaveButton.addEventListener('click', () => saveUser(userId));

        let popup = document.getElementById("editUserModal");
        popup.classList.toggle("show");
      });
  }
}


function saveUser(userId) {
  const nameInput = document.querySelector('#nameInput');
  const birthdayInput = document.querySelector('#birthdayInput');
  const cityInput = document.querySelector('#cityInput');
  const isAdminInput = document.querySelector('#isAdminInput');
  const table = document.querySelector('#table');
  const row = table.rows[userId];
  if (row) {
    const nameCell = row.querySelector(`td[name="userName"]`);
    nameCell.textContent = nameInput.value;
    const birthdayCell = row.querySelector(`td[name="userBirthday"]`);
    birthdayCell.textContent = new Date(birthdayInput.value).toLocaleDateString('uk-UA');
    const cityCell = row.querySelector(`td[name="userCity"]`);
    const cityId = parseInt(cityInput.value);
    let city = null;
    // Fetch city data from the server
    fetch(`http://localhost:5000/cities`)
      .then(response => response.json())
      .then(data => {
        city = data.find(c => c.id === cityId);
        if (city) {
          cityCell.textContent = city.name;
        } else {
          cityCell.textContent = '';
        }
      })
      .catch(error => console.log(error));

    if (city) {
      cityCell.textContent = city.name;
    } else {
      cityCell.textContent = '';
    }
    let user = users.find(u => u.id === userId);
    user.name = nameInput.value;
    user.birthday = birthdayInput.value;
    user.city = cityInput.value;
    user.isAdmin = isAdminInput.checked;
    console.log(users);
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
  const modal = document.querySelector('#editUserModal');
  $(modal).modal('hide');
}

function showDeleteUserPopup(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    console.log(user);

    const modalWindow = document.querySelector('#staticBackdrop');
    const modalBody = modalWindow.querySelector('.modal-body');
    modalBody.innerHTML = `<p>Do you really want to delete the ${user.name}?</p>`;

    let deleteButton = document.querySelector('#popupDelete');
    const newDeleteButton = deleteButton.cloneNode(true);
    deleteButton.replaceWith(newDeleteButton);
    newDeleteButton.addEventListener('click', () => deleteUser(userId));

    let popup = document.getElementById("staticBackdrop");
    popup.classList.toggle("show");

    const link = document.createElement('a');
    link.href = `http://localhost:5000/users/${userId}`;
    link.textContent = 'User details';
    modalBody.appendChild(link);
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
}

function deleteUser(userId) {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    console.log(`User with id = ${userId} was deleted`);
    const rowId = `userRow-${userId}`;
    const row = document.getElementById(rowId);
    row.remove();
  }
  else {
    console.log(`Can not find user with id = ${userId}`);
  }
}

const saveButtonUser = document.getElementById('saveUser');
const newSaveUser = saveButtonUser.cloneNode(true);
saveButtonUser.replaceWith(newSaveUser);
newSaveUser.addEventListener('click', downloadData);

function downloadData() {
  const data = {
    users: users,
    cities: cities
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  const dlAnchorElem = document.getElementById('downloadUsersLink');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "SiteData.json");
  dlAnchorElem.click();
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
