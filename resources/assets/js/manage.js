//Define the accordions menu constant
const accordions = document.getElementsByClassName('has-submenu')

//Define the side menu sliding constant
const adminSlideoutButton = document.getElementById('admin-slideout-button')

function setSubmenuStyles (submenu, maxHeight, margins) {
  submenu.style.maxHeight = maxHeight
  submenu.style.marginTop = margins
  submenu.style.marginBottom = margins
}

if (adminSlideoutButton) {
  adminSlideoutButton.onclick = function (){
    // this.classList.toggle('is-active');
    document.getElementById('admin-side-menu').classList.toggle('is-active');
  }
}

for (var i = 0; i < accordions.length; i++) {
  //Detect if menu option is active to open the accordion
  if (accordions[i].classList.contains('is-active')) {
    const submenu = accordions[i].nextElementSibling;
    submenu.style.maxHeight = submenu.scrollHeight + "px"
    submenu.style.marginTop = "0.75em"
    submenu.style.marginBottom = "0.75em"
  }

  //Define the event on menu option click
  accordions[i].onclick = function () {
    this.classList.toggle('is-active');

    const submenu = this.nextElementSibling;
    if (submenu.style.maxHeight) {
      // menu is open, we need to close it now
      setSubmenuStyles(submenu, null, null)
    } else {
      // meny is close, so we need to open it
      setSubmenuStyles(submenu, submenu.scrollHeight + "px", "0.75em")
    }
  }
}
