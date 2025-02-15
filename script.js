let scores = [0, 15, 30, 40];
let playerScores = [0, 0];  // Current game scores
let setScores = [0, 0];  // Set scores
let totalPoints = [0, 0];  // Total points won in the set
let gameHistory = [];
let scoreHistory = [];
let deuceHistory = [0, 0];  // Tracks deuce points
let isTiebreak = false;
let tiebreakPoints = [0, 0];

function addPoint(player) {
    let otherPlayer = player === 1 ? 2 : 1;

    totalPoints[player - 1]++;  // Track total points won
    scoreHistory.push({ playerScores: [...playerScores], setScores: [...setScores], tiebreakPoints: [...tiebreakPoints], isTiebreak: isTiebreak });

    if (isTiebreak) {
        tiebreakPoints[player - 1]++;
        updateUI();
        if (tiebreakPoints[player - 1] === 7) {
            endMatch(player);
        }
        return;
    }

    // **Deuce scenario**: If both are at 40 or any player is at 45, call handleDeuce
    if ((playerScores[0] >= 40 && playerScores[1] >= 40) || playerScores[player - 1] === 45) {
        handleDeuce(player);
    } 
    else if (playerScores[player - 1] === 40) {
        winGame(player);
    } 
    else {
        playerScores[player - 1] = scores[scores.indexOf(playerScores[player - 1]) + 1];
        logHistory();
        updateUI();
    }
}


function handleDeuce(player) {
    let otherPlayer = player === 1 ? 2 : 1;

    if (playerScores[player - 1] === 40 && playerScores[otherPlayer - 1] === 40) {
        // First point in deuce, set score to 45
        playerScores[player - 1] = 45;
    } else if (playerScores[player - 1] === 45) {
        // If already at 45, winning again means they win the game
        playerScores[player - 1] = 50;
        winGame(player);
        return;
    } else {
        // If opponent was at 45, bring them back to 45 (no resetting to deuce)
        playerScores[player - 1] = 45;
    }

    logHistory();
    updateUI();
}

function winGame(player) {
    let player1Name = document.getElementById("player1-name").value || "Player 1";
    let player2Name = document.getElementById("player2-name").value || "Player 2";
    let winnerName = player === 1 ? player1Name : player2Name;

    setScores[player - 1]++;
    gameHistory.push(`Game won by ${winnerName} | Total Points - ${player1Name}: ${totalPoints[0]}, ${player2Name}: ${totalPoints[1]}`);

    if (setScores[player - 1] === 6 && !(setScores[0] === 5 && setScores[1] === 5)) {
        endMatch(player);
        return;
    }

    if (setScores[0] === 5 && setScores[1] === 5) {
        isTiebreak = true;
        gameHistory.push("Tiebreaker Started!");
    }

    resetGame();
    updateUI();
}



function resetGame() {
    playerScores = [0, 0];
    deuceHistory = [0, 0];
}

function resetMatch() {
    setScores = [0, 0];
    playerScores = [0, 0];
    totalPoints = [0, 0];
    gameHistory = [];
    scoreHistory = [];
    isTiebreak = false;
    tiebreakPoints = [0, 0];
    
    document.getElementById("player1-name").value = "";
    document.getElementById("player2-name").value = "";
		document.getElementById("name1").textContent = "Player 1";
		document.getElementById("name2").textContent = "Player 2";
    updateUI();
}

function logHistory() {
    let player1Name = document.getElementById("player1-name").value || "Player 1";
    let player2Name = document.getElementById("player2-name").value || "Player 2";

    gameHistory.push(`${player1Name}: ${playerScores[0]}, ${player2Name}: ${playerScores[1]}`);
    updateUI();
}


function undo() {
    if (scoreHistory.length === 0) return;

    let lastState = scoreHistory.pop();
		let prevScores = lastState.playerScores;
    let changedPlayer = playerScores[0] !== prevScores[0] ? 1 : 2;

    // Reduce total points for the correct player
    if (totalPoints[changedPlayer - 1] > 0) {
        totalPoints[changedPlayer - 1]--;
    }
    playerScores = [...lastState.playerScores];
    setScores = [...lastState.setScores];
    tiebreakPoints = [...lastState.tiebreakPoints];
    isTiebreak = lastState.isTiebreak;
    
    gameHistory.pop();
    updateUI();
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
    document.getElementById("game-score-1").innerText = `${isTiebreak ? tiebreakPoints[0] : playerScores[0]}`;
    document.getElementById("game-score-2").innerText = `${isTiebreak ? tiebreakPoints[1] : playerScores[1]}`;
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

function updatePlayerNames() {
    let player1Name = document.getElementById("player1-name").value.trim();
    let player2Name = document.getElementById("player2-name").value.trim();
    
    if (player1Name === "" || player2Name === "") {
        alert("Please enter both player names before starting the game.");
        return;
    }

    document.getElementById("name1").textContent = player1Name;
    document.getElementById("name2").textContent = player2Name;
}
