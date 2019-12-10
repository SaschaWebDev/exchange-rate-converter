// DOM Elements
const body = document.body;
const container = document.querySelector(".container");
const date = document.querySelector(".date");

// Get current date
let today = new Date();
let day = String(today.getDate()).padStart(2, "0");
let year = today.getFullYear();
let month = today.toLocaleString("default", { month: "long" });

window.onload = () => {
  date.innerHTML = month.substring(0, 3) + " " + day + ", " + year;
};
