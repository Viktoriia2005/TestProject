let users;
let cities;

let dataLoaded = false;

function loadUsers() {
  const button = document.querySelector('#myButton');
  button.disabled = true;
  button.innerHTML = '<span class="material-symbols-outlined">autorenew</span>';

  if (!dataLoaded) {
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
          const isAdminCell = row.insertCell();
          isAdminCell.setAttribute('name', 'userIsAdmin');
          isAdminCell.textContent = user.isAdmin ? 'true' : 'false';
          const actionsCell = row.insertCell();
          actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id="Edit" onclick="showEditUserPopup(${user.id})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="Delete" onclick="showDeleteUserPopup(${user.id})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
        }

        dataLoaded = true;

        button.disabled = true;
        button.innerHTML = '<span class="material-symbols-outlined">autorenew</span>';

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
}

function showAddUserPopup() {
  document.querySelector('#nameInput').value = '';
  document.querySelector('#birthdayInput').value = '';
  document.querySelector('#cityInput').value = '';
  let addButton = document.querySelector('#buttonModale');
  const newAddButton = addButton.cloneNode(true);
  addButton.replaceWith(newAddButton);
  newAddButton.addEventListener('click', () => addUser());
  document.getElementById("buttonModale").innerHTML = '<span class="material-symbols-outlined">add</span>';
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

function formatDate(dateString) {
  const [day, month, year] = dateString.split('.');
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

function addUser() {
  const name = document.querySelector('#nameInput').value;
  const birthday = document.querySelector('#birthdayInput').value;
  const city = parseInt(document.querySelector('#cityInput').value);

  // Create a new user
  const formattedBirthday = formatDate(birthday);
  const newUser = {
    name: name,
    birthday: formattedBirthday,
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
      const birthdayText = document.createTextNode(formatDate(data.birthday)); // Format the birthday
      birthdayCell.appendChild(birthdayText);

      const cityCell = newRow.insertCell(3);
      const cityText = document.createTextNode(data.city);
      cityCell.appendChild(cityText);

      const isAdminCell = newRow.insertCell(4);
      const isAdminText = document.createTextNode(data.isAdmin ? 'true' : 'false');
      isAdminCell.appendChild(isAdminText);

      const actionsCell = newRow.insertCell(5);
      actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id="Edit" onclick="showEditUserPopup(${data.id})"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="Delete" onclick="showDeleteUserPopup(${data.id})"><span class="material-symbols-outlined">delete</span></button></a></div>`;

      // Fetch the newly created user
      fetch(`http://localhost:5000/users/${data.id}`)
        .then(response => response.json())
        .then(user => {
          // Display the user's information
          console.log('New user:', user);
        })
        .catch(error => {
          console.error('Error fetching new user:', error);
        });

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
        document.getElementById("buttonModale").innerHTML = '<span class="material-symbols-outlined">save</span>';
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

function formatDate(dateString) {
  const [day, month, year] = dateString.split('.');
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'numeric', year: 'numeric' });
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
    birthdayCell.textContent = formatDate(birthdayInput.value); // Format the birthday
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
            birthdayCell.textContent = formatDate(updatedData.birthday); // Format the birthday
            cityCell.textContent = cityName; // Use the city name

            const isAdminCell = row.querySelector(`td[name="userIsAdmin"]`);
            isAdminCell.textContent = updatedData.isAdmin ? 'true' : 'false';

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

// const saveButtonUser = document.getElementById('saveUser');
// const newSaveUser = saveButtonUser.cloneNode(true);
// saveButtonUser.replaceWith(newSaveUser);
// newSaveUser.addEventListener('click', downloadData);

// function downloadData() {
//   const data = {
//     users: users,
//     cities: cities
//   };

//   const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
//   const dlAnchorElem = document.getElementById('downloadUsersLink');
//   dlAnchorElem.setAttribute("href", dataStr);
//   dlAnchorElem.setAttribute("download", "SiteData.json");
//   dlAnchorElem.click();
// }

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
});