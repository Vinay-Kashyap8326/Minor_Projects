let buttons = document.querySelectorAll(".button");
let msg = document.querySelector(".status p");
let turn = true; //turn flipping.
const winConditons = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6]];
let winChecker = () => {
  for (let i of winConditons) {
    let pos1 = buttons[i[0]].innerText;
    let pos2 = buttons[i[1]].innerText;
    let pos3 = buttons[i[2]].innerText;
    if (pos1 != "" && pos2 != "" && pos3 != "") {
      if (pos1 === pos2 && pos2 === pos3) {
        msg.innerText = `Winner Is ${pos1}`;
      }
    }
  }
}
buttons.forEach((buttons) => {
  buttons.addEventListener("click", () => {
    if (turn) {
      buttons.innerText = "X";
      buttons.style.color = "rgb(114, 113, 113)";
      turn = false; //Now player O turn
    } else {
      buttons.innerText = "O";
      buttons.style.color = "rgba(204, 204, 204)";
      turn = true; //Now player X turn
    };
    buttons.disabled = true;
    winChecker();
  });
});