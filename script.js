// script.js

const N = 5;
let board = Array.from({ length: N }, () => Array(N).fill(0));
let solutions = [];
let isVisualizing = false;
const visualizationDelay = 100; // in milliseconds

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

function placeQueen(row, col, isPlacing) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (isPlacing) {
        const queen = document.createElement('img');
        queen.src = 'queen.png';
        queen.classList.add('queen');
        cell.appendChild(queen);
    } else {
        cell.innerHTML = '';
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
    if (col >= N) {
        const solution = board.map(row => row.slice());
        solutions.push(solution);
        displaySolution(solution);
        return;
    }

    for (let i = 0; i < N; i++) {
        if (isSafe(board, i, col)) {
            board[i][col] = 1;
            if (isVisualizing) {
                placeQueen(i, col, true);
                await new Promise(resolve => setTimeout(resolve, visualizationDelay));
            }

            await solveNQueensUtil(board, col + 1);

            board[i][col] = 0;
            if (isVisualizing) {
                placeQueen(i, col, false);
                await new Promise(resolve => setTimeout(resolve, visualizationDelay));
            }
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

function startVisualization() {
    solutions = [];
    board = Array.from({ length: N }, () => Array(N).fill(0));
    createBoard();
    document.getElementById('solutions').innerHTML = '';
    isVisualizing = true;
    solveNQueensUtil(board, 0).then(() => {
        isVisualizing = false;
        if (solutions.length > 0) {
            alert(`Found ${solutions.length} solutions`);
        } else {
            alert('No solution found');
        }
    });
}

createBoard();
