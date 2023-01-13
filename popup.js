const injectCodeBtn = document.getElementById("inject-code-btn");
const removeCSSBtn = document.getElementById("remove-CSS-Btn");
const colorContainer = document.getElementById("color-container");
const Hexcode = document.getElementById("hex-code");
const reloadColorsBtn = document.getElementById("reload-colors-btn");
var codes = localStorage.getItem("codes")
  ? JSON.parse(localStorage.getItem("codes"))
  : [];


//check if Hexcode valid
const isValidHexCode = (value) => {
  const hexCodeRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  return hexCodeRegex.test(value);
};

//Reaload colors 
const ReloadColors = () => {
  while (colorContainer.firstChild) {
    colorContainer.removeChild(colorContainer.firstChild);
  }
  const colors = generateColors();
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.style.backgroundColor = color;
    button.addEventListener("click", function () {
      selectColor(this);
    });
    colorContainer.appendChild(button);
  });
};
// Function to generate random good-looking colors
const generateColors = () => {
  const colors = [];
  for (let i = 0; i < 3; i++) {
    // Randomly generate a dark color in the HSL color space
    const darkColor = `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(
      Math.random() * 100
    )}%, ${Math.floor(Math.random() * 50 + 50)}%)`;
    colors.push(darkColor);
  }
  for (let i = 0; i < 3; i++) {
    // Randomly generate a light color in the HSL color space
    const lightColor = `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(
      Math.random() * 100
    )}%, ${Math.floor(Math.random() * 50)}%)`;
    colors.push(lightColor);
  }
  return colors;
};

// Function to create color buttons
const createColorButtons = () => {
  const colors = generateColors();
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.style.backgroundColor = color;
    button.addEventListener("click", function () {
      selectColor(this);
    });
    colorContainer.appendChild(button);
  });
};

// Function to handle color selection
let selectedColor;
const selectColor = (button) => {
  if (selectedColor) {
    selectedColor.classList.remove("selected");
  }
  selectedColor = button;
  selectedColor.classList.add("selected");
};

injectCodeBtn.addEventListener("click", () => {
  if (isValidHexCode(Hexcode.value)) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.insertCSS(tabs[0].id, {
        code: `* { outline: 2px solid ${Hexcode.value}; }`,
      });
    });
    codes.push(Hexcode.value);

    localStorage.setItem("codes", JSON.stringify(codes));
  } else if (selectedColor) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.insertCSS(tabs[0].id, {
        code: `* { outline: 2px solid ${selectedColor.style.backgroundColor}; }`,
      });
    });
    codes.push(selectedColor.style.backgroundColor);
    localStorage.setItem("codes", JSON.stringify(codes));
  }
});

reloadColorsBtn.addEventListener("click", () => {
  ReloadColors();
});
createColorButtons();

removeCSSBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    for (let i = 0; i < codes.length; i++) {
      const color = codes[i];
      chrome.tabs.removeCSS(tabs[0].id, {
        code: `* { outline: 2px solid ${color}; }`,
      });
    }
  });
  localStorage.setItem("codes", JSON.stringify([]));
});
