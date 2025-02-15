let scores = [0, 15, 30, 40];
let playerScores = [0, 0];  // Current game scores
let setScores = [0, 0];  // Set scores
let totalPoints = [0, 0];  // Total points won in the set
let gameHistory = [];
let deuceHistory = [0, 0];  // Tracks deuce points
let isTiebreak = false;
let tiebreakPoints = [0, 0];

function addPoint(player) {
    let otherPlayer = player === 1 ? 2 : 1;

    totalPoints[player - 1]++;  // Track total points won

    if (isTiebreak) {
        tiebreakPoints[player - 1]++;
        updateUI();
        if (tiebreakPoints[player - 1] === 7) {
            endMatch(player);
        }
        return;
    }

    if (playerScores[0] === 40 && playerScores[1] === 40) {
        handleDeuce(player);
    } else if (playerScores[player - 1] === 40) {
        winGame(player);
    } else {
        playerScores[player - 1] = scores[scores.indexOf(playerScores[player - 1]) + 1];
        logHistory();
        updateUI();
    }
}

function handleDeuce(player) {
    deuceHistory[player - 1]++;

    if (deuceHistory[player - 1] === 2) {
        winGame(player);
    } else if (deuceHistory[0] === 1 && deuceHistory[1] === 1) {
        // If both players win 1 point each in deuce, reset to 0-0 in deuce.
        deuceHistory = [0, 0];
    }

    updateUI();
}

function winGame(player) {
    setScores[player - 1]++;
    gameHistory.push(`Game won by Player ${player}`);

    // Check if match is over
    if (setScores[player - 1] === 6 && !(setScores[0] === 5 && setScores[1] === 5)) {
        endMatch(player);
        return;
    }

    // Check if we need a tiebreak
    if (setScores[0] === 5 && setScores[1] === 5) {
        isTiebreak = true;
        gameHistory.push("Tiebreaker Started!");
    }

    resetGame();
    updateUI();
}

function resetGame() {
    playerScores = [0, 0];
    deuceHistory = [0, 0];  // Reset deuce points
}

function resetMatch() {
    setScores = [0, 0];
    playerScores = [0, 0];
    totalPoints = [0, 0];
    gameHistory = [];
    isTiebreak = false;
    tiebreakPoints = [0, 0];

    updateUI();
}

function logHistory() {
    gameHistory.push(`P1: ${playerScores[0]}, P2: ${playerScores[1]}`);
    updateUI();
}

function undo() {
    if (gameHistory.length > 0) {
        gameHistory.pop();
        updateUI();
    }
}

function endMatch(winningPlayer) {
    let player1Name = document.getElementById("player1-name").value || "Player 1";
    let player2Name = document.getElementById("player2-name").value || "Player 2";

    let winner = winningPlayer === 1 ? player1Name : player2Name;
    let finalSetScore = `${setScores[0]} - ${setScores[1]}`;
    
    let summary = `Match Over!\nWinner: ${winner}\n\nSet Score: ${finalSetScore}\n${player1Name} Total Points: ${totalPoints[0]}\n${player2Name} Total Points: ${totalPoints[1]}`;

    alert(summary);
    resetMatch();
}


function updateUI() {
    let player1Name = document.getElementById("player1-name").value || "Player 1";
    let player2Name = document.getElementById("player2-name").value || "Player 2";

    document.getElementById("game-score-1").innerText = `${player1Name}: ${isTiebreak ? tiebreakPoints[0] : playerScores[0]}`;
    document.getElementById("game-score-2").innerText = `${player2Name}: ${isTiebreak ? tiebreakPoints[1] : playerScores[1]}`;
    document.getElementById("set-score-1").innerText = `${setScores[0]}`;
    document.getElementById("set-score-2").innerText = `${setScores[1]}`;

    let historyList = document.getElementById("history");
    historyList.innerHTML = "";
    gameHistory.forEach(entry => {
        let li = document.createElement("li");
        li.innerText = entry;
        historyList.appendChild(li);
    });
}
