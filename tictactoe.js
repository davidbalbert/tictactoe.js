(function () {
    "use strict";

    var BOARD_SIDE = 300;
    var SQUARE_SIDE = BOARD_SIDE / 3;

    var WIN_STATES = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                      [0, 3, 6], [1, 4, 7], [2, 5, 8],
                      [0, 4, 8], [2, 4, 6]];

    var boardX = 0;
    var boardY = 0;

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
        ctx.translate(x, y);
        ctx.arc(SQUARE_SIDE / 2, SQUARE_SIDE / 2, SQUARE_SIDE / 2, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.restore();
    }

    function drawBoard(ctx, board) {
        var i;

        ctx.save();
        ctx.beginPath();
        ctx.translate(boardX, boardY);

        ctx.clearRect(-5, -5, BOARD_SIDE + 10, BOARD_SIDE + 10);

        for (i = 1; i < 3; i++) {
            ctx.moveTo((BOARD_SIDE / 3) * i + 0.5, 0);
            ctx.lineTo((BOARD_SIDE / 3) * i + 0.5, BOARD_SIDE);
        }

        for (i = 1; i < 3; i++) {
            ctx.moveTo(0, (BOARD_SIDE / 3) * i + 0.5);
            ctx.lineTo(BOARD_SIDE, (BOARD_SIDE / 3) * i + 0.5);
        }

        ctx.stroke();
        ctx.restore();

        for (i = 0; i < board.length; i++) {
            if (board[i] === 1) {
                drawX(ctx, boardX + (i % 3) * SQUARE_SIDE, boardY + Math.floor(i / 3) * SQUARE_SIDE);
            } else if (board[i] === -1) {
                drawO(ctx, boardX + (i % 3) * SQUARE_SIDE, boardY + Math.floor(i / 3) * SQUARE_SIDE);
            }
        }

        var winState = gameIsOver(board);

        if (winState && winState !== true) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.translate(boardX, boardY);

            if (winState[2] - winState[0] === 2) {
                var y = (0.5 + winState[0] / 3) * SQUARE_SIDE + 0.5;
                ctx.moveTo(0, y);
                ctx.lineTo(BOARD_SIDE, y);
            } else if (winState[2] - winState[0] === 6) {
                var x = (0.5 + winState[0] % 3) * SQUARE_SIDE + 0.5;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, BOARD_SIDE);
            } else if (winState[0] === 0) {
                ctx.moveTo(0, 0);
                ctx.lineTo(BOARD_SIDE, BOARD_SIDE);
            } else {
                ctx.moveTo(BOARD_SIDE, 0);
                ctx.lineTo(0, BOARD_SIDE);
            }

            ctx.stroke();
            ctx.restore();
        }
    }

    function isWithinBoard(e) {
        return e.offsetX > boardX &&
            e.offsetX < boardX + BOARD_SIDE &&
            e.offsetY > boardY &&
            e.offsetY < boardY + BOARD_SIDE;
    }

    function getGridIndex(e) {
        if (!isWithinBoard(e)) {
            return null;
        } else {
            var x = e.offsetX - boardX;
            var y = e.offsetY - boardY;

            var row = Math.floor(y / SQUARE_SIDE);
            var col = Math.floor(x / SQUARE_SIDE);

            return row * 3 + col;
        }
    }

    function gameIsOver(board) {
        var i;
        for (i = 0; i < WIN_STATES.length; i++) {
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

    window.addEventListener("load", function() {
        var canvas = document.getElementById("c");
        var ctx = canvas.getContext("2d");

        boardX = (canvas.width - BOARD_SIDE) / 2;
        boardY = (canvas.height - BOARD_SIDE) / 2;

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

                if (gridIndex !== null && board[gridIndex] === 0) {
                    board[gridIndex] = currentPlayer;
                    currentPlayer *= -1;
                }
            }

            drawBoard(ctx, board, canvas.width, canvas.height);
        });

        drawBoard(ctx, board, canvas.width, canvas.height);
    });
}());
