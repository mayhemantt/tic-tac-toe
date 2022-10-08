const SYMBOLS = {
  x: 'X',
  o: 'O',
};
const RESULT = {
  incomplete: 0,
  playerXWon: SYMBOLS.x,
  playerOWon: SYMBOLS.o,
  tie: 3,
};
const VIEW = {
  question1: 1,
  question2: 2,
  game: 3,
  result: 4,
};

function Board(options) {
  state = {
    view: VIEW.question1,
    players: [
      {
        symbol: null,
        isComputer: false,
      },
      {
        symbol: null,
        isComputer: false,
      },
    ],
    game: {
      _gameBoard: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      turn: Math.round(Math.random()),
    },
  };

  function initGame() {
    state.game = {
      _gameBoard: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      turn: Math.round(Math.random()),
    };
  }

  function moveCount(board) {
    let moveCount = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] != '') {
          moveCount++;
        }
      }
    }
    return moveCount;
  }

  function getResult(board, symbol) {
    let result = RESULT.incomplete;
    if (moveCount(board) < 5) {
      return { result };
    }

    function succession(line) {
      return line === symbol.repeat(3);
    }

    let line;
    let winningLine = [];

    for (var i = 0; i < 3; i++) {
      line = board[i].join('');
      if (succession(line)) {
        result = symbol;
        winningLine = [
          [i, 0],
          [i, 1],
          [i, 2],
        ];
        return { result, winningLine };
      }
    }

    for (var j = 0; j < 3; j++) {
      let column = [board[0][j], board[1][j], board[2][j]];
      line = column.join('');
      if (succession(line)) {
        result = symbol;
        winningLine = [
          [0, j],
          [1, j],
          [2, j],
        ];
        return { result, winningLine };
      }
    }

    let diag1 = [board[0][0], board[1][1], board[2][2]];
    line = diag1.join('');
    if (succession(line)) {
      result = symbol;
      winningLine = [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
      return { result, winningLine };
    }

    let diag2 = [board[0][2], board[1][1], board[2][0]];
    line = diag2.join('');
    if (succession(line)) {
      result = symbol;
      winningLine = [
        [0, 2],
        [1, 1],
        [2, 0],
      ];
      return { result, winningLine };
    }

    if (moveCount(board) == 9) {
      result = RESULT.tie;
      return { result, winningLine };
    }

    return { result };
  }

  function getBestMove(board, symbol) {
    function copyBoard(board) {
      let copy = [];
      for (let row = 0; row < 3; row++) {
        copy.push([]);
        for (let column = 0; column < 3; column++) {
          copy[row][column] = board[row][column];
        }
      }
      return copy;
    }

    function getAvailableMoves(board) {
      let availableMoves = [];
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          if (board[row][column] === '') {
            availableMoves.push({ row, column });
          }
        }
      }
      return availableMoves;
    }

    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
      }
    }

    let availableMoves = getAvailableMoves(board);
    let availableMovesAndScores = [];

    for (var i = 0; i < availableMoves.length; i++) {
      let move = availableMoves[i];
      let newBoard = copyBoard(board);
      newBoard = applyMove(newBoard, move, symbol);
      result = getResult(newBoard, symbol).result;
      let score;
      if (result == RESULT.tie) {
        score = 0;
      } else if (result == symbol) {
        score = 1;
      } else {
        let otherSymbol = symbol == SYMBOLS.x ? SYMBOLS.o : SYMBOLS.x;
        nextMove = getBestMove(newBoard, otherSymbol);
        score = -nextMove.score;
      }
      if (score === 1) return { move, score };
      availableMovesAndScores.push({ move, score });
    }

    shuffleArray(availableMovesAndScores);

    availableMovesAndScores.sort((moveA, moveB) => {
      return moveB.score - moveA.score;
    });
    return availableMovesAndScores[0];
  }

  function render() {
    // Renders the screen according to the state.
    function getPlayerName(playerSymbol) {
      if (playerSymbol === state.players[0].symbol)
        return state.players[0].isComputer ? 'Computer' : 'Player1';
      return state.players[1].isComputer ? 'Computer' : 'Player2';
    }

    function buttonHTML(btnGroup, data, text) {
      return `<button type="button" class="btn${btnGroup}" data=${data}>${text}</button>`;
    }

    function htmlSpaces(times) {
      return '&emsp;'.repeat(times);
    }

    function modeSelectionScreen() {
      return `<div id="modeSelectionScreen"><div class="heading">TiC TaC ToE</div><h3>Choose You Mode!\n</h3>
        <div class="buttonGroup">
        ${buttonHTML(1, '1player', 'Man Against computer')}
        ${buttonHTML(1, '2players', 'Man Against Man')}
        </div>
      </div>`;
    }

    function selectPlayerScreen() {
      const html2 = `<div id="selectPlayerScreen"> <div class="heading">TiC TaC ToE</div><h3>${
        !state.players[1].isComputer ? 'Player 1, <br />' : ''
      }Which symbols would you like to use?</h3>
      ${buttonHTML(2, 'X', 'X')}
      ${buttonHTML(2, 'O', 'O')}`;
      return html2;
    }

    function htmlGame() {
      let moveNumber = moveCount(state.game._gameBoard) + 1;
      let playerName =
        state.game.turn === 0
          ? 'Player1'
          : state.players[1].isComputer
          ? 'Computer'
          : 'Player2';
      playerName = 'ddd';
      moveNumber = 1;
      let htmlBefore = `<h4>move: ${moveNumber} ${htmlSpaces(
        5
      )} turn: ${playerName}</h4>`;

      let board = state.game._gameBoard.reduce(function (acc, curr, rowIndex) {
        return (
          acc +
          `<div id= "row${rowIndex}" class="row">${curr
            .map(
              (str, colIndex) =>
                `<div class="cell col${colIndex}" data-row=${rowIndex} data-column=${colIndex}>${str}</div>`
            )
            .join('')}</div>`
        );
      }, ``);

      // let htmlAfter = `<h4>Score: ${htmlSpaces(1)} Player 1 - ${
      //   state.players[0].score
      // } ${htmlSpaces(2)} ${
      //   state.players[1].isComputer ? 'Computer' : 'Player 2'
      // } - ${state.players[1].score}</h4>`;
      return `<div id='gameView'> <h3>TIC TAC TOE</h3> ${htmlBefore} <div id="board">${board}</div>  </div>`;
    }

    function htmlGameEnd() {
      function arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (var i = arr1.length; i--; ) {
          if (arr1[i] !== arr2[i]) return false;
        }
        return true;
      }

      let { result, winningLine } = getResult(
        state.game._gameBoard,
        state.players[state.game.turn].symbol
      );
      let resultText = 'tie';
      if (result !== RESULT.tie) resultText = getPlayerName(result) + ' Won';

      let htmlBefore = `<h3>${resultText} ${htmlSpaces(
        2
      )} Click to restart </h3> `;
      let board = state.game._gameBoard.reduce(function (acc, curr, rowIndex) {
        return (
          acc +
          `<div id="row${rowIndex}" class="row">${curr
            .map(
              (str, colIndex) =>
                `<div class="cell col${colIndex} ${
                  winningLine.some((arr) =>
                    arraysAreEqual(arr, [rowIndex, colIndex])
                  )
                    ? 'winningLine'
                    : ''
                }"
              data-row=${rowIndex} data-column=${colIndex}>${str}</div>`
            )
            .join('')}</div>`
        );
      }, ``);
      // let htmlAfter = `<h4>Score: ${htmlSpaces(1)} Player 1 - ${
      //   state.players[0].score
      // } ${htmlSpaces(2)} ${
      //   state.players[1].isComputer ? 'Computer' : 'Player 2'
      // } - ${state.players[1].score}</h4>`;
      return `<div id='resultView'> ${htmlBefore} <div id="board">${board}</id>  </div>`;
    }

    let html = '';
    if (state.view == VIEW.question1) {
      html = modeSelectionScreen();
      html = htmlGame();
    } else if (state.view == VIEW.question2) {
      html = selectPlayerScreen();
    } else if (state.view == VIEW.result) {
      html = htmlGameEnd();
    } else {
      html = htmlGame();
    }
    options.el.innerHTML = html;
  }

  function question1Handler(ev) {
    //
    let isComputer = !($(ev.currentTarget).attr('data') === '2players');
    state.players[1].isComputer = isComputer;
    if (isComputer) state.view = VIEW.question2;
    else {
      state.players[0].symbol = 'X';
      state.players[1].symbol = 'O';
      state.view = VIEW.game;

      initGame();
    }
    render();
  }

  function question2Handler(ev) {
    let player1Symbol = $(ev.currentTarget).attr('data');
    state.players[0].symbol = player1Symbol;
    state.players[1].symbol =
      player1Symbol === SYMBOLS.x ? SYMBOLS.o : SYMBOLS.x;

    state.view = VIEW.game;
    initGame();
    if (state.players[state.game.turn].isComputer) doComputerMove();

    render();
  }

  function doComputerMove() {
    let symbol = state.players[1].symbol;
    let move = getBestMove(state.game._gameBoard, symbol).move;
    executeTurn(state.game._gameBoard, move, symbol);
  }

  function playerMoveHandler(ev) {
    let symbol = state.players[state.game.turn].symbol;
    let row = parseInt($(ev.currentTarget).attr('data-row'));
    let column = parseInt($(ev.currentTarget).attr('data-column'));
    executeTurn(state.game._gameBoard, { row, column }, symbol);
  }

  function applyMove(board, move, symbol) {
    board[move.row][move.column] = symbol;
    return board;
  }

  function executeTurn(board, move, symbol) {
    if (board[move.row][move.column] !== '') {
      return board;
    }

    applyMove(board, move, symbol);
    let result = getResult(board, symbol).result;

    if (result === RESULT.incomplete) {
      state.game.turn = (state.game.turn + 1) % 2;
      render();
    } else {
      if (result !== RESULT.tie) {
        let winningPlayer = state.players.find((player) => {
          return player.symbol == result;
        });
        winningPlayer;
      }

      state.view = VIEW.result;
      render();
    }
    if (
      result == RESULT.incomplete &&
      state.players[state.game.turn].isComputer
    ) {
      doComputerMove();
    }
  }

  function beginGame() {
    initGame();
    state.view = VIEW.game;
    render();
    if (state.game.turn === 1 && state.players[1].isComputer) doComputerMove();
  }

  $(options.el).on('click', '.btn1', question1Handler);
  $(options.el).on('click', '.btn2', question2Handler);
  $(options.el).on('click', '#gameView .cell', playerMoveHandler);
  $(options.el).on('click', '#resultView', beginGame);

  render();
}

const board = new Board({
  el: document.getElementById('root'),
});
