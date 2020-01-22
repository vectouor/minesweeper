'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var className = `cell-${i}-${j}`
            strHtml +=
                `<td class="${className}"
              onclick="cellClicked(this, ${i}, ${j})">
               <span class="revealed hidden">${cell}</span>
            </td>`
        }
        strHtml += '</tr>'
    }
    document.querySelector('.board').innerHTML = strHtml;
}