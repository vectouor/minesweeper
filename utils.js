'use strict'

/*====================================================================== */
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*====================================================================== */
function renderBoard() {
    var strHtml = '';

    for (var i = 1; i <= 3; i++) {
        strHtml += `<button class="level" onclick="levels(this)">Level ${i}</button>`
    }
    document.querySelector('.levels').innerHTML = strHtml;

    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var className = `cell-${i}-${j}`
            strHtml +=
                `<td class="${className}"
                oncontextmenu="cellMarked(this, ${i}, ${j})"
                onclick="cellClicked(this, ${i}, ${j})">
                <span class="revealed">${cell}</span>
                </td>`
        }
        strHtml += '</tr>'
    }
    document.querySelector('.board').innerHTML = strHtml;
}

/*====================================================================== */
// game difficulty selected by the user
// updates global var gUserSelectedLevel.
function levels(elLevel) {
    clearInterval(gInterval);
    switch (parseInt(elLevel.textContent.charAt(elLevel.textContent.length - 1))) {
        case 1:
            gUserSelectedLevel = 0;
            resetGame();
            break;
        case 2:
            gUserSelectedLevel = 1;
            resetGame();
            break;
        case 3:
            gUserSelectedLevel = 2;
            resetGame();
            break;
        default:
            break;
    }
}