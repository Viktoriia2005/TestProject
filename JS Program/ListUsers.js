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
        const newRow = tbody.insertRow();
        let newCell = newRow.insertCell();
        newCell.textContent = user.id;
        newCell = newRow.insertCell();
        newCell.textContent = `${user.firstName} ${user.lastName}`;
        newCell = newRow.insertCell();
        newCell.textContent = new Date(user.birthday).toLocaleDateString('uk-UA');
        newCell = newRow.insertCell();
        newCell.textContent = user.city;
        newCell = newRow.insertCell();
        newCell.innerHTML = '<div class="edit-delet-text"><a title="Edit"><button class="btn btn-info" onclick="editUsers"><span class="material-symbols-outlined">edit</span></a></button><a title="Delete"><button class="btn btn-info" onclick="deleteUsers"><span class="material-symbols-outlined">delete</span></button></a></div>';
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
