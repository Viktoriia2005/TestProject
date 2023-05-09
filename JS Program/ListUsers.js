function loadUsers() {
  fetch('ListUsers.json')
    .then(response => response.json())
    .then(data => {
      const table = document.querySelector('#table');
      const tbody = table.querySelector('tbody');
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

// loadUsers();
