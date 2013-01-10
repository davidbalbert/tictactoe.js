BOARD_X = 100;
BOARD_Y = 100;

BOARD_WIDTH = 300;
BOARD_HEIGHT = 300;

SQUARE_SIDE = BOARD_HEIGHT / 3;

WIN_STATES = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
              [0, 3, 6], [1, 4, 7], [2, 5, 8],
              [0, 4, 8], [2, 4, 6]];

function drawX(ctx, x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0, 0);
  ctx.lineTo(SQUARE_SIDE, SQUARE_SIDE);
  ctx.moveTo(SQUARE_SIDE, 0);
  ctx.lineTo(0, SQUARE_SIDE);
  ctx.stroke();
  ctx.restore();
}

function drawO(ctx, x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y)
  ctx.arc(SQUARE_SIDE / 2, SQUARE_SIDE / 2, SQUARE_SIDE / 2, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.restore();
}

function drawBoard(ctx, board) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(BOARD_X, BOARD_Y);

  ctx.clearRect(-5, -5, BOARD_WIDTH + 10, BOARD_HEIGHT + 10);

  for (var i = 1; i < 3; i++) {
    ctx.moveTo((BOARD_WIDTH / 3) * i + 0.5, 0);
    ctx.lineTo((BOARD_WIDTH / 3) * i + 0.5, BOARD_HEIGHT);
  }

  for (i = 1; i < 3; i++) {
    ctx.moveTo(0, (BOARD_HEIGHT / 3) * i + 0.5);
    ctx.lineTo(BOARD_WIDTH, (BOARD_HEIGHT / 3) * i + 0.5);
  }

  ctx.stroke();
  ctx.restore();

  for (i = 0; i < board.length; i++) {
    if (board[i] === 1) {
      drawX(ctx, BOARD_X + (i % 3) * SQUARE_SIDE, BOARD_Y + Math.floor(i / 3) * SQUARE_SIDE);
    } else if (board[i] === -1) {
      drawO(ctx, BOARD_X + (i % 3) * SQUARE_SIDE, BOARD_Y + Math.floor(i / 3) * SQUARE_SIDE);
    }
  }

  var winState = gameIsOver(board);

  if (winState && winState !== true) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(BOARD_X, BOARD_Y);

    if (winState[2] - winState[0] === 2) {
      var y = (0.5 + winState[0] / 3) * SQUARE_SIDE + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(BOARD_WIDTH, y);
    } else if (winState[2] - winState[0] === 6) {
      var x = (0.5 + winState[0] % 3) * SQUARE_SIDE + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, BOARD_HEIGHT);
    } else if (winState[0] == 0) {
      ctx.moveTo(0, 0);
      ctx.lineTo(BOARD_WIDTH, BOARD_HEIGHT);
    } else {
      ctx.moveTo(BOARD_WIDTH, 0);
      ctx.lineTo(0, BOARD_HEIGHT);
    }

    ctx.stroke();
    ctx.restore();
  }
}

function isWithinBoard(e) {
  return e.offsetX > BOARD_X &&
    e.offsetX < BOARD_X + BOARD_WIDTH &&
    e.offsetY > BOARD_Y &&
    e.offsetY < BOARD_Y + BOARD_HEIGHT;
}

function getGridIndex(e) {
  if (!isWithinBoard(e)) {
    return null;
  } else {
    var x = e.offsetX - BOARD_X;
    var y = e.offsetY - BOARD_Y;

    var row = Math.floor(y / SQUARE_SIDE);
    var col = Math.floor(x / SQUARE_SIDE);

    return row * 3 + col;
  }
}

function gameIsOver(board) {
  for (var i = 0; i < WIN_STATES.length; i++) {
    var s = WIN_STATES[i];
    if (Math.abs(board[s[0]] + board[s[1]] + board[s[2]]) === 3) {
      return s;
    }
  }

  for (i = 0; i < board.length; i++) {
    if (!board[i]) {
      return false;
    }
  }

  return true;
}

function ready() {
  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");
  var board = [0,0,0,0,0,0,0,0,0];

  var currentPlayer = 1;

  canvas.addEventListener("mousedown", function(e) {
    e.preventDefault();
  });

  canvas.addEventListener("click", function(e) {
    if (gameIsOver(board)) {
      board = [0,0,0,0,0,0,0,0,0];
      currentPlayer = 1;
    } else {
      var gridIndex = getGridIndex(e);

      if (gridIndex != null && board[gridIndex] === 0) {
        board[gridIndex] = currentPlayer;
        currentPlayer *= -1;
      }
    }

    drawBoard(ctx, board);
  });

  drawBoard(ctx, board);
}
