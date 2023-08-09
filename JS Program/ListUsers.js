let users;
let cities;


function loadUsers() {
  const button = document.querySelector('#myButton');
  button.disabled = true;
  button.innerHTML = '<span class="material-symbols-outlined">refresh</span>';

  Promise.all([
    fetch('http://localhost:5000/users').then(response => response.json()),
    fetch('http://localhost:5000/cities').then(response => response.json())
  ])
    .then(([userData, cityData]) => {
      // Update user and city data
      users = userData;
      cities = cityData;
      cities.sort((a, b) => a.name.localeCompare(b.name));
      const table = document.querySelector('#table');
      const tbody = table.querySelector('tbody');
      // Clear table before adding updated data
      tbody.innerHTML = '';
      for (const user of users) {
        // Add a row with a user to a table
        const row = tbody.insertRow();
        addNewUserRow(row, user.id, user.name, user.birthday, user.city, user.isAdmin);
      }

      dataLoaded = true;

      button.disabled = false;
      button.innerHTML = '<span class="material-symbols-outlined">refresh</span>';
    });
}

function addNewUserRow(row, userId, userName, userBirthday, userCity, userIsAdmin) {
  row.setAttribute('id', 'userRow-' + userId);
  // Add cells with user data
  const idCell = row.insertCell();
  idCell.textContent = userId;
  const nameCell = row.insertCell();
  nameCell.setAttribute('name', 'userName');
  nameCell.textContent = userName;
  const birthdayCell = row.insertCell();
  birthdayCell.setAttribute('name', 'userBirthday');

  // Convert date to format dd.mm.yyyy
  const formattedBirthday = formatDate(new Date(userBirthday));

  birthdayCell.textContent = formattedBirthday;
  const cityCell = row.insertCell();
  cityCell.setAttribute('name', 'userCity');
  let cityData = cities.find(city => city.id === userCity);
  cityCell.textContent = cityData ? cityData.name : '';
  const isAdminCell = row.insertCell();
  isAdminCell.setAttribute('name', 'userIsAdmin');
  isAdminCell.innerHTML = userIsAdmin ? '<span class="material-symbols-outlined">done</span>' : '';
  const actionsCell = row.insertCell();
  actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info"` +
    ` id="Edit" onclick="showEditUserPopup(${userId})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete">` +
    `<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="Delete" onclick="showDeleteUserPopup(${userId})">` +
    `<span class="material-symbols-outlined">delete</span></button></a></div>`;
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

  // Fetch city data from the server and populate the cityInput dropdown
  fetch(`http://localhost:5000/cities`)
    .then(response => response.json())
    .then(cityData => {
      const cityInput = document.getElementById("cityInput");
      cityData.forEach(city => {
        const option = document.createElement("option");
        option.value = city.id;
        option.textContent = city.name;
        cityInput.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
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

function getIsoDateString(dateVal) {
  let isoDate = '';
  if (dateVal) {
    const day = dateVal.getDate();
    const month = dateVal.getMonth() + 1; // Month is zero-based, so add 1
    const year = dateVal.getFullYear();
    isoDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
  return isoDate;
}

function addUser() {
  const name = document.querySelector('#nameInput').value;
  const jsDate = $('#birthdayInput').datepicker('getDate');
  const birthday = getIsoDateString(jsDate);

  const city = parseInt(document.querySelector('#cityInput').value, 10);

  // Create a new user
  const newUser = {
    name: name,
    birthday: birthday,
    city: city
  };

  // Convert user data to JSON
  const jsonData = JSON.stringify(newUser, null, 2);

  // Send POST request to server to save user
  fetch('http://localhost:5000/users', {
    method: 'POST',
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(newUser => {
      // Використовуйте newUser для оновлення таблиці
      const tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];
      const newRow = tableRef.insertRow();

      addNewUserRow(newRow, newUser.id, newUser.name, birthday, city, newUser.isAdmin);

      getUsers()

      clearInputFields();

      // Successful saving message
      console.log('User saved successfully:', newUser);
    })
    .catch(error => {
      // User retention failed
      console.error('Error saving user:', error);
    });
}

function clearInputFields() {
  // Clear input fields
  document.querySelector('#nameInput').value = '';
  document.querySelector('#birthdayInput').value = '';
  document.querySelector('#cityInput').value = '';
}

// Add this feature to get the list of users and update the table
function getUsers() {
  fetch('http://localhost:5000/users')
    .then(response => response.json())
    .then(users => {
      const tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];
      tableRef.innerHTML = ''; // Clear previous data from table

      users.forEach(user => {
        const newRow = tableRef.insertRow();
        addNewUserRow(newRow, user.id, user.name, user.birthday, user.city, user.isAdmin);
      });
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
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

        // Format birthday to "DD.MM.YYYY" format
        const birthdayParts = data.birthday.split('-');
        const year = birthdayParts[0];
        const month = birthdayParts[1];
        const day = birthdayParts[2];
        const formattedBirthday = `${day}.${month}.${year}`;
        document.getElementById("birthdayInput").value = formattedBirthday;

        document.getElementById("isAdminInput").checked = data.isAdmin;

        // Show the popup
        document.getElementById("buttonModale").textContent = "Save user";
        document.getElementById("editModalUser").textContent = "Edit user";
        document.getElementById("popup").style.display = "block";

        // Replace save button with a cloned button
        let saveButton = document.querySelector('#buttonModale');
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.replaceWith(newSaveButton);

        let popup = document.getElementById("editUserModal");
        popup.classList.toggle("show");

        // Fetch city data from the server and populate the cityInput dropdown
        fetch(`http://localhost:5000/cities`)
          .then(response => response.json())
          .then(cityData => {
            const cityInput = document.getElementById("cityInput");
            cityData.forEach(city => {
              const option = document.createElement("option");
              option.value = city.id;
              option.textContent = city.name;
              cityInput.appendChild(option);
            });
            cityInput.value = data.city;

            newSaveButton.addEventListener('click', () => saveUser(userId, cityData)); // Pass cityData as an argument
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
  }
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
}


function saveUser(userId, cityData) {
  const nameInput = document.querySelector('#nameInput');
  const jsDate = $('#birthdayInput').datepicker('getDate');
  const birthday = getIsoDateString(jsDate);
  const cityInput = document.querySelector('#cityInput');
  const isAdminInput = document.querySelector('#isAdminInput');
  const table = document.querySelector('#table');
  const row = table.rows[userId];
  if (row) {
    const nameCell = row.querySelector(`td[name="userName"]`);
    nameCell.textContent = nameInput.value;
    const birthdayCell = row.querySelector(`td[name="userBirthday"]`);
    birthdayCell.textContent = formatDate(jsDate);
    const cityCell = row.querySelector(`td[name="userCity"]`);
    const cityId = parseInt(cityInput.value, 10);

    const cityName = cityData.find(city => city.id === cityId)?.name;

    const userData = {
      name: nameInput.value,
      birthday: birthday,
      city: cityId,
      isAdmin: isAdminInput.checked
    };

    fetch(`http://localhost:5000/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(updatedData => {
        console.log(updatedData);
        nameCell.textContent = updatedData.name;
        birthdayCell.textContent = formatDate(new Date(updatedData.birthday));
        cityCell.textContent = cityName;

        const isAdminCell = row.querySelector(`td[name="userIsAdmin"]`);
        isAdminCell.innerHTML = updatedData.isAdmin ? '<span class="material-symbols-outlined">done</span>' : '';

        const modal = document.querySelector('#editUserModal');
        $(modal).modal('hide');

        clearInputFields();

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

function showDeleteUserPopup(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    console.log(user);

    const modalWindow = document.querySelector('#staticBackdrop');
    const modalBody = modalWindow.querySelector('.modal-body');
    modalBody.innerHTML = `<p>Do you really want to delete the ${user.name}?</p>`;

    const deleteButton = document.querySelector('#popupDelete');
    deleteButton.addEventListener('click', () => {
      deleteUser(userId);
    });

    const popup = document.getElementById('staticBackdrop');
    popup.classList.toggle('show');

    const link = document.createElement('a');
    link.href = `http://localhost:5000/users/${userId}`;
    modalBody.appendChild(link);
  } else {
    console.log(`Can not find user with id = ${userId}`);
  }
}

function deleteUser(userId) {
  fetch(`http://localhost:5000/users/${userId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        console.log(`User with id = ${userId} was deleted`);
        const rowId = `userRow-${userId}`;
        const row = document.getElementById(rowId);
        row.remove();
      } else {
        console.log(`Error deleting user with id = ${userId}`);
      }
    })
    .catch(error => {
      console.log(`Error deleting user with id = ${userId}: ${error}`);
    });
}

$(document).ready(function () {
  let userLang = navigator.language || navigator.userLanguage;
  let langCode = userLang.toLowerCase();

  if (langCode === 'uk' || langCode === 'uk-ua') {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/i18n/datepicker-uk.js", function () {
      $("#birthdayInput").datepicker({
        dateFormat: "dd.mm.yy",
        regional: "uk"
      });
    });
  } else {
    $("#birthdayInput").datepicker({
      dateFormat: "dd.mm.yy"
    });
  }

  loadUsers();
});

// document.addEventListener("DOMContentLoaded", function () {
//   const errorButton = document.getElementById("showErrorButton");
//   const errorMessage = "There was an error in the code."; // Повідомлення про помилку

//   errorButton.addEventListener("click", function () {
//     const modalTitle = document.getElementById("staticBackdropLabel");
//     const modalBody = document.querySelector("#staticBackdrop .modal-body p");

//     modalTitle.textContent = "Error";
//     modalBody.textContent = errorMessage;

//     const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
//     modal.show();
//   });
// });