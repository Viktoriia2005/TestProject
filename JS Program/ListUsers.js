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
  const city = parseInt(document.querySelector('#cityInput').value);

  // Create a new user
  const newUser = {
    name: name,
    birthday: birthday,
    city: city
  };

  // Send POST request to server to save user
  fetch('http://localhost:5000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser, null, 2)
  })
    .then(response => response.json())
    .then(data => {
      // Saved user successfully refreshes client-side table
      const tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];
      const newRow = tableRef.insertRow();

      const idCell = newRow.insertCell(0);
      const idText = document.createTextNode(data.id);
      idCell.appendChild(idText);

      const nameCell = newRow.insertCell(1);
      const nameText = document.createTextNode(data.name);
      nameCell.appendChild(nameText);

      const birthdayCell = newRow.insertCell(2);
      const birthdayText = document.createTextNode(data.birthday);
      birthdayCell.appendChild(birthdayText);

      const cityCell = newRow.insertCell(3);
      const cityText = document.createTextNode(data.city);
      cityCell.appendChild(cityText);

      // Clear input fields
      document.querySelector('#nameInput').value = '';
      document.querySelector('#birthdayInput').value = '';
      document.querySelector('#cityInput').value = '';

      // Successful saving message
      console.log('User saved successfully:', data);
    })
    .catch(error => {
      // User retention failed
      console.error('Error saving user:', error);
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
    const cityId = parseInt(cityInput.value, 10);

    // Send a separate request to get the city name by cityId
    fetch(`http://localhost:5000/cities`)
      .then(response => response.json())
      .then(cityData => {
        const cityName = cityData.find(city => city.id === cityId)?.name; // Get the name of the city based on cityId

        // Prepare the user data to be sent to the server
        const userData = {
          name: nameInput.value,
          birthday: birthdayInput.value,
          city: cityId,
          isAdmin: isAdminInput.checked
        };

        // Send the user data to the server using fetch
        fetch(`http://localhost:5000/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData, null, 2)
        })
          .then(response => response.json())
          .then(updatedData => {
            console.log(updatedData);
            // Update the table with the updated data
            nameCell.textContent = updatedData.name;
            birthdayCell.textContent = new Date(updatedData.birthday).toLocaleDateString('uk-UA');
            cityCell.textContent = cityName; // Use the city name
            // Hide the popup
            const modal = document.querySelector('#editUserModal');
            $(modal).modal('hide');
          })
          .catch(error => {
            console.error('Error:', error);
          });
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

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
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
