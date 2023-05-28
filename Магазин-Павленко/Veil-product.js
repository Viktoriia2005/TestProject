//  let MenuItems = document.getElementById("MenuItems");

//  MenuItems.style.maxHeight = "0px";

//  function menutoggle() {
//      if (MenuItems.style.maxHeight == "0px")
//      {
//          MenuItems.style.maxHeight = "200px";
//      }
//      else {
//          MenuItems.style.maxHeight = "0px";
//      }
//  }

function menutoggle() {
  var menuItems = document.getElementById("MenuItems");
  if (menuItems.classList.contains("show-menu")) {
    menuItems.classList.remove("show-menu");
  } else {
    menuItems.classList.add("show-menu");
  }
}


let productImg = document.getElementById("productImg");
let smallImg = document.getElementsByClassName("small-img");
smallImg[0].onclick = function () {
  productImg.src = smallImg[0].src;
};

smallImg[1].onclick = function () {
  productImg.src = smallImg[1].src;
};
smallImg[2].onclick = function () {
  productImg.src = smallImg[2].src;
};
smallImg[3].onclick = function () {
  productImg.src = smallImg[3].src;
};
