const colorHex = document.getElementById("colorHex");
const btn = document.getElementById("btn");
const bgColor = document.querySelector("form");

btn.addEventListener("click", changeColor);

function changeColor() {
  let valores = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * valores.length);
    color+=valores[index];
  }

  colorHex.innerText = color;
  bgColor.style.backgroundColor = color;
}