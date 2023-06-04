function menutoggle() {
  var menuItems = document.getElementById("MenuItems");
  if (menuItems.classList.contains("show-menu")) {
    menuItems.classList.remove("show-menu");
  } else {
    menuItems.classList.add("show-menu");
  }
}