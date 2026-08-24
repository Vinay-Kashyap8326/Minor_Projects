let numberButtons = document.querySelectorAll(".numbers");
let output = document.querySelector("#inputArea");
let clearButton = document.querySelector(".Clear");
let operators = document.querySelectorAll(".operators");
let deleteButton = document.querySelector(".delete");
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
        let inputArrayInString = inputArray.toString();
        let checkOpt = inputArrayInString[inputArrayInString.length-1];
        if (checkOpt === '+' || checkOpt === '-' || checkOpt === '×' || checkOpt === '÷') {
          inputArray.splice(inputArray.length-1, 1, opt.innerText);
          output.innerText = inputArray.join('');
          opt.disabled = true;
        } else {
          for(let btn of operators){
            btn.disabled = false;
          }
          output.innerText += opt.innerText;
          inputArray.push(opt.innerText);
          opt.disabled = true;
        };
      };
    });
});
clearButton.addEventListener("click", () => {
  output.innerText = "";
  count = 0;
  inputArray.length = 0;
});
xgixgixfux