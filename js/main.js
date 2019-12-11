// DOM Elements
let root = document.documentElement;
const body = document.body;

const container = document.querySelector(".container");
const topContainer = document.querySelector(".top-container");
const bottomContainer = document.querySelector(".bottom-container");
const topRow = document.querySelector(".top-row");
const middleRow = document.querySelector(".middle-row");
const bottomRow = document.querySelector(".bottom-row");
const inputRowTwo = document.querySelector(".input-row-two");

const menuToggle = document.querySelector(".toggle");
const menuCheckbox = document.getElementById("menu-checkbox");
const refreshButton = document.querySelector(".refresh-button");
const refreshSymbol = document.getElementById("refresh-symbol");
const conversionArrow = document.querySelector(".conversion-arrow");
const authorText = document.querySelectorAll(".author-text");
const hiddenElements = document.querySelectorAll(".hidden");

const btcTop = document.getElementById("btc");
const satTop = document.getElementById("sat");
const usdTop = document.getElementById("usd");
const eurTop = document.getElementById("eur");

const btcBottom = document.getElementById("btc-red");
const satBottom = document.getElementById("sat-red");
const usdBottom = document.getElementById("usd-red");
const eurBottom = document.getElementById("eur-red");

const picker = document.getElementById("picker");
const pickerRed = document.getElementById("picker-red");

const date = document.querySelector(".date");

// Vanilla JavaScript allows no API key hiding or environmental variable usage
// A back-end solution just for this would render in a bad experience for users
// since I need a free hoster and Heroku servers go to sleep constantly making
// the frontend slow on every startup. Also the domain is too specific to
// ask a user to provide his own API key. Thus this is willingly public.
const alphaVantage = "2ENJF9F7J0AO0SXY";

// Get current date
let today = new Date();
let day = String(today.getDate()).padStart(2, "0");
let year = today.getFullYear();
let month = today.toLocaleString("default", { month: "long" });

window.onload = () => {
  // set current date
  date.innerHTML = month.substring(0, 3) + " " + day + ", " + year;

  // load / set localStorage for preference currency pair
  if (localStorage.getItem("currency-top") === null) {
    localStorage.setItem("currency-top", "btc");
  }

  if (localStorage.getItem("currency-bottom") === null) {
    localStorage.setItem("currency-bottom", "usd");
  }

  // set picker to active elements
  setTopSelection(activeTop()[0].id);
  setBottomSelection(activeBottom()[0].id);
};

// Menu Overlay
menuCheckbox.addEventListener("change", () => {
  if (menuCheckbox.checked) {
    topContainer.classList.add("overlay");
    bottomContainer.classList.add("overlay");
    container.classList.add("bg-black");
    topRow.classList.add("top-row-menu");
    // root.style.setProperty("--menu-color", "#e95f5d");
    refreshButton.style.display = "none";
    conversionArrow.style.display = "none";
    date.style.display = "none";
    middleRow.style.display = "none";
    bottomRow.style.display = "none";
    inputRowTwo.style.display = "none";
    authorText.forEach(element => element.classList.add("author-text-white"));
    hiddenElements.forEach(element => element.classList.remove("hidden"));
  } else {
    topContainer.classList.remove("overlay");
    bottomContainer.classList.remove("overlay");
    container.classList.remove("bg-black");
    topRow.classList.remove("top-row-menu");
    // root.style.setProperty("--menu-color", "white");
    refreshButton.style.display = "";
    conversionArrow.style.display = "";
    date.style.display = "";
    middleRow.style.display = "";
    bottomRow.style.display = "";
    inputRowTwo.style.display = "";
    authorText.forEach(element =>
      element.classList.remove("author-text-white")
    );
    hiddenElements.forEach(element => element.classList.add("hidden"));
  }
});

// Data fetch and Refresh Button
refreshButton.addEventListener("click", () => {
  if (document.querySelectorAll(".fa-spin").length < 1) {
    refreshSymbol.classList.add("fa-spin");
    refreshButton.classList.add("refresh-button-triggered");

    setTimeout(function() {
      refreshButton.classList.remove("refresh-button-triggered");
    }, 100);

    setTimeout(function() {
      refreshSymbol.classList.remove("fa-spin");
    }, 1000);
  }
});

// Currency selecting
btcTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "btc") {
    deleteSelection(picker);
    picker.classList.add("selected-top-first");
    deleteActive();
    btcTop.classList.add("active");
  }
});

satTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "sat") {
    deleteSelection(picker);
    picker.classList.add("selected-top-second");
    deleteActive();
    satTop.classList.add("active");
  }
});

usdTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "usd") {
    deleteSelection(picker);
    picker.classList.add("selected-top-third");
    deleteActive();
    usdTop.classList.add("active");
  }
});

eurTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "eur") {
    deleteSelection(picker);
    picker.classList.add("selected-top-fourth");
    deleteActive();
    eurTop.classList.add("active");
  }
});

btcBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "btc-red") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-first");
    deleteActiveBottom();
    btcBottom.classList.add("active-red");
  }
});

satBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "sat-red") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-second");
    deleteActiveBottom();
    satBottom.classList.add("active-red");
  }
});

usdBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "usd-red") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-third");
    deleteActiveBottom();
    usdBottom.classList.add("active-red");
  }
});

eurBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "eur-red") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-fourth");
    deleteActiveBottom();
    eurBottom.classList.add("active-red");
  }
});

activeTop = () => document.querySelectorAll(".active");
activeBottom = () => document.querySelectorAll(".active-red");
deleteSelection = element => {
  element.classList.remove("selected-top-first");
  element.classList.remove("selected-top-second");
  element.classList.remove("selected-top-third");
  element.classList.remove("selected-top-fourth");

  element.classList.remove("selected-bottom-first");
  element.classList.remove("selected-bottom-second");
  element.classList.remove("selected-bottom-third");
  element.classList.remove("selected-bottom-fourth");
};
deleteActive = () =>
  document
    .querySelectorAll(".active")
    .forEach(element => element.classList.remove("active"));
deleteActiveBottom = () =>
  document
    .querySelectorAll(".active-red")
    .forEach(element => element.classList.remove("active-red"));

// Initialization Currency Selection
setTopSelection = elementId => {
  if (elementId === "btc") {
    picker.classList.add("selected-top-first");
  } else if (elementId === "sat") {
    picker.classList.add("selected-top-second");
  } else if (elementId === "usd") {
    picker.classList.add("selected-top-third");
  } else if (elementId === "eur") {
    picker.classList.add("selected-top-fourth");
  }
};

setBottomSelection = elementId => {
  if (elementId === "btc-red") {
    pickerRed.classList.add("selected-bottom-first");
  } else if (elementId === "sat-red") {
    pickerRed.classList.add("selected-bottom-second");
  } else if (elementId === "usd-red") {
    pickerRed.classList.add("selected-bottom-third");
  } else if (elementId === "eur-red") {
    pickerRed.classList.add("selected-bottom-fourth");
  }
};

// Navigation
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  // up arrow
  if (e.keyCode == "38") {
    alert("arrow up");

    // down arrow
  } else if (e.keyCode == "40") {
    alert("arrow down");

    // left arrow
  } else if (e.keyCode == "37") {
    alert("arrow left");

    // right arrow
  } else if (e.keyCode == "39") {
    alert("arrow right");

    // space
  } else if (e.keyCode == "32") {
    if (document.querySelectorAll(".fa-spin").length < 1) {
      refreshButton.click();
      refreshButton.classList.add("refresh-button-triggered");
      setTimeout(function() {
        refreshButton.classList.remove("refresh-button-triggered");
      }, 150);
    }
    // escape
  } else if (e.keyCode == "27") {
    menuCheckbox.click();
  }
}
