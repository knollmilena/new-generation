let burger = document.querySelector(".header__burger");
let menu = document.querySelector(".navbar__wrap");
let menuLinks = document.querySelectorAll(".navbar__item");

burger.addEventListener("click", function () {
  burger.classList.toggle("header__burger--active");
  menu.classList.toggle("navbar__wrap--active");
  document.body.classList.toggle("stop-scroll");
});
console.log(menuLinks);
menuLinks.forEach(function (el) {
  el.addEventListener("click", function () {
    burger.classList.remove("header__burger--active");
    menu.classList.remove("navbar__wrap--active");
    document.body.classList.remove("stop-scroll");
  });
});

// MODAL
const entry = document.querySelector(".personal__acc");
const modal = document.querySelector(".modal-wrap");
const cross = document.querySelectorAll(".cross");
const callRegistration = document.querySelector(".entrybtn");
const accountBtn = document.querySelector(".accountbtn");

modal.addEventListener('click', function(e){
  console.log(e.target, callRegistration);
  if(e.target === callRegistration){
    modal.classList.remove("modal-wrap--entry");
    modal.classList.add("modal-wrap--register");
  }
  
})
modal.addEventListener('click', function(e){

  if(e.target === accountBtn){
    modal.classList.add("modal-wrap--entry");
    modal.classList.remove("modal-wrap--register");
  }
  
})
entry.addEventListener("click", function() {
    modal.classList.add("modal-wrap--entry");
})
console.log(1)
cross.forEach(function (item) {
  item.addEventListener("click", function() {
    modal.classList.remove("modal-wrap--entry");
    modal.classList.remove("modal-wrap--register");

})
})



const btnScroll = document.querySelector(".btn-up");
window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 300) {
    btnScroll.classList.add("btn-up--active");
  } else if (document.documentElement.scrollTop < 100) {
    btnScroll.classList.remove("btn-up--active");
  }
});

btnScroll.addEventListener("click", () => {
  // document.documentElement.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
});
