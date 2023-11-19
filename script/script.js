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
//кнопка Войти
const entry = document.querySelector(".personal__acc");
const regBtn = document.querySelector(".regbtn");
// обертка модалок + оверфлоу
const modal = document.querySelector(".modal-wrap");
//крестик
const cross = document.querySelectorAll(".cross");
//у меня нет аккаунта - открытие формы регистрации
const callRegistration = document.querySelector(".entrybtn");
//у меня уже есть аккаунт - открытие формы входа
const accountBtn = document.querySelector(".accountbtn");

modal.addEventListener("click", function (e) {
  if (e.target === callRegistration) {
    modal.classList.remove("right");
    modal.classList.add("left");
    function hideForm() {
      modal.classList.remove("modal-wrap--entry", "left", "right");
      modal.classList.add("modal-wrap--register", "right");
    }
    setTimeout(hideForm, 400);
  }
  if (e.target === accountBtn) {
    modal.classList.remove("right");
    modal.classList.add("left");
    function hideForm() {
      modal.classList.remove("modal-wrap--register", "left", "right");
      modal.classList.add("modal-wrap--entry", "right");
    }
    setTimeout(hideForm, 400);
  }
  if (e.target === modal) {
    modal.classList.remove("modal-wrap--entry");
    modal.classList.remove("modal-wrap--register");
  }
});

entry.addEventListener("click", function () {
  modal.classList.add("modal-wrap--entry", "show");
});
regBtn.addEventListener("click", () => {
  modal.classList.add("modal-wrap--register", "show");
});
cross.forEach(function (item) {
  item.addEventListener("click", function () {
    modal.classList.add("hide");

    function removeAnimation() {
      modal.classList.remove("modal-wrap--entry");
      modal.classList.remove("modal-wrap--register");
      modal.classList.remove("hide", "show", "right");
    }
    setTimeout(removeAnimation, 350);
  });
});

const btnScroll = document.querySelector(".btn-up");
window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 300) {
    btnScroll.classList.add("btn-up--active");
  } else if (document.documentElement.scrollTop < 100) {
    btnScroll.classList.remove("btn-up--active");
  }
});

btnScroll.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
