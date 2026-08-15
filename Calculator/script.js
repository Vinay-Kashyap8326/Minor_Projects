let numberButtons = document.querySelectorAll(".numbers");
let output = document.querySelector("#inputArea");
let clearButton = document.querySelector(".Clear");
let operators = document.querySelectorAll(".operators");
let count = 0;
let inputArray = [];
let enable = (button) => {
  button.forEach((element) => {
    button.disabled = false;
  });
};
numberButtons.forEach((num) => {
  num.addEventListener("click", () => {
    if (count < 15) {
      inputArray.push(num.innerText);
      output.innerText = inputArray.join('');
      count++;
    } else {
      alert("Can't enter more than 15 digits");
    };
  });
});
operators.forEach((opt) => {
  opt.addEventListener("click",
    () => {
      if (output.innerText !== "") {
        output.innerText += opt.innerText;
        inputArray.push(opt.innerText);
        opt.disabled = true;
      };
    });
});
clearButton.addEventListener("click", () => {
  output.innerText = "";
  count = 0;
  inputArray.length = 0;
});