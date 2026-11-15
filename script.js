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

// Проверка победителя
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

// Клик по клетке (ход человека)
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if (boardState[index] === '' && isGameActive) {
        makeMove(index, HUMAN);
        cell.classList.add(HUMAN);
        
        let result = checkWinner();
        if (result) {
            endGame(result);
        } else {
            statusElement.textContent = 'Робот думает...';
            setTimeout(robotMove, 500); // Небольшая пауза, чтобы казалось, что робот "думает"
        }
    }
}

// Умная логика робота
function robotMove() {
    if (!isGameActive) return;
    
    let move = findBestMove();
    
    if (move !== null) {
        makeMove(move, ROBOT);
        cells[move].classList.add(ROBOT);

        let result = checkWinner();
        if (result) {
            endGame(result);
        } else {
            statusElement.textContent = 'Твой ход (Крестик)';
        }
    }
}

// Функция поиска лучшего хода для робота
function findBestMove() {
    // 1. Проверяем, может ли робот выиграть следующим ходом
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
            boardState[i] = ROBOT;
            if (checkWinner() === ROBOT) {
                boardState[i] = ''; 
                return i;
            }
            boardState[i] = ''; 
        }
    }

    // 2. Проверяем, не выигрывает ли игрок следующим ходом (если да - блокируем)
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
            boardState[i] = HUMAN;
            if (checkWinner() === HUMAN) {
                boardState[i] = ''; 
                return i;
            }
            boardState[i] = '';
        }
    }

    // 3. Занимаем центр или углы
    const cornersAndCenter = [4, 0, 2, 6, 8]; 
    for (let i of cornersAndCenter) {
        if (boardState[i] === '') return i;
    }

    // 4. Если ничего не подошло, ставим в любую свободную клетку
    let emptyCells = boardState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
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
