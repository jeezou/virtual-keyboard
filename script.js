import rows from "./static/keys.js";
import {
  createElement,
  controlHighlight,
  appendKeys,
} from "./modules/utils.js";

let pressed = {};
let keys = {};
let ruKeys = {};
let lang = "en";

const body = document.querySelector("body");
const container = createElement("section", "container", body);
const inputField = createElement("div", "input-container", container);
const keyboard = createElement("div", "keyboard", container);

const kbLayout = createElement("div", "layout", body);
const img = createElement("img", "image", kbLayout);
img.src = lang === "en" ? "./assets/images/en.png" : "./assets/images/ru.png";

({ keys, ruKeys } = appendKeys(keyboard, rows, lang));

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (!pressed[e.key.toLowerCase()]) {
    pressed[e.key.toLowerCase()] = true;
    if (pressed.control && pressed.alt) {
      lang = lang === "en" ? "ru" : "en";
      img.src =
        lang === "en" ? "./assets/images/en.png" : "./assets/images/ru.png";
      ({ keys, ruKeys } = appendKeys(keyboard, rows, lang));
    }
    controlHighlight(e, { keys, ruKeys });
  }
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  delete pressed[e.key.toLowerCase()];
  controlHighlight(e, { keys, ruKeys }, false);
});

document.addEventListener("visibilitychange", () => {
  const pressedKeys = Object.keys(pressed);
  if (pressedKeys.length > 0) {
    Object.keys(pressed).forEach((key) => delete pressed[key]);
    ({ keys, ruKeys } = appendKeys(keyboard, rows, lang));
  }
});
