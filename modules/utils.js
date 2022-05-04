function createElement(tag, classes, target, content = "") {
  const element = document.createElement(tag);
  if (classes) element.classList.add(...classes.split(" "));
  if (content) element.textContent = content;
  target.append(element);
  return element;
}

function appendKeys(keyboard, rows, lang) {
  const keys = {};
  while (keyboard.firstChild) {
    keyboard.removeChild(keyboard.lastChild);
  }
  Object.keys(rows).forEach((row) => {
    const r = createElement("div", `row row-${row}`, keyboard);
    rows[row].forEach((key) => {
      let text = key.en.main;
      let sec = "";
      if (lang === "ru") {
        if ("ru" in key) text = key.ru.main;
      }

      if (lang === "en" && typeof key.en.sec === "string") sec = key.en.sec;
      else if (lang === "ru") {
        if ("ru" in key) {
          console.log(key);
          if ("sec" in key.ru) sec = key.ru.sec;
          else if ("sec" in key.en) sec = key.en.sec;
        }
      }

      const k = createElement(
        "div",
        key.class ? `key ${key.class}` : "key",
        r,
        text
      );
      createElement("div", "sec", k, sec);

      const normalizeText = text.toLowerCase().replace(/\s/g, "");
      const normalizeSec = sec.toLowerCase().replace(/\s/g, "");

      if (normalizeText === "backspace") console.log(keys);

      if (normalizeText in keys) keys[`r${normalizeText}`] = k;
      else keys[normalizeText] = k;

      if (!(normalizeSec in keys) && normalizeSec !== "")
        keys[normalizeSec] = k;
    });
  });
  return keys;
}

function determineLeftRight(event, keys, controller, string) {
  if (event.code.toLowerCase().includes(string)) {
    if (event.code.toLowerCase().includes("left")) {
      Object.keys(keys).forEach((key) => {
        if (keys[key].classList.contains(string)) {
          if (controller) keys[key].classList.add("active");
          else keys[key].classList.remove("active");
        }
      });
    } else {
      Object.keys(keys).forEach((key) => {
        if (keys[key].classList.contains(`r${string}`)) {
          if (controller) keys[key].classList.add("active");
          else keys[key].classList.remove("active");
        }
      });
    }
  }
}

function controlHighlight(event, keys, controller = true) {
  console.log(event);
  const code = event.code.toLowerCase();
  if (code.includes("control"))
    determineLeftRight(event, keys, controller, "control");
  else if (code.includes("shift"))
    determineLeftRight(event, keys, controller, "shift");
  else if (code.includes("alt"))
    determineLeftRight(event, keys, controller, "alt");
  else if (code.includes("arrow")) {
    Object.keys(keys).forEach((key) => {
      if (
        keys[key].classList.value
          .replace(/\s/g, "")
          .toLowerCase()
          .includes(code)
      ) {
        if (controller) keys[key].classList.add("active");
        else keys[key].classList.remove("active");
      }
    });
  } else {
    const e = event.key.toLowerCase().replace(/\s/g, "");
    if (e in keys) {
      if (controller) keys[e].classList.add("active");
      else keys[e].classList.remove("active");
    }
  }
}

export { createElement, controlHighlight, appendKeys };
