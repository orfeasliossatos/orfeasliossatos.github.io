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
        square.addEventListener("click", placeQueen);
        board.appendChild(square);
    }
}

function computeBackgroundColor(row, col) {
    return ((row+col) % 2 == 1) ? '#ddd' : '#fffcf2';
}

// Function to move queens
function placeQueen(event) {
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

// DFBT
let DFBTboard = document.getElementById("DFBTboard");
let DFBTsols = document.getElementById("DFBTsols")
var isDark = false;
let DFBTsquares = []
DFBTboardSize = 4

// Create the chessboard
for (let i = 0; i < DFBTboardSize; i++) {
    for (let j = 0; j < DFBTboardSize; j++) {
        let square = document.createElement("div");
        square.className = "DFBTsquare";
        square.dataset.row = i;
        square.dataset.col = j;
        DFBTsquares.push(square)
        square.style.backgroundColor = computeBackgroundColor(i, j)
        DFBTboard.appendChild(square);
    }
}

DFBTboardState = [-1,-1,-1,-1]
DFBTfinished = false
currCol = 0
solCount = 0
prevFoundSolution = false

// Perform one step of the DFBT algorithm, 
function DFBTstep() {

    if (DFBTfinished) { return; }


    // Recompute square colours
    if (prevFoundSolution) {
        prevFoundSolution != prevFoundSolution
        for (let i=0; i < DFBTsquares.length; i++) {
            let otherRow = parseInt(DFBTsquares[i].dataset.row);
            let otherCol = parseInt(DFBTsquares[i].dataset.col);
            DFBTsquares[i].style.backgroundColor = computeBackgroundColor(otherRow, otherCol);
        }
    }

    // Increment queen at current column
    DFBTboardState[currCol] += 1
    currRow = DFBTboardState[currCol]

    if (currRow == DFBTboardSize) {
        DFBTboardState[currCol] = -1
        currCol -= 1
        
        if (currCol == -1) {
            DFBTfinished = true;
            DFBTsols.textContent = "Finished. Solutions found:  " + solCount
        }

    } else {

        // Check valid board?
        let valid = true
        for (let i = 0; i < currCol; i++) {
            otherRow = DFBTboardState[i]
            otherCol = i
            if (currRow == otherRow || otherRow + otherCol === currRow + currCol || otherRow - otherCol === currRow - currCol) {
                valid = false
                break;
            }
        }

        // If valid, go to next column
        if (valid) {
            currCol += 1

            // If final column, a solution has been found
            if (currCol == DFBTboardSize) {
                solCount += 1
                currCol -= 1

                // Update graphical solution count
                DFBTsols.textContent = "Solutions found: " + solCount

                // Turn squares green
                for (let i=0; i < DFBTsquares.length; i++) {
                    DFBTsquares[i].style.backgroundColor = "#8FBC8F";
                }
                
                // Mark this flag to draw back original colors
                prevFoundSolution = true
            }
        }
    
    }

    // Undraw the queens
    for (let i = 0; i < DFBTsquares.length; i++) {
        DFBTsquares[i].textContent=""
    }

    // Redraw queens
    for (let i = 0; i <= currCol; i++) {
        thatRow = DFBTboardState[i]
        if (thatRow != -1) {
            DFBTsquares[i+DFBTboardSize*thatRow].textContent = "♕";            
        }
    }

    
}

function DFBTreset() {
    DFBTfinished = false;
    DFBTboardState = [-1,-1,-1,-1]

    for (let i = 0; i < DFBTboardSize*DFBTboardSize; i++) {
        DFBTsquares[i].textContent=""
    }

    DFBTsols.textContent = "Solutions found: 0"
    currCol = 0
    solCount = 0
}