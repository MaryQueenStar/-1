const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');

let boardState = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
const HUMAN = 'X';
const ROBOT = 'O';

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // по горизонтали
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // по вертикали
    [0, 4, 8], [2, 4, 6]             // по диагонали
];

function checkWinner() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    if (!boardState.includes('')) return 'Draw';
    return null;
}

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    // Ход человека
    if (boardState[index] === '' && isGameActive) {
        makeMove(index, HUMAN);
        cell.classList.add(HUMAN);
        
        let result = checkWinner();
        if (result) {
            endGame(result);
        } else {
            // Ход робота
            statusElement.textContent = 'Ход робота...';
            setTimeout(robotMove, 500); // Задержка для реалистичности
        }
    }
}

function robotMove() {
    if (!isGameActive) return;
    
    // Простой робот: ищет первую свободную клетку
    let emptyCells = boardState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    
    if (emptyCells.length > 0) {
        // Выбираем случайную свободную клетку, чтобы робот не был слишком предсказуем
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex, ROBOT);
        cells[randomIndex].classList.add(ROBOT);

        let result = checkWinner();
        if (result) {
            endGame(result);
        } else {
            statusElement.textContent = 'Твой ход (Крестик)';
        }
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].textContent = player;
}

function endGame(result) {
    isGameActive = false;
    if (result === 'Draw') {
        statusElement.textContent = 'Ничья!';
    } else if (result === HUMAN) {
        statusElement.textContent = 'Ты победил! 🎉';
    } else {
        statusElement.textContent = 'Робот победил! 🤖';
    }
}

function resetGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    statusElement.textContent = 'Твой ход (Крестик)';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
