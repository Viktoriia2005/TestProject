function loadUsers() {
  fetch('ListUsers.json')
    .then(response => response.json())
    .then(data => {
      const table = document.querySelector('#table');
      const tbody = table.querySelector('tbody');
      for (const user of data) {
        const row = tbody.insertRow();
        const idCell = row.insertCell();
        idCell.textContent = user.id;
        const nameCell = row.insertCell();
        nameCell.textContent = `${user.firstName} ${user.lastName}`;
        const birthdayCell = row.insertCell();
        birthdayCell.textContent = user.birthday;
        const cityCell = row.insertCell();
        cityCell.textContent = user.city;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = '<a title="Edit"><button class="trigger" onclick="editUsers"><img src="img/img.png" style="width: 15px; height: 15px;"></a><a title="Delete"></button><button class="trigger" onclick="deleteUsers"><img src="img/imgX.jpeg" style="width: 15px; height: 15px;"></button></a>';
      }
    })
};

loadUsers();
