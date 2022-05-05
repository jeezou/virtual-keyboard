function createElement(tag, classes, target, content = "") {
  const element = document.createElement(tag);
  if (classes) element.classList.add(...classes.split(" "));
  if (content) element.textContent = content;
  target.append(element);
  return element;
}

function appendKeys(keyboard, rows, lang) {
  const keys = {};
  const ruKeys = {};
  while (keyboard.firstChild) {
    keyboard.removeChild(keyboard.lastChild);
  }
  Object.keys(rows).forEach((row) => {
    const r = createElement("div", `row row-${row}`, keyboard);
    rows[row].forEach((key) => {
      const { main } = key.en;
      const ruMain = "ru" in key ? key.ru.main : key.en.main;
      const sec = "sec" in key.en ? key.en.sec : "";
      let ruSec = "";

      if ("ru" in key) {
        if ("sec" in key.ru) ruSec = key.ru.sec;
      } else if ("sec" in key.en) ruSec = key.en.sec;

      const k = createElement(
        "div",
        key.class ? `key ${key.class}` : "key",
        r,
        lang === "en" ? main : ruMain
      );
      createElement("div", "sec", k, lang === "en" ? sec : ruSec);

      const normalizeMain = main.toLowerCase().replace(/\s/g, "");
      const normalizeSec = sec.toLowerCase().replace(/\s/g, "");

      const normalizeRuMain = ruMain.toLowerCase().replace(/\s/g, "");

      if (normalizeMain in ruKeys) ruKeys[`r${normalizeRuMain}`] = k;
      else ruKeys[normalizeMain] = k;

      if (!(normalizeSec in ruKeys) && normalizeSec !== "")
        ruKeys[normalizeSec] = k;

      if (normalizeMain in keys) keys[`r${normalizeMain}`] = k;
      else keys[normalizeMain] = k;

      if (!(normalizeSec in keys) && normalizeSec !== "")
        keys[normalizeSec] = k;
    });
  });
  return { keys, ruKeys };
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

function controlHighlight(event, obj, controller = true) {
  let keys = {};
  let ruKeys = {};
  ({ keys, ruKeys } = obj);
  const code = event.code.toLowerCase();
  if (code.includes("control"))
    determineLeftRight(event, keys, controller, "control");
  else if (code.includes("shift"))
    determineLeftRight(event, keys, controller, "shift");
  else if (code.includes("alt"))
    determineLeftRight(event, keys, controller, "alt");
  else if (code.includes("meta")) {
    if (controller) keys.win.classList.add("active");
    else keys.win.classList.remove("active");
  } else if (code.includes("arrow")) {
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
    if (e in keys || e in ruKeys) {
      if (controller) keys[e].classList.add("active");
      else keys[e].classList.remove("active");
    }
  }
}

function handleOutput(output, ta, mouse = false) {
  const textArea = ta;
  if (output) {
    const val = textArea.value;
    let start = textArea.selectionStart;
    let end = textArea.selectionEnd;
    if (typeof output === "string") {
      textArea.value = val.slice(0, start) + output + val.slice(end);
      textArea.selectionStart = start + 1;
      textArea.selectionEnd = start + 1;
    } else if (typeof output === "object") {
      if (output.name === "backspace") {
        if (start > 0) {
          if (start === end) {
            start -= 1;
            end -= 1;
            textArea.value = `${val.slice(0, start)}${val.slice(end + 1)}`;

            textArea.selectionStart = start;
            textArea.selectionEnd = end;
          } else {
            textArea.value = `${val.slice(0, start)}${val.slice(end)}`;
            end = start;
            textArea.selectionStart = start;
            textArea.selectionEnd = end;
          }
        } else if (start === 0 && end !== start) {
          textArea.value = `${val.slice(0, start)}${val.slice(end)}`;
          end = start;
          textArea.selectionStart = start;
          textArea.selectionEnd = end;
        }
      }
      if (output.name === "delete") {
        if (start === end) {
          textArea.value = `${val.slice(0, start)}${val.slice(end + 1)}`;

          textArea.selectionStart = start;
          textArea.selectionEnd = start;
        }
        if (start !== end) {
          textArea.value = `${val.slice(0, start)}${val.slice(end)}`;
          end = start;
          textArea.selectionStart = start;
          textArea.selectionEnd = end;
        }
      }
      if (output.name === "enter") {
        textArea.value = `${val.slice(0, start)}\n${val.slice(end)}`;
        textArea.selectionStart = start + 1;
        textArea.selectionEnd = start + 1;
      }
      if (output.name === "tab") {
        textArea.value = `${val.slice(0, start)}\t${val.slice(end)}`;
        textArea.selectionStart = start + 1;
        textArea.selectionEnd = start + 1;
      }
    }
  }
  if (mouse)
    return {
      start: textArea.selectionStart,
      end: textArea.selectionEnd,
      ta: textArea,
    };
  return textArea;
}

function handleClickInput(e, pressed) {
  const controls = [
    "tab",
    "capslock",
    "shift",
    "ctrl",
    "alt",
    "meta",
    "delete",
    "enter",
    "backspace",
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright",
  ];

  const node = e.target;
  const main = node.childNodes[0].textContent.toLowerCase().replace(/\s/g, "");
  const sec = node.childNodes[1]
    ? node.childNodes[1].textContent.toLowerCase().replace(/\s/g, "")
    : "";
  let output = "";

  if (node.classList.contains("space")) return " ";

  if (!controls.includes(main)) {
    if (pressed.shift) {
      if (sec) output += sec;
      else output += main.toUpperCase();
    } else if (pressed.capslock && !pressed.shift) output += main.toUpperCase();
    else output += main;
  } else {
    if (main === "backspace") return { name: "backspace" };
    if (main === "delete") return { name: "delete" };
    if (main === "tab") return { name: "tab" };
    if (main === "enter") return { name: "enter" };
  }

  return output;
}

function handleInput(e, ruKeys, lang, pressed) {
  const controls = [
    "tab",
    "capslock",
    "shift",
    "control",
    "alt",
    "meta",
    "delete",
    "enter",
    "backspace",
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright",
  ];

  let output = "";
  const normalizeKey = e.key.toLowerCase().replace(/\s/g, "");
  if (normalizeKey in ruKeys) {
    if (!controls.includes(normalizeKey)) {
      if (lang === "en") output += e.key;
      else {
        const node = ruKeys[normalizeKey];
        const main = node.childNodes[0].textContent;
        const sec = node.childNodes[1] ? node.childNodes[1].textContent : "";
        if (pressed.shift) {
          if (sec) output += sec;
          else output += main.toUpperCase();
        } else if (pressed.capslock && !pressed.shift)
          output += main.toUpperCase();
        else output += main;
      }
    } else {
      if (normalizeKey === "backspace") return { name: "backspace" };
      if (normalizeKey === "delete") return { name: "delete" };
      if (normalizeKey === "tab") return { name: "tab" };
      if (normalizeKey === "enter") return { name: "enter" };
    }
  } else return -1;
  return output;
}

export {
  createElement,
  controlHighlight,
  appendKeys,
  handleInput,
  handleClickInput,
  handleOutput,
};
