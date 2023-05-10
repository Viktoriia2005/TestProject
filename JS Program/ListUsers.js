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
        newCell.textContent = user.birthday;
        newCell = newRow.insertCell();
        newCell.textContent = user.city;
        newCell = newRow.insertCell();
        newCell.innerHTML = '<a title="Edit"><button class="trigger" onclick="editUsers"><img src="img/img.png" style="width: 15px; height: 15px;"></a><a title="Delete"></button><button class="trigger" onclick="deleteUsers"><img src="img/imgX.jpeg" style="width: 15px; height: 15px;"></button></a>';
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
