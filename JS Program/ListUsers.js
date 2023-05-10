function loadUsers() {
  fetch('ListUsers.json')
    .then(response => response.json())
    .then(data => {
      const table = document.querySelector('#table');
      const tbody = table.querySelector('tbody');
      if (tbody.rows.length < 4) {
        const button = document.querySelector('#myButton');
        button.disabled = true;
        alert('Ви не можете додавати більше користувачів!');
      }
      for (const user of data) {
        const row = tbody.insertRow();
        const idCell = row.insertCell();
        idCell.textContent = user.id;
        const nameCell = row.insertCell();
        nameCell.textContent = `${user.firstName} ${user.lastName}`;
        const birthdayCell = row.insertCell();
        birthdayCell.textContent = new Date(user.birthday).toLocaleDateString('uk-UA');
        const cityCell = row.insertCell();
        cityCell.textContent = user.city;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = '<div class="edit-delet-text"><a title="Edit"><button class="btn btn-info" onclick="editUsers"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button class="btn btn-info" onclick="deleteUsers"><span class="material-symbols-outlined">delete</span></button></a></div>';
      }
    });
}


function editUsers() {
  // для редагування користувача
}

function deleteUsers() {
  // для видалення користувача
}

$(document).ready(function () {

  let userLang = navigator.language || navigator.userLanguage;

  let options = $.extend({},
    $.datepicker.regional[userLang], {
    dateFormat: "dd.mm.yy"
  }
  );

  $("#calendar").datepicker(options);
});

