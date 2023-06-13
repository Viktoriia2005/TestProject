const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users;
let cities;

function loadUsers(req, res) {
  fs.readFile('SiteData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      users = jsonData.users;
      cities = jsonData.cities;
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
        actionsCell.innerHTML = `<div class="edit-delet-text"><a title="Edit"><button data-bs-toggle="modal" data-bs-target="#editUserModal" class="btn btn-info" id="Edit" onclick="showEditUserPopup(${user.id})"><span class="material-symbols-outlined">edit</span></button></a><a title="Delete"><button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="Delete" onclick="showDeleteUserPopup(${user.id})"><span class="material-symbols-outlined">delete</span></button></a></div>`;
      }

      const button = document.querySelector('#buttonModale');
      button.disabled = true;
      button.textContent = 'Cannot add users';

      const addButton = document.querySelector('#buttonModale');
      addButton.removeEventListener('click', addUser);
      addButton.removeEventListener('click', saveUser);
      addButton.addEventListener('click', addUser);

      let select = document.getElementById('cityInput');
      select.innerHTML = ''; // Очистити вміст select перед додаванням опцій

      cities.forEach(city => {
        let option = document.createElement('option');
        option.value = city.id;
        option.text = city.name;

        select.appendChild(option);
      });

      // Надіслати успішну відповідь на завантаження даних
      res.status(200).send('Data loaded successfully');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).send('Internal Server Error');
    }
  });
}

app.post("/users", function (req, res) {
  const name = req.body.name;
  const birthday = req.body.birthday;
  const city = req.body.city;

  function getMaxId() {
    let maxId = 0;
    for (const user of users) {
      if (user.id > maxId) {
        maxId = user.id;
      }
    }
    return maxId;
  }

  const maxId = getMaxId();
  const id = maxId + 1;

  const newUser = { id, name, birthday, city };
  users.push(newUser);

  res.status(200).send("User added successfully");
});

function showEditUserPopup(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    console.log(user);

    // use user data here
    document.getElementById("nameInput").value = user.name;
    document.getElementById("birthdayInput").value = user.birthday;
    document.getElementById("cityInput").value = user.city;
    document.getElementById("isAdminInput").checked = user.isAdmin;

    // Change the text and show the popup
    document.getElementById("buttonModale").textContent = "Save user";
    document.getElementById("editModalUser").textContent = "Edit user";
    document.getElementById("popup").style.display = "block";
    document.getElementById("cityInput").value = user.city;
    document.getElementById("isAdminInput").value = user.isAdmin;
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

// PUT update user
app.put("/users/:id", function (req, res) {
  const userId = parseInt(req.params.id);
  const name = req.body.name;
  const birthday = req.body.birthday;
  const city = req.body.city;
  const isAdmin = req.body.isAdmin;

  function updateUser(userId, name, birthday, city, isAdmin) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.name = name;
      user.birthday = birthday;
      user.city = city;
      user.isAdmin = isAdmin;
      return true;
    }
    return false;
  }

  const isUpdated = updateUser(userId, name, birthday, city, isAdmin);
  if (isUpdated) {
    res.status(200).send("User updated successfully");
  } else {
    res.status(404).send("User not found");
  }
});



// DELETE user
app.delete("/users/:id", function (req, res) {
  const userId = parseInt(req.params.id);

  function deleteUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      return true;
    }
    return false;
  }

  const isDeleted = deleteUser(userId);
  if (isDeleted) {
    res.status(200).send("User deleted successfully");
  } else {
    res.status(404).send("User not found");
  }
});


$(document).ready(function () {

  let userLang = navigator.language || navigator.userLanguage;

  let options = $.extend({},
    $.datepicker.regional[userLang], {
    dateFormat: "dd.mm.yy"
  }
  );

  $("#birthdayInput").datepicker(options);
});
