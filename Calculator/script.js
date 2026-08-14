let numberButtons = document.querySelectorAll(".numbers");
let output = document.querySelector("#inputArea");
let clearButton = document.querySelector(".Clear");
let deleteButton = document.querySelector(".delete");
let count = 0;
let deleteHistory = [1, 2, 3];
numberButtons.forEach((num) => {
  num.addEventListener("click", () => {
    if (count < 15) {
      for (let i = 0; i < 4; i++) {
        output.innerText = i;
      };
      count++;
    } else {
      alert("Can't enter more than 15 digits");
    };
  });
});
console.log(deleteHistory);
clearButton.addEventListener("click", () => {
  output.innerText = "";
  count = 0;
});