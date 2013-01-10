BOARD_WIDTH = 300;
BOARD_HEIGHT = 300;

function drawBoard(ctx, board) {
  ctx.beginPath();
  ctx.save();
  ctx.translate(100, 100);

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
}

function ready() {
  var ctx = document.getElementById("c").getContext("2d");
  var board = [0,0,0,0,0,0,0,0,0];

  drawBoard(ctx, board);
}
