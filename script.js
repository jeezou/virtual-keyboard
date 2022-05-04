import rows from "./static/keys.js";
import {
  createElement,
  controlHighlight,
  appendKeys,
} from "./modules/utils.js";

const pressed = {};
let keys = {};
let lang = "en";

const body = document.querySelector("body");
const container = createElement("section", "container", body);
const inputField = createElement("div", "input-container", container);
const keyboard = createElement("div", "keyboard", container);

const kbLayout = createElement("div", "layout", body);
const img = createElement("img", "image", kbLayout);
img.src = lang === "en" ? "./assets/images/en.png" : "./assets/images/ru.png";

keys = appendKeys(keyboard, rows, lang);

document.addEventListener("keydown", (e) => {
  pressed[e.key.toLowerCase()] = true;

  if (pressed.control && pressed.alt) {
    lang = lang === "en" ? "ru" : "en";
    img.src =
      lang === "en" ? "./assets/images/en.png" : "./assets/images/ru.png";
    keys = appendKeys(keyboard, rows, lang);
  }

  e.preventDefault();
  controlHighlight(e, keys);
});

document.addEventListener("keyup", (e) => {
  delete pressed[e.key.toLowerCase()];
  e.preventDefault();
  controlHighlight(e, keys, false);
});

document.addEventListener("visibilitychange", () => {
  keys = appendKeys(keyboard, rows, lang);
});
