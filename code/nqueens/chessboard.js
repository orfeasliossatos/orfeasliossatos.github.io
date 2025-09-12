// WARNING ! Ugly code ahead. I don't know Javascript.

///// First visual - 8 QUEENS //// 
let board = document.getElementById("8queens");
let queens = [];
let squares = [];


// Create the chessboard
createChessboard(8, board, squares);
for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", placeQueen);
}

function createChessboard(n, board, squares) {
    for (let i = 0; i < n; i++) {
	for (let j = 0; j < n; j++) {
	    let square = document.createElement("div");
	    square.className = "square";
	    square.dataset.row = i;
	    square.dataset.col = j;
	    square.style.backgroundColor = computeBackgroundColor(i, j);
	    squares.push(square);
	    board.appendChild(square);
	}
    }
}

function recomputeColors(squares) {
    for (let i = 0; i < squares.length; i++) {
	let otherRow = parseInt(DFBTsquares[i].dataset.row);
	let otherCol = parseInt(DFBTsquares[i].dataset.col);
	squares[i].style.backgroundColor = computeBackgroundColor(otherRow, otherCol);
    }
}

function computeBackgroundColor(row, col) {
    return ((row+col) % 2 == 1) ? '#c3c393' : '#fffcf2';
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
        for (let i=0; i < squares.length; i++) {
            squares[i].style.backgroundColor = "#8FBC8F";
        }
    }
}

//// Second visual : DFBT ////
let DFBTboard = document.getElementById("DFBTboard");
let DFBTsols = document.getElementById("DFBTsols")
let DFBTsquares = []
let DFBTboardSize = 4

// Create the chessboard
createChessboard(4, DFBTboard, DFBTsquares);

let DFBTboardState = [-1,-1,-1,-1]
let DFBTfinished = false
let currCol = 0
let solCount = 0
let DFBTrepaint = false


// Perform one step of the DFBT algorithm, 
function DFBTstep() {

    if (DFBTfinished) { return; }

    // Recompute square colours
    recomputeColors(DFBTsquares)

    // Color all safe columns green
    for (let i = 0; i < DFBTsquares.length; i++) {
	let otherCol = parseInt(DFBTsquares[i].dataset.col);
	if (otherCol < currCol) 
	    DFBTsquares[i].style.backgroundColor = "#8FBC8F";
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
                
            }
        } else {
	
	    // Turn squares red
	    for (let i=0; i < DFBTsquares.length; i++) {
		let thatRow = parseInt(DFBTsquares[i].dataset.row);
		let thatCol = parseInt(DFBTsquares[i].dataset.col)
		if ((currRow == otherRow && thatRow == currRow)
		    || (currRow + currCol == otherRow + otherCol 
			&& thatRow + thatCol == currRow + currCol)
		    || (otherRow - otherCol == currRow - currCol
			&& otherRow - otherCol == thatRow - thatCol))
		    DFBTsquares[i].style.backgroundColor = "#d57676"
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

    recomputeColors(DFBTsquares)

    DFBTsols.textContent = "Solutions found: 0"
    currCol = 0
    solCount = 0
}


//// Third visual Monte Carlo ////
let MCboard = document.getElementById("MCboard");
let MCsols = document.getElementById("MCsols")
let MCsquares = []

// Create the chessboard
createChessboard(4, MCboard, MCsquares);

let MCboardState = [0, 1, 2, 3]
let MCsolCount = 0
let MCtotCount = 0
let MCdoResetColors = false

// From mwsundberg, Laurens Holst https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
} 

function MCrandom(T) {

    if (MCdoResetColors) {
	MCdoResetColors = false
	recomputeColors(MCsquares)
    }

    for (let t = 0; t < T; t++) {
	shuffleArray(MCboardState)

	MCtotCount++

	// Undraw queens
	for (let i = 0; i < MCsquares.length; i++) {
	    MCsquares[i].textContent=""
	}

	// Redraw queens
	for (let i = 0; i < 4; i++) {
	    let r = MCboardState[i]
	    MCsquares[i+4*r].textContent = "♕"       
	}
	// Check validity using new O(n) algorithm
	let MCsafe = true
	let diag_add = [0, 0, 0, 0, 0, 0, 0]
	let diag_sub = [0, 0, 0, 0, 0, 0, 0]

	for (let c = 0; c < 4; c++) {
	    let r = MCboardState[c];
	    let a = r + c
	    let b = 3 + r - c
	    if (diag_add[a] == MCtotCount || diag_sub[b] == MCtotCount) {
		MCsafe = false
	    }
	    diag_add[a] = MCtotCount
	    diag_sub[b] = MCtotCount
	}
	if (MCsafe) {
	    MCsolCount++;

	    if (t == T-1) {
		for (let i=0; i < MCsquares.length; i++) {
		    MCsquares[i].style.backgroundColor = "#8FBC8F";
		}
		MCdoResetColors = true
	    }
	}

	if (t == T-1) {
	    let p = MCsolCount / MCtotCount

	    // Update legend with MC info
	    MCsols.textContent = "Estimate: (" + MCsolCount.toString() + " / " + MCtotCount.toString() + ") x 4!" + " = " + (24 * p).toFixed(3).toString()
	}
    }
}

MCrandom(1)

///// Fourth visual : Boltzmann Function /////
const boltzmannCtx = document.getElementById('BoltzmannChart');

const allPermutations = [
    [0, 1, 2, 3],
    [0, 1, 3, 2],
    [0, 2, 1, 3],
    [0, 2, 3, 1],
    [0, 3, 1, 2],
    [0, 3, 2, 1],
    [1, 0, 2, 3],
    [1, 0, 3, 2],
    [1, 2, 0, 3],
    [1, 2, 3, 0],
    [1, 3, 0, 2],
    [1, 3, 2, 0],
    [2, 0, 1, 3],
    [2, 0, 3, 1],
    [2, 1, 0, 3],
    [2, 1, 3, 0],
    [2, 3, 0, 1],
    [2, 3, 1, 0],
    [3, 0, 1, 2],
    [3, 0, 2, 1],
    [3, 1, 0, 2],
    [3, 1, 2, 0],
    [3, 2, 0, 1],
    [3, 2, 1, 0]
];

const labelRange = Array.from({length: 24}, (_, i) => (i+1).toString());
var boltzmannImage = new Array(24).fill(1);
var boltzmannEnergy = new Array(24);

for (let i=0; i < 24; i++)
    boltzmannEnergy[i] = energy(allPermutations[i]);

const boltzmannBetaSlider = document.getElementById("BoltzmannBetaSlider");
const boltzmannBetaSliderValue = document.getElementById("BoltzmannBetaSliderValue");

var boltzmannChart = new Chart(boltzmannCtx, {
    type: 'bar',
    data: {
	labels: labelRange,
	datasets: [
	    {
		label: 'exp(-βf(X))',
		data: boltzmannImage,
		borderColor: 'rgba(0,0,0,1)',
		borderWidth: 2,
		backgroundColor: 'rgba(0,0,0,0)',
		borderSkipped: false
	    }
	]	
    },
    
    options: {
	responsive: true,
	plugins: {
	    tooltip: {
		callbacks: {
		    title: (items) => {
			return ""
		    },
		    afterLabel: (item) => {
			return 'X=['+allPermutations[item.dataIndex].join(",") + ']';
		    }
		}
	    }
	},
    }
});

function pairs(k) {
    return k * (k - 1) / 2; 
}

function energy(permutation) {
    let diags = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    for (let c = 0; c < 4; c++) {
	let r = permutation[c];
	diags[r+c] += 1;
	diags[10+r-c] += 1;
    }

    let threats = 0;
    for (let d = 0; d < 14; d++) {
	threats += pairs(diags[d]);
    }

    return threats;
}

boltzmannBetaSlider.addEventListener("input", () => {
    const beta = boltzmannBetaSlider.value;
    boltzmannBetaSliderValue.textContent = beta;
    for (let i = 0; i < 24; i++) {
	boltzmannImage[i] = Math.exp(-beta * boltzmannEnergy[i]);
    }
    boltzmannChart.update();
});

///// Fifth visual : Hot Markov Chain /////
let swapBoard = document.getElementById("Swapboard");
let swapSquares = []
createChessboard(4, swapBoard, swapSquares);
let swapBoardState = [0, 1, 2, 3]

function swapRandom() {

    // Pick two columns at random
    var a = Math.floor(Math.random() * 4)
    do {
	var b = Math.floor(Math.random() * 4)
    } while (a == b);
    
    // Swap the queens' rows
    let tmp = swapBoardState[a]
    swapBoardState[a] = swapBoardState[b]
    swapBoardState[b] = tmp

    // Show which columns were chosen
    for (let i = 0; i < swapSquares.length; i++) {
	let r = parseInt(swapSquares[i].dataset.row)
	let c = parseInt(swapSquares[i].dataset.col)
	swapSquares[i].style.backgroundColor = computeBackgroundColor(r, c)
	if (c == a || c == b) 
	    swapSquares[i].style.backgroundColor = "#8FBC8F";
    }

    // Undraw queens
    for (let i = 0; i < swapSquares.length; i++) {
	swapSquares[i].textContent=""
    }

    // Redraw queens
    for (let i = 0; i < 4; i++) {
	let r = swapBoardState[i]
	swapSquares[i+4*r].textContent = "♕"       
    }
}

swapRandom()


///// Sixth visual : Metropolis algorithm histograms /////
let MplsBoards = [[0, 1, 2, 3],[0, 1, 2, 3]]
let MplsHistos = [new Array(24).fill(0), new Array(24).fill(0)]
let betas = [0, 3]
let energies = [pairs(4), pairs(4)]

// Two buffers to test swaps without committing.
let MplsDiags = [[1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 4, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 4, 0, 0, 0]]


const ctx = document.getElementById('MplsChart');

var chart = new Chart(ctx, {
    type: 'bar',
    data: {
	labels: labelRange,
	datasets: [
	    {
		label: 'hot (β=0)',
		data: MplsHistos[0],
		backgroundColor: 'rgba(255, 55, 55, 1)' // red
	    },
	    {
		label: 'colder (β=3)',
		data: MplsHistos[1],
		backgroundColor: 'rgba(55, 55, 255, 1)' // 
	    },
	]	
    },
    
    options: {
	responsive: true,
	plugins: {
	    tooltip: {
		enabled: false
	    }
	},
    }
});

//https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript 
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
	if (a[i] !== b[i]) return false;
    }
    return true;
}

function permToIndex(board) {
    for (let i=0; i<24; i++) {
	if (arraysEqual(board, allPermutations[i])) {
	    return i;
	}
    }
}


function stepMetropolis(M) {
    
    for (let i = 0; i < M; i++) {
	for (let k = 0; k < 2; k++) {
	    
	    let idx = permToIndex(MplsBoards[k])
	    MplsHistos[k][idx] += 1

	    // Pick two columns at random
	    const c1 = Math.floor(Math.random() * 4)
	    const c2 = (c1 + 1 + Math.floor(Math.random() * 3)) % 4;
	    const r1 = MplsBoards[k][c1];
	    const r2 = MplsBoards[k][c2]; 

	    // Queens 1, 2 before swap
	    const a1 = r1 + c1
	    const b1 = 10 + r1 - c1
	    const a2 = r2 + c2
	    const b2 = 10 + r2 - c2
	    const a1p = r2 + c1 
	    const b1p = 10 + r2 - c1
	    const a2p = r1 + c2
	    const b2p = 10 + r1 - c2

	    const diag_idxs = [a1, b1, a2, b2, a1p, b1p, a2p, b2p];
	    const diag_deltas = [-1, -1, -1, -1, 1, 1, 1, 1];
	    let diag_read = [false, false, false, false, false, false, false, false];
	    // Combine duplicates (some indices overlap)
	    let total_delta = 0;
	    for (let i = 0; i < 8; i++) {
		if (diag_read[i]) continue;
		const idx = diag_idxs[i];
		let delta = diag_deltas[i];

		// Absorb duplicates
		for (let j = i+1; j < 8; j++) {
		    if (diag_idxs[j] == idx && !diag_read[j]) {
			delta += diag_deltas[j];
			diag_read[j] = true;
		    }
		}

		// No overall change
		if (delta == 0) continue;

		const d_old = MplsDiags[k][idx];
		const d_new = d_old + delta;
		total_delta += pairs(d_new) - pairs(d_old);
	    }

	    const next_energy = energy[k] + total_delta;
	    const accept_prob = Math.min(1, Math.exp(-betas[k] * total_delta));

	    if (Math.random() < accept_prob) {

		// Actually perform swap
		let tmp = MplsBoards[k][c1]
		MplsBoards[k][c1] = MplsBoards[k][c2]
		MplsBoards[k][c2] = tmp

		energies[k] = next_energy;

		for (let d = 0; d < 8; d++) {
		    MplsDiags[k][diag_idxs[d]] += diag_deltas[d]; 
		}
	    } 
	}	
    }
    chart.update();
}
