function testFunction() {
  console.log('Lib Loaded');
}

const Symbol = {
  x: 'X',
  o: '0',
};

const Screens = {
  beginScreen: 1,
  symbolScreen: 2,
  gameScreen: 3,
  resultScreen: 4,
};

const Result = {
  incomplete: 0,
  playerXWon: Symbol.x,
  playerOWon: Symbol.o,
  draw: 3,
};

function buttons(btn, data, text) {
  return `<button type="button" class="button${btn}" data=${data}>${text}</button>`;
}

function applyMove(board, move, symbol) {
  board[move.row][move.column] = symbol;
  return board;
}

function init() {
  return `<div> <h3>Choose your mode!</h3>  ${buttons(
    1,
    'single',
    'VS Computer'
  )} ${buttons(1, 'multi', 'VS Man')} </div>`;
}

function symbolSelectScreen() {
  return `<div id="symbolSelectScreen"><h3>Select Your Symbol!</h3>
      <div class="buttonGroups">
      ${buttons(2, 'X', 'X')} ${buttons(2, 'O', 'O')}</div> </div>`;
}

function initHandler(el, state, render) {
  let isComputerSelected = $(el.currentTarget).attr('data') == 'multi';
  state.players[1].isComputer = !isComputerSelected;
  console.log(state.players[1].isComputer, 'isComputer');
  state.currentScreen = Screens.symbolScreen;
  render();
}

function symbolSelectHandler(el, state, render) {
  let player1Select = $(el.currentTarget).attr('data');
  console.log(player1Select, 'player1select');
  state.players[0].symbol = player1Select;
  state.players[1].symbol = player1Select === Symbol.x ? Symbol.o : Symbol.x;

  state.currentScreen = Screens.gameScreen;
  state.createBoard();
  console.log(state);
  if (state.players[state.turn].isComputer) computerPlay();
  render();
}

function playerMoveHandler(el, state, executeTurn) {
  let symbol = state.players[state.turn].symbol;
  let row = parseInt($(el.currentTarget).attr('data-row'));
  let column = parseInt($(el.currentTarget).attr('data-column'));

  executeTurn(state.boardState, { row, column }, symbol);
}

function start() {
  location.reload();
}

testFunction();
