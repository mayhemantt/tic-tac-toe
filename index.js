const board = new main(document.getElementById('root'));

function main(root) {
  let state = {
    currentScreen: 1,
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
    createBoard: function () {
      this.boardState = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
      let varValue = Math.random();
      console.log(varValue);
      state.turn = Math.round(varValue);
      console.table(state.turn, 'TURN---');
    },
    boardState: [],
  };

  function render() {
    function game() {
      let currentPlayerTurn = state.turn;

      let header = `<div class="header"><h3 class="${
        currentPlayerTurn === 0 ? 'activeTurn' : 'playerName'
      }">Player1</h3> <h3 class="${
        currentPlayerTurn === 1 ? 'activeTurn' : 'playerName'
      }">${state.players[1].isComputer ? 'Computer' : 'Player2'}</h3></div>`;

      let board = state.boardState.reduce(function (acc, curr, rowIndex) {
        return (
          acc +
          `<div id="row${rowIndex}" class="row">${curr
            .map(
              (str, colIndex) =>
                `<div class="cell col${colIndex}" data-row=${rowIndex} data-column=${colIndex}>${str}</div>`
            )
            .join('')}</div>`
        );
      }, ``);
      return `<div id='game'> <h3>TIC TAC TOE</h3> ${header} <div id="board">${board}</div></div>`;
    }

    function end() {
      function arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (i = arr1.length; i--; ) {
          if (arr1[i] !== arr2[i]) return false;
        }
        return true;
      }

      let { result, winningLine } = getResult(
        state.boardState,
        state.players[state.turn].symbol
      );

      let resultText = 'Draw';

      if (result !== Result.draw) resultText == 'Won';

      let currentPlayerTurn = state.turn;

      let header = `<div class="header"><h3 class="${
        currentPlayerTurn === 0 ? 'activeTurn' : 'playerName'
      }">Player1</h3> <h3 class="${
        currentPlayerTurn === 1 ? 'activeTurn' : 'playerName'
      }">${state.players[1].isComputer ? 'Computer' : 'Player2'}</h3></div>`;

      let board = state.boardState.reduce(function (acc, curr, rowIndex) {
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
                }" data-row=${rowIndex} data-column=${colIndex}>${str}</div>`
            )
            .join('')}</div>`
        );
      }, ``);

      return `<div id="resultScreen"> <h3>TIC TAC TOE</h3> ${header}  <div id="board">${board}</div></div>`;
    }

    let renderContent = '';
    if (state.currentScreen == 1) {
      renderContent = init();
    } else if (state.currentScreen == Screens.symbolScreen) {
      renderContent = symbolSelectScreen();
    } else if (state.currentScreen == Screens.resultScreen) {
      console.log('HERE');
      renderContent = end();
    } else {
      renderContent = game();
    }

    root.innerHTML = renderContent;
  }

  function computerPlay() {
    let symbol = state.players[1].symbol;
    let move = computeMove(state.boardState, symbol).move;

    executeTurn(state.boardState, move, symbol);
  }

  function executeTurn(board, move, symbol) {
    if (board[move.row][move.column] !== '') {
      return board;
    }

    applyMove(board, move, symbol);

    let result = getResult(board, symbol).result;

    if (result === Result.incomplete) {
      state.turn = (state.turn + 1) % 2;
      render();
    } else {
      if (result !== Result.draw) {
        let winningPlayer = state.players.find((player) => {
          return player.symbol == result;
        });
        winningPlayer.score++;
      }

      state.currentScreen = Screens.resultScreen;
      render();
    }
    if (result == Result.incomplete && state.players[state.turn].isComputer) {
      computerPlay();
    }
  }

  function computeMove(board, symbol) {
    function copyBoard(board) {
      let res = [];
      for (let i = 0; i < 3; i++) {
        res.push([]);
        for (let j = 0; j < 3; j++) {
          res[i][j] = board[i][j];
        }
      }

      return res;
    }

    function availableMoves(board) {
      let res = [];
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          if (board[row][column] === '') {
            res.push({ row, column });
          }
        }
      }

      return res;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
      }
    }
    let allAvailableMoves = availableMoves(board);

    let movesAndScore = [];
    for (let i = 0; i < allAvailableMoves.length; i++) {
      let move = allAvailableMoves[i];
      let newBoard = copyBoard(board);

      newBoard = applyMove(newBoard, move, symbol);
      result = getResult(newBoard, symbol).result;

      let score;

      if (result == Result.draw) {
        score = 0;
      } else if (result == symbol) {
        score = 1;
      } else {
        let otherSymbol = symbol == Symbol.x ? Symbol.o : Symbol.x;
        let nextMove = computeMove(newBoard, otherSymbol);
        score = -nextMove.score;
      }

      if (score === 1) return { move, score };
      movesAndScore.push({ move, score });
    }
    // console.log('I am here----------');
    shuffleArray(movesAndScore);

    movesAndScore.sort((moveA, moveB) => {
      return moveA.score - moveB.score;
    });

    return movesAndScore[0];
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
    let result = Result.incomplete;

    if (moveCount(board) < 5) {
      return { result };
    }

    let line;
    let winningLine = [];

    for (let i = 0; i < 3; i++) {
      line = board[i].join('');

      if (line === symbol.repeat(3)) {
        result = symbol;

        winningLine = [
          [i, 0],
          [i, 1],
          [i, 2],
        ];

        return { result, winningLine };
      }
    }

    for (let j = 0; j < 3; j++) {
      let column = [board[0][j], board[1][j], board[2][j]];

      line = column.join('');

      if (line === symbol.repeat(3)) {
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

    if (line === symbol.repeat(3)) {
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

    if (line === symbol.repeat(3)) {
      result = symbol;
      winningLine = [
        [0, 2],
        [1, 1],
        [2, 0],
      ];

      return { result, winningLine };
    }

    if (moveCount(board) == 9) {
      result = Result.draw;
      return { result, winningLine };
    }

    return { result };
  }
  $(root).on('click', '.button1', (el) => initHandler(el, state, render));
  $(root).on('click', '.button2', (el) =>
    symbolSelectHandler(el, state, render)
  );
  $(root).on('click', '#game .cell', (el) =>
    playerMoveHandler(el, state, executeTurn)
  );
  $(root).on('click', '#resultScreen', start);

  render();
}
