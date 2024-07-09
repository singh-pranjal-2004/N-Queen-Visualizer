let N = 5;
let board = Array.from({ length: N }, () => Array(N).fill(0));
let solutions = [];
let isVisualizing = false;
let visualizationDelay = 100; // Initial delay in milliseconds
let stopVisualization = false;

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.style.gridTemplateColumns = `repeat(${N}, 50px)`;
    boardElement.innerHTML = '';

    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            cell.id = `cell-${row}-${col}`;
            boardElement.appendChild(cell);
        }
    }
}

function placeQueen(row, col, action) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    switch (action) {
        case 'checking':
            cell.style.backgroundColor = 'red';
            break;
        case 'placing':
            cell.style.backgroundColor = 'goldenrod';
            const queen = document.createElement('img');
            queen.src = 'queen.png';
            queen.classList.add('queen');
            cell.appendChild(queen);
            break;
        case 'removing':
            cell.style.backgroundColor = '';
            cell.innerHTML = '';
            cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            break;
        case 'safe':
            cell.style.backgroundColor = '';
            cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            break;
    }
}

function isSafe(board, row, col) {
    for (let i = 0; i < col; i++) {
        if (board[row][i]) return false;
    }

    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j]) return false;
    }

    for (let i = row, j = col; i < N && j >= 0; i++, j--) {
        if (board[i][j]) return false;
    }

    return true;
}

async function solveNQueensUtil(board, col) {
    if (stopVisualization) return;

    if (col >= N) {
        const solution = board.map(row => row.slice());
        solutions.push(solution);
        displaySolution(solution);
        return;
    }

    for (let i = 0; i < N; i++) {
        placeQueen(i, col, 'checking');
        await new Promise(resolve => setTimeout(resolve, visualizationDelay));

        if (isSafe(board, i, col)) {
            board[i][col] = 1;
            placeQueen(i, col, 'placing');
            await new Promise(resolve => setTimeout(resolve, visualizationDelay));

            await solveNQueensUtil(board, col + 1);

            board[i][col] = 0;
            placeQueen(i, col, 'removing');
            await new Promise(resolve => setTimeout(resolve, visualizationDelay));
        } else {
            placeQueen(i, col, 'safe');
            await new Promise(resolve => setTimeout(resolve, visualizationDelay));
        }
    }
}

function displaySolution(solution) {
    const solutionsElement = document.getElementById('solutions');
    const solutionBoard = document.createElement('div');
    solutionBoard.classList.add('solution-board');
    solutionBoard.style.gridTemplateColumns = `repeat(${N}, 30px)`;

    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            const cell = document.createElement('div');
            cell.classList.add('solution-cell');
            cell.classList.add((row + col) % 2 === 0 ? 'solution-white' : 'solution-black');
            if (solution[row][col] === 1) {
                const queen = document.createElement('img');
                queen.src = 'queen.png';
                queen.classList.add('solution-queen');
                cell.appendChild(queen);
            }
            solutionBoard.appendChild(cell);
        }
    }

    solutionsElement.appendChild(solutionBoard);
}

async function startVisualization() {
    stopVisualization = false;
    solutions = [];
    N = parseInt(document.getElementById('num-queens').value);
    visualizationDelay = 1000 - parseInt(document.getElementById('speed').value); // Inverted speed
    board = Array.from({ length: N }, () => Array(N).fill(0));
    createBoard();
    document.getElementById('solutions').innerHTML = '';
    isVisualizing = true;
    await solveNQueensUtil(board, 0);
    isVisualizing = false;
    if (solutions.length > 0) {
        alert(`Found ${solutions.length} solutions`);
    } else {
        alert('No solution found');
    }
}

function resetBoard() {
    stopVisualization = true;
    solutions = [];
    N = parseInt(document.getElementById('num-queens').value);
    board = Array.from({ length: N }, () => Array(N).fill(0));
    createBoard();
    document.getElementById('solutions').innerHTML = '';
}

document.getElementById('num-queens').addEventListener('input', () => {
    resetBoard();
});

document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// Real-time speed controller
document.getElementById('speed').addEventListener('input', () => {
    visualizationDelay = 1000 - parseInt(document.getElementById('speed').value); // Update delay based on speed input
});

// Set default to dark mode
document.body.classList.add('dark-mode');

createBoard();
