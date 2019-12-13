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

let lastInputDot = 0;
let lastInputDelete = 0;
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

  // reset prices
  // localStorage.setItem("btc-usd", "");
  // localStorage.setItem("btc-eur", "");
  // localStorage.setItem("btc-usd-update", "");
  // localStorage.setItem("btc-eur-update", "");


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
  triggerConvertion();
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


spinTheArrowButtonInstant = () => {
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
};

spinTheArrowButtonShort = () => {
  refreshButton.click();
};

spinTheArrowButtonFetch = () => {
  if (document.querySelectorAll(".fa-spin").length < 1) {
    refreshSymbol.classList.add("fa-spin");
    refreshButton.classList.add("refresh-button-triggered");

    setTimeout(function() {
      refreshButton.classList.remove("refresh-button-triggered");
    }, 180);

    setTimeout(function() {
      refreshSymbol.classList.remove("fa-spin");
    }, 2500);
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

    // if . was pressed set lastInputDot to true so that inputBox can append it again
  } else if (e.keyCode == "190") {
    if (amountInputFocus) {
      lastInputDot = lastInputDot + 1;
    }

    // if delete was presses set lastInputDelete to check if a dot was deleted for example
  } else if (e.keyCode == "8") {
    if (amountInputFocus) {
      lastInputDelete = lastInputDelete + 1;
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

document.addEventListener("DOMContentLoaded", function() {
  amountInput.addEventListener("focusin", function() {
    amountInputFocus = true;
  });

  amountInput.addEventListener("focusout", function() {
    amountInputFocus = false;
  });
});

// Convertion
amountInput.addEventListener("input", e => {
  if (amountInput.value.length == 2) {
    amountInput.value = parseFloat(e.target.value, 10);
  }

  if (lastInputDot == 2 && lastInputDelete < 1) {
    resultInput.value = 0;
    amountInput.value = 0;
    lastInputDot = 0;
    lastInputDelete = 0;
  }

  if (e.target.value == "") {
    if (lastInputDot == 1) {
      if (
        lastInputDot == 1 &&
        lastInputDelete > 1 &&
        e.target.value.length > 1
      ) {
        resultInput.value = 0;
        amountInput.value = 0;
        lastInputDot = 0;
        lastInputDelete = 0;
      }
    }

    if (lastInputDot == 2) {
      if (lastInputDot == 2 && lastInputDelete < 1) {
        resultInput.value = 0;
        amountInput.value = 0;
        lastInputDot = 0;
        lastInputDelete = 0;
      } else if (lastInputDot == 2 && lastInputDelete > 1) {
        lastInputDot = lastInputDot - 1;
        lastInputDelete = 0;
      } else if (lastInputDot == 2) {
        lastInputDot = lastInputDot - 1;
        lastInputDelete = 0;
      } else {
        resultInput.value = 0;
        amountInput.value = 0;
        lastInputDot = 0;
        lastInputDelete = 0;
      }
    }

    if (lastInputDelete == 1) {
      resultInput.value = 0;
      amountInput.value = 0;
      lastInputDot = 0;
      lastInputDelete = 0;
    }
  } else {
    triggerConvertion();
  }
});

triggerConvertion = () => {
  if (resultInput.value !== "") {
    if (localStorage.getItem("currency-top") === "btc") {
      if (localStorage.getItem("currency-bottom") === "sat") {
        spinTheArrowButtonInstant();
        resultInput.value = bitcoinToSatoshi(
          parseFloat(amountInput.value)
        ).toFixed(0);
      } else if (localStorage.getItem("currency-bottom") === "usd") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-usd-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceUSD();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 3) {
                  localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 ? resultInput.value = bitcoinToUSD(amountInput.value) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = bitcoinToUSD(amountInput.value);
            }
        } else {
        spinTheArrowButtonFetch();
        getBitcoinPriceUSD();
        setTimeout(function() {
          if (localStorage.getItem("currency-bottom-counter") == 3) {
            localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 
            ? resultInput.value = bitcoinToUSD(amountInput.value) : resultInput.value = "Sorry broken"
            }
          }, 2500);
        }
      } else if (localStorage.getItem("currency-bottom") === "eur") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-eur-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceEUR();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 4) {
                  localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0 ? resultInput.value = bitcoinToEUR(amountInput.value) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = bitcoinToEUR(amountInput.value);
            }
        } else {
          spinTheArrowButtonFetch();
          getBitcoinPriceEUR();
          setTimeout(function() {
            if (localStorage.getItem("currency-bottom-counter") == 4) {
              localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 
              ? resultInput.value = bitcoinToEUR(amountInput.value) : resultInput.value = "Sorry broken";
            }
          }, 2500);
        }
      }
    } else if (localStorage.getItem("currency-top") === "sat") {
      if (localStorage.getItem("currency-bottom") === "btc") {
        spinTheArrowButtonInstant();
        if(amountInput.value.length >= 1) {resultInput.value = satoshiToBitcoin(
          parseFloat(amountInput.value)
        ).toFixed(8)}
      } else if (localStorage.getItem("currency-bottom") === "usd") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-usd-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceUSD();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 3) {
                  localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 ? resultInput.value = satoshiToUSD(amountInput.value) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = satoshiToUSD(amountInput.value);
            }
        } else {
        spinTheArrowButtonFetch();
        getBitcoinPriceUSD();
        setTimeout(function() {
          if (localStorage.getItem("currency-bottom-counter") == 3) {
            localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 
            ? resultInput.value = satoshiToUSD(amountInput.value) : resultInput.value = "Sorry broken"
            }
          }, 2500);
        }
      } else if (localStorage.getItem("currency-bottom") === "eur") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-eur-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceEUR();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 4) {
                  localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0 ? resultInput.value = satoshiToEUR(amountInput.value) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = satoshiToEUR(amountInput.value);
            }
        } else {
          spinTheArrowButtonFetch();
          getBitcoinPriceEUR();
          setTimeout(function() {
            if (localStorage.getItem("currency-bottom-counter") == 4) {
              localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 
              ? resultInput.value = satoshiToEUR(amountInput.value) : resultInput.value = "Sorry broken";
            }
          }, 2500);
        }
      }
    } else if (localStorage.getItem("currency-top") === "usd") {
      if (localStorage.getItem("currency-bottom") === "btc") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-usd-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceUSD();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 1) {
                  localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 ? resultInput.value = usdToBitcoin(amountInput.value).toFixed(8) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = usdToBitcoin(amountInput.value).toFixed(8);
            }
        } else {
        spinTheArrowButtonFetch();
        getBitcoinPriceUSD();
        setTimeout(function() {
          if (localStorage.getItem("currency-bottom-counter") == 1) {
            localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 
            ? resultInput.value = usdToBitcoin(amountInput.value).toFixed(8) : resultInput.value = "Sorry broken"
            }
          }, 2500);
        }
      } else if (localStorage.getItem("currency-bottom") === "sat") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-usd-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceUSD();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 2) {
                  localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 ? resultInput.value = usdToSatoshi(amountInput.value).toFixed(0) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = usdToSatoshi(amountInput.value).toFixed(0);
            }
        } else {
        spinTheArrowButtonFetch();
        getBitcoinPriceUSD();
        setTimeout(function() {
          if (localStorage.getItem("currency-bottom-counter") == 2) {
            localStorage.getItem("btc-usd-update") !== null && localStorage.getItem("btc-usd-update").length > 0 
            ? resultInput.value = usdToSatoshi(amountInput.value).toFixed(0) : resultInput.value = "Sorry broken"
            }
          }, 2500);
        }
      } else if (localStorage.getItem("currency-bottom") === "eur") {
        console.log("Not yet implemented")
      }
    } else if (localStorage.getItem("currency-top") === "eur") {
      if (localStorage.getItem("currency-bottom") === "btc") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-eur-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceEUR();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 1) {
                  localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0 ? resultInput.value = eurToBitcoin(amountInput.value).toFixed(8) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = eurToBitcoin(amountInput.value).toFixed(8);
            }
        } else {
        spinTheArrowButtonFetch();
        getBitcoinPriceEUR();
        setTimeout(function() {
          if (localStorage.getItem("currency-bottom-counter") == 1) {
            localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eurupdate").length > 0 
            ? resultInput.value = eurToBitcoin(amountInput.value).toFixed(8) : resultInput.value = "Sorry broken"
            }
          }, 2500);
        }
      } else if (localStorage.getItem("currency-bottom") === "sat") {
        resultInput.value = 0;
        killId();

        if(localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0) {
            if (moreThanOneHourAgo(Date.parse(localStorage.getItem("btc-eur-update")))) {
              spinTheArrowButtonFetch();
              getBitcoinPriceEUR();
              setTimeout(function() {
                if (localStorage.getItem("currency-bottom-counter") == 2) {
                  localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0 ? resultInput.value = eurToSatoshi(amountInput.value) : resultInput.value = "Sorry broken"
                }
              }, 2500);
            } else {
              spinTheArrowButtonInstant();
              resultInput.value = eurToSatoshi(amountInput.value);
            }
        } else {
        spinTheArrowButtonFetch();
        getBitcoinPriceEUR();
        setTimeout(function() {
          if (localStorage.getItem("currency-bottom-counter") == 2) {
            localStorage.getItem("btc-eur-update") !== null && localStorage.getItem("btc-eur-update").length > 0 
            ? resultInput.value = eurToSatoshi(amountInput.value) : resultInput.value = "Sorry broken"
            }
          }, 2500);
        }
      } else if (localStorage.getItem("currency-bottom") === "usd") {
        console.log("Not yet implemented")
      }


    }
  }
};

// Check if last fetch was within last hour
const moreThanOneHourAgo = (date) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
}

killId = () => setTimeout(function() {
  for (var i = killId; i > 0; i--) clearInterval(i)
}, 50);

// Fetch prices
getBitcoinPriceUSD = () => {
  fetch("https://api.nomics.com/v1/currencies/ticker?key=b82411a497a3238f3d1196dbee2f251b&ids=BTC&interval=1h&convert=USD")
  .then(response => response.json())
  .then(data => {
    localStorage.setItem("btc-usd", parseFloat(data[0].price).toFixed(2));
    localStorage.setItem("btc-usd-update", Date.now());
    }
  );
};

getBitcoinPriceEUR = () => {
  fetch("https://api.nomics.com/v1/currencies/ticker?key=b82411a497a3238f3d1196dbee2f251b&ids=BTC&interval=1h&convert=EUR")
  .then(response => response.json())
  .then(data => {
    localStorage.setItem("btc-eur", parseFloat(data[0].price).toFixed(2));
    localStorage.setItem("btc-eur-update", Date.now());
    }
  );
};

// Price calculation
bitcoinToSatoshi = amountBitcoin => amountBitcoin * 100_000_000;
bitcoinToUSD = amountBitcoin => roundNumber(amountBitcoin * parseFloat(localStorage.getItem("btc-usd")), 2);
bitcoinToEUR = amountBitcoin => roundNumber(amountBitcoin * parseFloat(localStorage.getItem("btc-eur")), 2);

satoshiToBitcoin = amountSatoshi => amountSatoshi / 100_000_000;
satoshiToUSD = amountSatoshi => roundNumber((amountSatoshi / 100_000_100) * parseFloat(localStorage.getItem("btc-usd")), 8);
satoshiToEUR = amountEuro => roundNumber((amountEuro / 100_000_000) * parseFloat(localStorage.getItem("btc-eur")), 8);

usdToBitcoin= amountUSD => amountUSD / parseFloat(localStorage.getItem("btc-usd"));
usdToSatoshi= amountEuro => amountEuro / (parseFloat(localStorage.getItem("btc-usd")) / 100_000_000);
usdToEUR = amountEuro => roundNumber(amountEuro * parseFloat(localStorage.getItem("usd-eur")), 2);

eurToBitcoin = amountEuro => amountEuro / parseFloat(localStorage.getItem("btc-eur"));
eurToSatoshi= amountEuro => (amountEuro / (parseFloat(localStorage.getItem("btc-eur")) / 100_000_000));
eurToUSD = amountEuro => roundNumber(amountEuro / parseFloat(localStorage.getItem("usd-eur")), 2);

// Rounding

 // ROUNDING Math
function roundNumber(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}