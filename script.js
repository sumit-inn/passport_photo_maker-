const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const restartBtn = document.getElementById('restart');

let boardState; // array of 9: '', 'X' or 'O'
let currentPlayer;
let gameActive;
const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diags
];

function initGame(){
  boardState = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
    c.disabled = false;
  });
}

function handleCellClick(e){
  const cell = e.currentTarget;
  const idx = Number(cell.dataset.index);
  if (!gameActive || boardState[idx]) return;

  boardState[idx] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  const winInfo = checkWinner();
  if (winInfo) {
    gameActive = false;
    statusEl.textContent = `Player ${winInfo.player} wins!`;
    winInfo.combo.forEach(i => cells[i].classList.add('winner'));
    // disable remaining cells
    cells.forEach(c => c.disabled = true);
    return;
  }

  if (isDraw()) {
    gameActive = false;
    statusEl.textContent = `It's a draw!`;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner(){
  for (const combo of winningCombos){
    const [a,b,c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return { player: boardState[a], combo };
    }
  }
  return null;
}

function isDraw(){
  return boardState.every(Boolean);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', initGame);

// initialize on load
initGame();