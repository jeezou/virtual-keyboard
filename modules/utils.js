function createElement(tag, classes, target, content = "") {
  const element = document.createElement(tag);
  if (classes) element.classList.add(...classes.split(" "));
  if (content) element.textContent = content;
  target.append(element);
  return element;
}

function appendKeys(keyboard, rows, lang) {
  const keys = [];
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
      keys.push(k);
    });
  });
  return keys;
}

function determineLeftRight(event, keys, controller, string) {
  if (event.code.toLowerCase().includes(string)) {
    if (event.code.toLowerCase().includes("left")) {
      keys.forEach((key) => {
        if (key.classList.contains(string)) {
          if (controller) key.classList.add("active");
          else key.classList.remove("active");
        }
      });
    } else {
      keys.forEach((key) => {
        if (key.classList.contains(`r${string}`)) {
          if (controller) key.classList.add("active");
          else key.classList.remove("active");
        }
      });
    }
  }
}

function controlHighlight(event, keys, controller = true) {
  const code = event.code.toLowerCase();
  if (code.includes("control"))
    determineLeftRight(event, keys, controller, "control");
  else if (code.includes("shift"))
    determineLeftRight(event, keys, controller, "shift");
  else if (code.includes("alt"))
    determineLeftRight(event, keys, controller, "alt");
  else if (code.includes("arrow")) {
    keys.forEach((key) => {
      if (key.classList.value.replace(/\s/g, "").toLowerCase().includes(code)) {
        if (controller) key.classList.add("active");
        else key.classList.remove("active");
      }
    });
  } else {
    keys.forEach((key) => {
      if (
        key.childNodes[0].nodeValue.replace(/\s/g, "") ===
          event.key.toLowerCase().replace(/\s/g, "") ||
        key.childNodes[1].textContent.replace(/\s/g, "") ===
          event.key.toLowerCase().replace(/\s/g, "")
      )
        if (controller) key.classList.add("active");
        else key.classList.remove("active");
    });
  }
}

export { createElement, controlHighlight, appendKeys };
