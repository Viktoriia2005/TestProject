function loadUsers() {
  fetch('ListUsers.json')
    .then(response => response.json())
    .then(data => {
      const table = document.querySelector('#table');
      const tbody = table.querySelector('tbody');
      if (tbody.rows.length >= 4) {
        return;
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
    })
};

function editUsers() {
  // для редагування користувача
}

function deleteUsers() {
  // для видалення користувача
}

let table = document.getElementById("myTable");
let row = table.insertRow(-1);
let cell1 = row.insertCell(0);
let cell2 = row.insertCell(1);
let cell3 = row.insertCell(2);
cell1.innerHTML = document.getElementsByName("day")[0].value + "." + document.getElementsByName("month")[0].value + "." + document.getElementsByName("year")[0].value;
cell2.innerHTML = ".";
cell3.innerHTML = ".";

