import rows from "./static/keys.js";
import {
  createElement,
  controlHighlight,
  appendKeys,
} from "./modules/utils.js";

const pressed = {};

let keys = {};
let ruKeys = {};

const localStorageLangData = localStorage.getItem("lang");
let lang = localStorageLangData !== null ? localStorageLangData : "en";

const guideInfo = [
  { tag: "h1", content: " Usage Guide ", class: "heading" },
  {
    tag: "p",
    content: "1. Make sure your system keyboard layout set on EN",
    class: "paragraph",
  },
  {
    tag: "p",
    content: "2. Choose virtual keyboard layout pressing CTRL + ALT",
    class: "paragraph",
  },
  {
    tag: "p",
    content: "3. Available languages are English (US) and Russian (RU)",
    class: "paragraph",
  },
];

const body = document.querySelector("body");

const container = createElement("section", "container", body);
const inputField = createElement("div", "input-container", container);
const keyboard = createElement("div", "keyboard", container);
const infoField = createElement("div", "info-container", container);

const infoContacts = createElement("div", "info-contacts", infoField);
const contactsHeadingWrapper = createElement("div", "wrapper", infoContacts);
const contactsHeading = createElement(
  "a",
  "contacts-heading",
  contactsHeadingWrapper
);
createElement("div", "item", contactsHeading, "Virtual");
createElement("div", "item", contactsHeading, "Keyboard");
const contactsContent = createElement(
  "div",
  "content",
  infoContacts,
  "With ❤️ By jeezou"
);
const contactsGhIcon = createElement("img", "gh", contactsContent);
contactsGhIcon.src = "./assets/images/gh.svg";
contactsHeading.addEventListener("click", () =>
  window.open(
    "https://github.com/jeezou/virtual-keyboard/tree/virtual-keyboard",
    "_blank"
  )
);
contactsContent.addEventListener("click", () =>
  window.open("https://github.com/jeezou", "_blank")
);

const infoGuide = createElement("div", "info-guide", infoField);
guideInfo.forEach((el) =>
  createElement(el.tag, el.class, infoGuide, el.content)
);

const kbLayout = createElement("div", "layout", infoField);
createElement("h1", "language-heading", kbLayout, "Current Layout");
const img = createElement("img", "image", kbLayout);
img.src = lang === "en" ? "./assets/images/en.svg" : "./assets/images/ru.svg";

({ keys, ruKeys } = appendKeys(keyboard, rows, lang));

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (!pressed[e.key.toLowerCase()]) {
    pressed[e.key.toLowerCase()] = true;
    if (pressed.control && pressed.alt) {
      lang = lang === "en" ? "ru" : "en";
      img.src =
        lang === "en" ? "./assets/images/en.svg" : "./assets/images/ru.svg";
      ({ keys, ruKeys } = appendKeys(keyboard, rows, lang));
      localStorage.setItem("lang", lang);
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
