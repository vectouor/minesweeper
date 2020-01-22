'use strict'

var MINE = ' 💣 ';
var FLAG = ' 🏁 ';
// var MINE = '1';
// var FLAG = '0';

var gBoard;

/*===================================================================*/
// This is an object in which you can keep and update
// the current game state: isOn – boolean, when true
// we let the user play shownCount: how many cells
// are shown markedCount: how many cells are marked (with a flag)
// secsPassed: how many seconds passed.
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

/*===================================================================*/
// var gLevel = { SIZE: 8, MINES_COUNT: 2, };
// This is an object by which the board size is set
//  (in this case: 4*4), and how many mines to put.
// **changed to a hardcoded array of levels
var gLevels = [
    { SIZE: 4, MINES_COUNT: 2 },
    { SIZE: 8, MINES_COUNT: 12 },
    { SIZE: 12, MINES_COUNT: 30 }
];
/*===================================================================*/
// gMineField holds the positions of all the mines.
var gMineField = [];

var cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
};

/*====================================================================== */
function initGame() {
    gGame.isOn = true;
    gMineField = placeMines(0);
    gBoard = buildBoard();
    console.table(gBoard);
    renderBoard()
        // revealNeighbors(gBoard, 1, 1);
}

/*====================================================================== */
function renderCell(cellPos) {
    var elCell = document.querySelector(`.cell-${cellPos.i}-${cellPos.j} span`);
    elCell.style.display = 'none'
}

function revealMines() {

}
/*====================================================================== */
//randomly place mines.
function placeMines(level) {
    var mineField = [];
    //number of mines will be placed according to 
    //MINES_COUNT specified in the game level.
    for (var iterator = 0; iterator < gLevels[level].MINES_COUNT; iterator++) {
        var pos = {
            i: getRandomIntInclusive(0, gLevels[level].SIZE - 1),
            j: getRandomIntInclusive(0, gLevels[level].SIZE - 1)
        }
        mineField.push(pos)
    }
    console.log(mineField);

    return mineField;
}
/*====================================================================== */
// Builds the board Set mines at random locations
//  Call setMinesNegsCount() Return the created board
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevels[0].SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevels[0].SIZE; j++) {
            board[i][j] = '';
            board[i][j] = gMineField.pop();
        }
    }


    board[0][0] = MINE;
    board[3][2] = MINE;
    board[2][2] = MINE;
    // board[7][6] = MINE;

    placeNegMarks(board);
    return board;
}

/*====================================================================== */
function placeNegMarks(board) {

    for (var i = 0; i < board.length; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = 0; j < board[0].length; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (board[i][j] === MINE) continue;
            if (setMinesNegsCount(board, i, j) === 0) continue;
            board[i][j] = setMinesNegsCount(board, i, j);
        }
    }
}

/*====================================================================== */
// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (board[i][j] === MINE) count++;
        }
    }
    return count;
}

/*====================================================================== */
// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {

    if (gBoard[i][j] === MINE) {
        gGame.isOn = false;
        elCell = document.querySelector(`.cell-${i}-${j} span`);
        elCell.classList.remove('hidden');
        console.log('Game over');
        return;
    }

    expandShown(elCell, i, j);
    // checkGameOver(){} implement later
    console.dir(elCell);
}


/*====================================================================== */
// Called on right click to mark a cell (suspected to be a mine) Search the
//  web (and implement) how to hide the context menu on right click
function cellMarked() {}

/*====================================================================== */
// Game ends when all mines are marked and all the other cells are shown
function checkGameOver() {}

/*====================================================================== */
// When user clicks a cell with no mines around, we need to open not only 
// // that cell, but also its neighbors.
function expandShown(elCell, rowIdx, colIdx) {

    for (var rows = rowIdx - 1; rows <= rowIdx + 1; rows++) {
        if (rows < 0 || rows >= gBoard.length) continue;
        for (var cols = colIdx - 1; cols <= colIdx + 1; cols++) {
            console.log('test');
            if (cols < 0 || cols >= gBoard[0].length) continue;
            if (gBoard[rows][cols] === MINE) continue;
            elCell = document.querySelector(`.cell-${rows}-${cols} span`);
            elCell.classList.remove('hidden');
        }
    }
}