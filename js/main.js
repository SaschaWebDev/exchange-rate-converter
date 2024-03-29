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

const date = document.querySelector(".date");

// Get current date
let today = new Date();
let day = String(today.getDate()).padStart(2, "0");
let year = today.getFullYear();
let month = today.toLocaleString("default", { month: "long" });

window.onload = () => {
  date.innerHTML = month.substring(0, 3) + " " + day + ", " + year;
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

refreshButton.addEventListener("click", () => {
  refreshSymbol.classList.add("fa-spin");
  setTimeout(function() {
    refreshSymbol.classList.remove("fa-spin");
  }, 1000);
});

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
    refreshButton.click();
    refreshButton.classList.add("refresh-button-clicked");
    setTimeout(function() {
      refreshButton.classList.remove("refresh-button-clicked");
    }, 1000);

    // escape
  } else if (e.keyCode == "27") {
    menuCheckbox.click();
  }
}
