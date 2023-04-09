let board = document.getElementById("chessboard");
var isDark = false;
let queens = [];

// Create the chessboard
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        let square = document.createElement("div");
        square.className = "square";
        square.dataset.row = i;
        square.dataset.col = j;
        square.style.backgroundColor = computeBackgroundColor(i, j)
        square.addEventListener("click", moveQueen);
        board.appendChild(square);
    }
}

function computeBackgroundColor(row, col) {
    return ((row+col) % 2 == 1) ? '#ddd' : '#fffcf2';
}

// Function to move queens
function moveQueen(event) {
    let square = event.target;
    let row = parseInt(square.dataset.row);
    let col = parseInt(square.dataset.col);

    // If square is empty, place a queen
    if (!queens.some(queen => queen.row === row || queen.col === col || queen.row + queen.col === row + col || queen.row - queen.col === row - col)) {
        queens.push({row: row, col: col});
        square.textContent = "♕";
    }
    // If square contains a queen, remove it
    else {
        queens = queens.filter(queen => queen.row !== row || queen.col !== col);
        square.textContent = "";
    }

    // Recompute square colours
    let squares = document.getElementsByClassName("square");
    for (let i=0; i < squares.length; i++) {
        let otherRow = parseInt(squares[i].dataset.row);
        let otherCol = parseInt(squares[i].dataset.col);
        squares[i].style.backgroundColor = computeBackgroundColor(otherRow, otherCol);

        for (let j = 0; j < queens.length; j++) {        
            let queen = queens[j]
            if (otherRow === queen.row || otherCol === queen.col || otherRow + otherCol === queen.row + queen.col || otherRow - otherCol === queen.row - queen.col) {
                squares[i].style.backgroundColor = "#d57676";
            }
        }
    }

    // If number of queens is eight, turn all colours to green
    if (queens.length == 8) {
        let squares = document.getElementsByClassName("square");
        for (let i=0; i < squares.length; i++) {
            squares[i].style.backgroundColor = "#8FBC8F";
        }
    }
}