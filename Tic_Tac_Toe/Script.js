let buttons = document.querySelectorAll(".button");
let turn = true; //turn flipping.
const winConditons = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[3,4,6]];
let winChecker = (index) => {

}
buttons.forEach((buttons) => {
    buttons.addEventListener("click",() => {
        if(turn){
            buttons.innerText = "X";
            buttons.style.color = "rgb(114, 113, 113)";
            turn = false; //Now player 2's turn
        } else {
            buttons.innerText = "O";
            buttons.style.color = "rgba(204, 204, 204)";
            turn = true;//Now player 1's turn
        };
    });
});