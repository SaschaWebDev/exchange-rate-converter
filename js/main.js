// DOM Elements
let root = document.documentElement;
const body = document.body;

const container = document.querySelector(".container");
const topContainer = document.querySelector(".top-container");
const bottomContainer = document.querySelector(".bottom-container");
const topRow = document.querySelector(".top-row");
const middleRow = document.querySelector(".middle-row");
const amountInput = document.querySelector(".top-input");
const bottomRow = document.querySelector(".bottom-row");
const inputRowTwo = document.querySelector(".input-row-two");
const resultInput = document.querySelector(".result-input");

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

let priceFetching = false;

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
    selectBTCTop();
  } else {
    deleteActive();
    if (localStorage.getItem("currency-top") === "btc") {
      selectBTCTop();
    } else if (localStorage.getItem("currency-top") === "sat") {
      selectSATTop();
    } else if (localStorage.getItem("currency-top") === "usd") {
      selectUSDTop();
    } else if (localStorage.getItem("currency-top") === "eur") {
      selectEURTop();
    }
  }

  if (localStorage.getItem("currency-bottom") === null) {
    localStorage.setItem("currency-bottom", "usd");
    selectUSDBottom();
  } else {
    deleteActiveBottom();
    if (localStorage.getItem("currency-bottom") === "btc") {
      selectBTCBottom();
    } else if (localStorage.getItem("currency-bottom") === "sat") {
      selectSATBottom();
    } else if (localStorage.getItem("currency-bottom") === "usd") {
      selectUSDBottom();
    } else if (localStorage.getItem("currency-bottom") === "eur") {
      selectEURBottom();
    }
  }

  // LADEN AKTIV AUS LOCAL STORAGE UNS SETZEN

  // set picker to active elements
  setTopSelection(activeTop()[0].id);
  setBottomSelection(activeBottom()[0].id);

  // Initialize Navigation
  // setTopSelectionCount();
  // setBottomSelectionCount();
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
    }, 180);

    setTimeout(function() {
      refreshSymbol.classList.remove("fa-spin");
    }, 1000);
  }
});

// Currency on Click
btcTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "btc") {
    selectBTCTop();
  }
});

satTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "sat") {
    selectSATTop();
  }
});

usdTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "usd") {
    selectUSDTop();
  }
});

eurTop.addEventListener("click", () => {
  if (activeTop()[0].id !== "eur") {
    selectEURTop();
  }
});

btcBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "btc-red") {
    selectBTCBottom();
  }
});

satBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "sat-red") {
    selectSATBottom();
  }
});

usdBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "usd-red") {
    selectUSDBottom();
  }
});

eurBottom.addEventListener("click", () => {
  if (activeBottom()[0].id !== "eur-red") {
    selectEURBottom();
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

// Currency selection
selectBTCTop = () => {
  if (localStorage.getItem("currency-bottom") !== "btc") {
    deleteSelection(picker);
    picker.classList.add("selected-top-first");
    deleteActive();
    btcTop.classList.add("active");
    localStorage.setItem("currency-top", "btc");
    localStorage.setItem("currency-top-counter", "1");
    triggerConvertion();
  } else {
    setErrorShakeEffect("btc-top");
  }
};

selectSATTop = () => {
  if (localStorage.getItem("currency-bottom") !== "sat") {
    deleteSelection(picker);
    picker.classList.add("selected-top-second");
    deleteActive();
    satTop.classList.add("active");
    localStorage.setItem("currency-top", "sat");
    localStorage.setItem("currency-top-counter", "2");
    triggerConvertion();
  } else {
    setErrorShakeEffect("sat-top");
  }
};

selectUSDTop = () => {
  if (localStorage.getItem("currency-bottom") !== "usd") {
    deleteSelection(picker);
    picker.classList.add("selected-top-third");
    deleteActive();
    usdTop.classList.add("active");
    localStorage.setItem("currency-top", "usd");
    localStorage.setItem("currency-top-counter", "3");
    triggerConvertion();
  } else {
    setErrorShakeEffect("usd-top");
  }
};

selectEURTop = () => {
  if (localStorage.getItem("currency-bottom") !== "eur") {
    deleteSelection(picker);
    picker.classList.add("selected-top-fourth");
    deleteActive();
    eurTop.classList.add("active");
    localStorage.setItem("currency-top", "eur");
    localStorage.setItem("currency-top-counter", "4");
    triggerConvertion();
  } else {
    setErrorShakeEffect("eur-top");
  }
};

selectBTCBottom = () => {
  if (localStorage.getItem("currency-top") !== "btc") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-first");
    deleteActiveBottom();
    btcBottom.classList.add("active-red");
    localStorage.setItem("currency-bottom", "btc");
    localStorage.setItem("currency-bottom-counter", "1");
    triggerConvertion();
  } else {
    setErrorShakeEffect("btc-bottom");
  }
};

selectSATBottom = () => {
  if (localStorage.getItem("currency-top") !== "sat") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-second");
    deleteActiveBottom();
    satBottom.classList.add("active-red");
    localStorage.setItem("currency-bottom", "sat");
    localStorage.setItem("currency-bottom-counter", "2");
    triggerConvertion();
  } else {
    setErrorShakeEffect("sat-bottom");
  }
};

selectUSDBottom = () => {
  if (localStorage.getItem("currency-top") !== "usd") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-third");
    deleteActiveBottom();
    usdBottom.classList.add("active-red");
    localStorage.setItem("currency-bottom", "usd");
    localStorage.setItem("currency-bottom-counter", "3");
    triggerConvertion();
  } else {
    setErrorShakeEffect("usd-bottom");
  }
};

selectEURBottom = () => {
  if (localStorage.getItem("currency-top") !== "eur") {
    deleteSelection(pickerRed);
    pickerRed.classList.add("selected-bottom-fourth");
    deleteActiveBottom();
    eurBottom.classList.add("active-red");
    localStorage.setItem("currency-bottom", "eur");
    localStorage.setItem("currency-bottom-counter", "4");
    triggerConvertion();
  } else {
    setErrorShakeEffect("eur-bottom");
  }
};

//Effects

setErrorShakeEffect = element => {
  if (element === "btc-top") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      btcTop.classList.add("error-animation");
      setTimeout(function() {
        btcTop.classList.remove("error-animation");
      }, 1600);
    }
  } else if (element === "sat-top") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      satTop.classList.add("error-animation");
      setTimeout(function() {
        satTop.classList.remove("error-animation");
      }, 1600);
    }
  } else if (element === "usd-top") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      usdTop.classList.add("error-animation");
      setTimeout(function() {
        usdTop.classList.remove("error-animation");
      }, 1600);
    }
  } else if (element === "eur-top") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      eurTop.classList.add("error-animation");
      setTimeout(function() {
        eurTop.classList.remove("error-animation");
      }, 1600);
    }
  } else if (element === "btc-bottom") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      btcBottom.classList.add("error-animation");
      setTimeout(function() {
        btcBottom.classList.remove("error-animation");
      }, 1600);
    }
  } else if (element === "sat-bottom") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      satBottom.classList.add("error-animation");
      setTimeout(function() {
        satBottom.classList.remove("error-animation");
      }, 1600);
    }
  } else if (element === "usd-bottom") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      usdBottom.classList.add("error-animation");
      setTimeout(function() {
        usdBottom.classList.remove("error-animation");
      }, 1600);
    }
  } else if (element === "eur-bottom") {
    if (document.querySelectorAll(".error-animation").length < 1) {
      eurBottom.classList.add("error-animation");
      setTimeout(function() {
        eurBottom.classList.remove("error-animation");
      }, 1600);
    }
  }
};

// Navigation
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  // up arrow
  if (e.keyCode == "38") {
    if (
      checkInBoundSelection(
        parseInt(localStorage.getItem("currency-top-counter")) - 1
      )
    ) {
      selectNewCurrency(
        parseInt(localStorage.getItem("currency-top-counter")) - 1,
        "top"
      );
    }
    // down arrow
  } else if (e.keyCode == "40") {
    if (
      checkInBoundSelection(
        parseInt(localStorage.getItem("currency-top-counter")) + 1
      )
    ) {
      selectNewCurrency(
        parseInt(localStorage.getItem("currency-top-counter")) + 1,
        "top"
      );
    }

    // left arrow
  } else if (e.keyCode == "37") {
    if (
      checkInBoundSelection(
        parseInt(localStorage.getItem("currency-bottom-counter")) - 1
      )
    ) {
      selectNewCurrency(
        parseInt(localStorage.getItem("currency-bottom-counter")) - 1,
        "bottom"
      );
    }

    // right arrow
  } else if (e.keyCode == "39") {
    if (
      checkInBoundSelection(
        parseInt(localStorage.getItem("currency-bottom-counter")) + 1
      )
    ) {
      selectNewCurrency(
        parseInt(localStorage.getItem("currency-bottom-counter")) + 1,
        "bottom"
      );
    }

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

checkInBoundSelection = newIndex => newIndex >= 1 && newIndex <= 4;

selectNewCurrency = (newIndex, panel) => {
  if (panel === "top") {
    if (newIndex == 1) {
      selectBTCTop();
    } else if (newIndex == 2) {
      if (selectionIsBlocked(newIndex, panel)) {
        if (newIndex > parseInt(localStorage.getItem("currency-top-counter"))) {
          selectUSDTop();
        } else if (
          newIndex < parseInt(localStorage.getItem("currency-top-counter"))
        ) {
          selectBTCTop();
        }
      } else {
        selectSATTop();
      }
    } else if (newIndex == 3) {
      if (selectionIsBlocked(newIndex, panel)) {
        if (newIndex > parseInt(localStorage.getItem("currency-top-counter"))) {
          selectEURTop();
        } else if (
          newIndex < parseInt(localStorage.getItem("currency-top-counter"))
        ) {
          selectSATTop();
        }
      } else {
        selectUSDTop();
      }
    } else if (newIndex == 4) {
      selectEURTop();
    }
  } else if (panel == "bottom") {
    if (newIndex == 1) {
      selectBTCBottom();
    } else if (newIndex == 2) {
      if (selectionIsBlocked(newIndex, panel)) {
        if (
          newIndex > parseInt(localStorage.getItem("currency-bottom-counter"))
        ) {
          selectUSDBottom();
        } else if (
          newIndex < parseInt(localStorage.getItem("currency-bottom-counter"))
        ) {
          selectBTCBottom();
        }
      } else {
        selectSATBottom();
      }
    } else if (newIndex == 3) {
      if (selectionIsBlocked(newIndex, panel)) {
        if (
          newIndex > parseInt(localStorage.getItem("currency-bottom-counter"))
        ) {
          selectEURBottom();
        } else if (
          newIndex < parseInt(localStorage.getItem("currency-bottom-counter"))
        ) {
          selectSATBottom();
        }
      } else {
        selectUSDBottom();
      }
    } else if (newIndex == 4) {
      selectEURBottom();
    }
  }
};

selectionIsBlocked = (newIndex, panel) => {
  if (panel === "top") {
    if (localStorage.getItem("currency-bottom") === "btc" && newIndex == 1) {
      return true;
    } else if (
      localStorage.getItem("currency-bottom") === "sat" &&
      newIndex == 2
    ) {
      return true;
    } else if (
      localStorage.getItem("currency-bottom") === "usd" &&
      newIndex == 3
    ) {
      return true;
    } else if (
      localStorage.getItem("currency-bottom") === "eur" &&
      newIndex == 4
    ) {
      return true;
    }
  } else if (panel === "bottom") {
    if (localStorage.getItem("currency-top") === "btc" && newIndex == 1) {
      return true;
    } else if (
      localStorage.getItem("currency-top") === "sat" &&
      newIndex == 2
    ) {
      return true;
    } else if (
      localStorage.getItem("currency-top") === "usd" &&
      newIndex == 3
    ) {
      return true;
    } else if (
      localStorage.getItem("currency-top") === "eur" &&
      newIndex == 4
    ) {
      return true;
    }
  }
  return false;
};

// Copy to clipboard
resultInput.addEventListener("click", () => {
  const textarea = document.createElement("textarea");
  const result = resultInput.value;

  if (!result) {
    return;
  } else {
    textarea.value = result;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
});

// Convertion

// Menu Overlay

amountInput.addEventListener("beforeinput", e => {
  if (e.target.value == "") {
    // e.target.value = 1;
  } else {
    triggerConvertion();
  }
});

triggerConvertion = () => {
  if (resultInput.value !== "") {
    if (localStorage.getItem("currency-top") === "btc") {
      if (localStorage.getItem("currency-bottom") === "sat") {
        resultInput.value = bitcoinToSatoshi(
          parseFloat(amountInput.value)
        ).toFixed(0);
      }
    } else if (localStorage.getItem("currency-top") === "sat") {
      if (localStorage.getItem("currency-bottom") === "btc") {
        resultInput.value = satoshiToBitcoin(
          parseFloat(amountInput.value)
        ).toLocaleString("en-US", {
          style: "decimal",
          currency: "USD",
          minimumFractionDigits: 8
        });
      }
    }
  }
};

// Price calculation
bitcoinToSatoshi = amountBitcoin => amountBitcoin * 100_000_000;

satoshiToBitcoin = amountSatoshi => amountSatoshi / 100_000_000;
