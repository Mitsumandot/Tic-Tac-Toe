function Cell() {
    let value = 0;

    const fillCell = (player) => {
        value = player;
    }

    const getValue = () => value;

    return { fillCell, getValue };
}

function GameBoard() {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const play = (row, col, player) => {
        let cell = board[row][col];
        if (cell.getValue() == 0) {
            cell.fillCell(player);
            return true;
        }
        return false;

    }

    return { getBoard, play };

}


function GameController(PlayerOne = "P1", PlayerTwo = "P2") {
    const board = GameBoard();

    let players = [{ token: 1, name: PlayerOne, score: 0 }, { token: 2, name: PlayerTwo, score: 0 }];

    let activePlayer = players[0];



    const getScorePlayer1 = () => players[0].score;
    const getScorePlayer2 = () => players[1].score;

    const setScorePlayer = () => {
        setActivePlayer();
        console.log("Winner :", activePlayer.token);
        activePlayer.score += 1;
        setActivePlayer();
    };



    const getActivePlayer = () => activePlayer;

    const setActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const playRound = (row, column) => {
        if (board.play(row, column, activePlayer.token)) {
            setActivePlayer();
            return true;
        }

        return false;
    }

    const checkRow = (x, row) => x[row][0].getValue() == x[row][1].getValue() &&
        x[row][0].getValue() == x[row][2].getValue() && x[row][0].getValue() != 0;

    const checkCol = (x, col) => x[0][col].getValue() == x[1][col].getValue() &&
        x[0][col].getValue() == x[2][col].getValue() && x[0][col].getValue() != 0;

    const checkDiagonal = (x) => {
        return x[0][0].getValue() == x[1][1].getValue() && x[1][1].getValue() == x[2][2].getValue() && x[0][0].getValue() != 0 ||
            x[0][2].getValue() == x[1][1].getValue() && x[1][1].getValue() == x[2][0].getValue() && x[0][2].getValue() != 0;
    }

    const checkEnd = (row, column) => {
        let x = board.getBoard();
        if (checkRow(x, row)) {
            setScorePlayer();
            console.log("player1: ", getScorePlayer1());
            console.log("player2: ", getScorePlayer2());

            return x[row][0].getValue();
        }
        else if (checkCol(x, column)) {
            setScorePlayer();
            console.log("player1: ", getScorePlayer1());
            console.log("player2: ", getScorePlayer2());
            return x[0][column].getValue();
        }
        else if (checkDiagonal(x)) {
            setScorePlayer();
            console.log("player1: ", getScorePlayer1());
            console.log("player2: ", getScorePlayer2());
            return x[1][1].getValue();
        }
        else {
            return 0;
        }

    }

    return { playRound, getActivePlayer, checkEnd, getBoard: board.getBoard, getScorePlayer1, getScorePlayer2 };

}

function ScreenController() {
    const game = GameController();
    let cells = document.querySelectorAll(".container div");

    const getRow = (cellId) => parseInt(cellId[0]);

    const getCol = (cellId) => parseInt(cellId[1]);

    const circleFill = (cell) => {
        let circle = document.createElement("div");
        circle.classList.add("circle");
        cell.appendChild(circle);
    }

    const xFill = (cell) => {
        let x = document.createElement("div");
        x.innerHTML = "&#10060;";
        x.classList.add("x");
        cell.appendChild(x);

    }

    const reset = () => {
        let board = game.getBoard();
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i].push(Cell());
            }
        }
        cells.forEach((cell) => {
            cell.innerHTML = "";
        })

    }

    updateScore = (player) => {
        let score = document.querySelector(".score" + player);
        let currentScore = 0;
        console.log(player);
        if (player == "1") {
            score.textContent = "Score : " + game.getScorePlayer1();
        }
        else {
            score.textContent = "Score : " + game.getScorePlayer2();
        }

    }

    const checkAndDisplayWinner = (row, col) => {
        let winner = game.checkEnd(row, col);
        if (winner == "1") {

            console.log("The winner is P1 !");
            updateScore(winner);
        }
        else if (winner == "2") {
            console.log("The winner is P2 !");
            updateScore(winner);
        }
    }

    const clickBoard = (cell) => {
        let row = getRow(cell.id);
        let col = getCol(cell.id);
        let activePlayer = game.getActivePlayer();
        if (game.playRound(row, col)) {
            if (activePlayer.token == 1) {
                circleFill(cell);
            }
            else {
                xFill(cell);
            }
            checkAndDisplayWinner(row , col);

        }
    }

    const updateScreen = () => {
        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                clickBoard(cell);
            })
        })
    }

    const playAgain = () => {
        let button = document.querySelector("button");
        button.addEventListener("click", () => {
            reset();
        });
    }
    playAgain();
    updateScreen();

}


ScreenController();
