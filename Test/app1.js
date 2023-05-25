// const modal = document.querySelector(".modal");
// const trigger = document.querySelector(".trigger");
// const closeButton = document.querySelector(".close-button");

// function toggleModal() {
//   modal.classList.toggle("show-modal");
// }

// function windowOnClick(event) {
//   if (event.target === modal) {
//     toggleModal();
//   }
// }

// trigger.addEventListener("click", toggleModal);
// closeButton.addEventListener("click", toggleModal);
// window.addEventListener("click", windowOnClick);
const loadUsers = {
  "people":[
    {
      "ID": 1,
      "firstName": "Viktoriia",
      "lastName": "Pavlenko",
      "birthday": "2005-11-16",
      "city": "Kremenchuk"
      },
      {
        "ID": 2,
        "firstName": "Marina",
        "lastName": "Lavrenyuk",
        "birthday":"2005-10-06",
        "city": "Kremenchuk"
      },
      {
        "ID": 3,
        "firstName": "Daria",
        "lastName": "Lyashuk",
        "birthday": "2005-09-14",
        "city": "Kremenchuk"
      },
      {
        "ID": 4,
        "firstName": "Kirill",
        "lastName": "Sukhoi",
        "birthday": "2005-10-01",
        "city": "Kremenchuk"
      }
  ]
}

document.querySelector('.content').innerHTML = `<table class="phone"></table>`
for (key in loadUsers) {
  let row = document.createElement('tr')
  row.innerHTML = `<td>${key}</td>`
  document.querySelector('.phone').appendChild(row)
  for (let i=0; i<loadUsers[key].length; i++) {
    let row = document.createElement('tr')
    row.innerHTML = `
    <td>${loadUsers [key][i][0]}</td>
    <td>${loadUsers [key][i][1]}</td>
    `
    document.querySelector('.phone').appendChild(row)
  }
}