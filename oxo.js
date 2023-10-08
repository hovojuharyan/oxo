document.addEventListener("DOMContentLoaded", () => {
    eventOnClickForCell();
    eventStartOverClicked();
    eventNextRoundClicked();
});

const moveX = "X";
const moveO = "O";
let matrix = [[], [], []];
let crossedTriple = [[], [], []];
let score = [0, 0];
let currMove = moveX;
let movedCount = 0;
let draw = false;

function eventOnClickForCell() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener("click", () => {
            if (!cell.textContent) {
                let r = cell.getAttribute("r");
                let c = cell.getAttribute("c");
                matrix[r][c] = currMove;
                cell.textContent = currMove;
                movedCount++;
                if (checkFinished(r, c)) {
                    onFinish();
                } else {
                    currMove = (currMove === moveX ? moveO : moveX);
                }
            }
        });
    }
}

function eventStartOverClicked() {
    document.getElementById("startOverBtn").addEventListener("click", () => {
        newRound();
        whitePlayers();
        nullifyScore();
        currMove = moveX;
    });
}

function eventNextRoundClicked() {
    document.getElementById("nextRoundBtn").addEventListener("click", () => {
        newRound();
    });
}

function newRound() {
    cleanBoard();
    draw = false;
    movedCount = 0;
}

function onFinish() {
    if (draw) {
        whitePlayers();
        score[0] += 0.5;
        score[1] += 0.5;
        document.getElementById("score").textContent = score.join("-");
        showDraw();
    } else {
        let players = document.getElementsByClassName("player_move");
        let wonIdx = currMove == moveO ? 1 : 0;
        changeScore(wonIdx);
        players[wonIdx].style.backgroundColor = "#56fc03";
        players[1 - wonIdx].style.backgroundColor = "";
        crossWinnerCells();
    }
}

function changeScore(wonIdx) {
    score[wonIdx] += 1;
    document.getElementById("score").textContent = score.join("-");
}

function whitePlayers() {
    let players = document.getElementsByClassName("player_move");
    for (let player of players) {
        player.style.backgroundColor = "";
    }
}

function nullifyScore() {
    score = [0, 0];
    document.getElementById("score").textContent = score.join("-");
}

function cleanBoard() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.style.backgroundColor = "";
        cell.textContent = "";
    }
    matrix = [[], [], []];
}

function crossWinnerCells() {
    let cells = document.getElementsByClassName("cell");
    for (let rc of crossedTriple) {
        let r = rc[0];
        let c = rc[1];
        cells[matrix.length * r + c].style.backgroundColor = "#56fc03";
    }
}

function showDraw() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.style.backgroundColor = "#0af079";
    }
}

function checkFinished(r, c) {
    r = Number(r);
    c = Number(c);
    if (r % 2 === c % 2) {
        if (r === c && matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
            crossedTriple = [[0, 0], [1, 1], [2, 2]];
            return true;
        }
        if (r !== c && matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) {
            crossedTriple = [[0, 2], [1, 1], [2, 0]];
            return true;
        }
    }
    if (matrix[r][0] === matrix[r][1] && matrix[r][1] === matrix[r][2]) {
        crossedTriple = [[r, 0], [r, 1], [r, 2]];
        return true;
    }
    if (matrix[0][c] === matrix[1][c] && matrix[1][c] === matrix[2][c]) {
        crossedTriple = [[0, c], [1, c], [2, c]];
        return true;
    }
    if (movedCount == 9) {
        draw = true;
        return true;
    }
    return false;
}