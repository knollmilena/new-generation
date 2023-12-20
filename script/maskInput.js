window.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".text-input");
  inputs.forEach((item) => {
    item.addEventListener("keypress", (ev) => {
      let reg = /^[а-яА-ЯёЁ\s-]+$/;
      const newValue = ev.target.value + ev.key;
      if (reg.test(newValue)) {
      } else {
        ev.preventDefault();
      }
    });
  });
  function jadenAndSplice(str) {
    let result = "";
    const words = str.split(" ");
    for (let i = 0; i < words.length && words.length > 0; i++) {
      const item = words[i];
      if (item) {
        if (i === 0) {
          const count = item.length;
          delete words[count];
        }
        const firstLetter = item.charAt(0).toUpperCase();
        result = result + " " + firstLetter + item.slice(1);
      }
    }
    return result.trim();
  }
  inputs.forEach((item) => {
    item.addEventListener("blur", (ev) => {
      let string = item.value.trim().replace(/^-+|-+/g, "-");
      string = string.replace(/^-+|-+$|[a-z0-9]+/gi, "");
      string = string.replace(/\s+/g, " ");
      item.value = jadenAndSplice(string);
    });
  });
});
