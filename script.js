import rows from "./static/keys.js";
import { createElement, controlHighlight } from "./modules/utils.js";

const body = document.querySelector("body");

const container = createElement("section", "container", body);
const inputField = createElement("div", "input-container", container);
const keyboard = createElement("div", "keyboard", container);

const keys = [];

Object.keys(rows).forEach((row) => {
  const r = createElement("div", `row row-${row}`, keyboard);
  rows[row].forEach((key) => {
    console.log(key);
    const k = createElement(
      "div",
      key.class ? `key ${key.class}` : "key",
      r,
      key.en.main
    );
    createElement("div", "sec", k, key.en.sec ? key.en.sec : "");
    keys.push(k);
  });
});

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  console.log(e);
  controlHighlight(e, keys);
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  controlHighlight(e, keys, false);
});

keys.forEach((key) => {
  console.log(key.textContent);
});
