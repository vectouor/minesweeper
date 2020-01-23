'use strict'

var MINE = '💣';
var FLAG = ' 🏁 ';

var gSafeCells;
var gBoard;
var gInterval;
var emoji = ['🙂', '😵', '😎'];
/*===================================================================*/
// This is an object in which you can keep and update
// the current game state: isOn – boolean, when true
// we let the user play shownCount: how many cells
// are shown markedCount: how many cells are marked (with a flag)
// secsPassed: how many seconds passed.
var gGame = {
    hintCount: 3,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    flaggedMines: 0,
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
//randomly selected 1.
var gUserSelectedLevel = 1;
/*=======================================================================*/
// gMineField holds the positions of all the mines.
var gMineField = [];
/*====================================================================== */
function initGame() {
    gGame.isOn = true;
    gInterval = false;
    gMineField = createMines();
    gBoard = buildBoard();
    console.table(gBoard);
    gSafeCells = findSafeCells();
    renderBoard()
    hideCells();
}
/*====================================================================== */
// Called on right click to mark a cell (suspected to be a mine) Search the
//  web (and implement) how to hide the context menu on right click
//*BUG - places the flag but doesn't show it.
function cellMarked(elCell, i, j) {
    // check if all the mines were flagged.
    if (gGame.flaggedMines === gMineField.length) return;
    if (gBoard[i][j] === MINE) {
        gGame.flaggedMines++;
    }
    gBoard[i][j] = FLAG;
    elCell = document.querySelector(`.cell-${i}-${j} span`);
    elCell.classList.remove('hidden');
    renderBoard(); // renders unsaved model state
}

/*====================================================================== */
function showHint() {

    if (gGame.hintCount === 0) return;

    var randomSafeCell = gSafeCells[getRandomIntInclusive(0, gSafeCells.length)];

    for (var i = randomSafeCell.i - 1; i <= randomSafeCell.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = randomSafeCell.j - 1; j <= randomSafeCell.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (gBoard[i][j] === MINE) continue;
            var elCell = document.querySelector(`.cell-${i}-${j} span`);
            elCell.classList.remove('hidden');
        }
    }
    renderBoard();
    hideCells();

    gGame.hintCount--;
}
/*====================================================================== */
//last minute patch :/
//hides all the mines.
function hideCells() {
    var el = document.querySelectorAll('td span');
    for (var i = 0; i < el.length; i++) {
        el[i].classList.add('hidden')
    }
}
/*====================================================================== */
//find cells witout mines.
function findSafeCells() {
    var safeCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] !== MINE) {
                var pos = { i: i, j: j };
                safeCells.push(pos);
            }
        }
    }
    return safeCells;
}
/*====================================================================== */
// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {

    if (gBoard[i][j] !== MINE && !gInterval) getTime();
    if (gBoard[i][j] === MINE) {
        var elheadline = document.querySelector('h1')
        elheadline.textContent = 'Minesweeper ' + emoji[1];
        clearInterval(gInterval);
        // gameOver(); 
        gGame.isOn = false;
        revealMines();
        console.log('Game over');
        return;
    }
    if (gGame.isOn) {
        expandShown(elCell, i, j);
    }
}
/*====================================================================== */
//create an array of mines with random indices to be used late.
function createMines() {
    var mineField = [];
    //number of mines will be placed according to 
    //MINES_COUNT specified in the game level.
    for (var iterator = 0; iterator < gLevels[gUserSelectedLevel].MINES_COUNT; iterator++) {
        var pos = {
            i: getRandomIntInclusive(0, gLevels[gUserSelectedLevel].SIZE - 1),
            j: getRandomIntInclusive(0, gLevels[gUserSelectedLevel].SIZE - 1)
        };
        mineField[iterator] = pos;
    }
    return mineField;
}
/*====================================================================== */
// Builds the board Set mines at random locations
//  Call setMinesNegsCount() Return the created board
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevels[gUserSelectedLevel].SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevels[gUserSelectedLevel].SIZE; j++) {
            board[i][j] = ' ';
        }
    }
    //randomly place mines from gMineField array
    for (var i = 0; i < gMineField.length; i++) {
        board[gMineField[i].i][gMineField[i].j] = MINE;
    }
    placeNegMarks(board);
    return board;
}
/*====================================================================== */
//place numerical markers around mines.

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
// When user clicks a cell with no mines around, we need to open not only 
// that cell, but also its neighbors.

function expandShown(elCell, rowIdx, colIdx) {
    for (var rows = rowIdx - 1; rows <= rowIdx + 1; rows++) {
        if (rows < 0 || rows >= gBoard.length) continue;
        for (var cols = colIdx - 1; cols <= colIdx + 1; cols++) {
            if (cols < 0 || cols >= gBoard[0].length) continue;
            if (gBoard[rows][cols] === MINE) continue;
            if (gBoard[rows][cols] === ' ') {
                elCell = document.querySelector(`.cell-${rows}-${cols}`);
                elCell.classList.add('open');
            }
            elCell = document.querySelector(`.cell-${rows}-${cols} span`);
            elCell.classList.remove('hidden');
        }
    }
}
/*====================================================================== */
function resetGame() {
    initGame();
    clearInterval(gInterval);
    var el_H1 = document.querySelector('h1')
    el_H1.textContent = 'Minesweeper ' + emoji[0];
    gGame.secsPassed = '0.00';
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = gGame.secsPassed;
}
/*====================================================================== */
function getTime() {
    if (!gGame.isOn) return;
    gGame.secsPassed = new Date().getTime();
    gInterval = setInterval(timer, 2, gGame.secsPassed)
}
/*====================================================================== */
function timer() {
    var elTimer = document.querySelector('.timer');
    var currentTime = new Date().getTime();
    var timeDiff = currentTime - gGame.secsPassed;
    var seconds = timeDiff / 1000;
    elTimer.innerText = seconds;
    if (!gGame.isOn) clearInterval(gInterval);
}
/*====================================================================== */
//reveals all the mines when a mine is clicked.

function revealMines() {
    for (var i = 0; i < gMineField.length; i++) {
        var elCell = document.querySelector(`.cell-${gMineField[i].i}-${gMineField[i].j} span`);
        elCell.classList.remove('hidden');
    }
}