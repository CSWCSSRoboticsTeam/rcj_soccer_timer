const MAIN_TIME = 10 * 60; // 10 minutes game time
const PENALTY_TIME = 60; // 60 seconds penalty time

class GoalTracker {
    constructor(teamGoalCountId, decrementButtonId, incrementButtonId) {
        this.teamGoalCountId = teamGoalCountId;
        this.decrementButtonId = decrementButtonId;
        this.incrementButtonId = incrementButtonId;
        this.goals = 0;
    }

    getGoalCount() {
        return this.goals;
    }

    updateGoalDisplay() {
        document.getElementById(this.teamGoalCountId).textContent = this.goals;
        if (this.decrementButtonId != null) {
            document.getElementById(this.decrementButtonId).disabled = (this.goals == 0);
        }
    }

    incrementGoalCount() {
        this.goals++;
        this.updateGoalDisplay();
    }

    decrementGoalCount() {
        if (this.goals <= 0) {
            return;
        }
        this.goals--;
        this.updateGoalDisplay();
    }
}

let goalTrackers = [
    new GoalTracker("team1GoalCount", "team1DecrementButton", "team1IncrementButton"),
    new GoalTracker("team2GoalCount", "team2DecrementButton", "team2IncrementButton")
];

class CountdownTimer {
    constructor(totalTime, remainingTimeId, toggleButtonId) {
        this.totalTime = totalTime;
        this.timeLeft = totalTime;
        this.remainingTimeId = remainingTimeId;
        this.toggleButtonId = toggleButtonId;
        this.timerInterval = null;
        this.timerRunning = false;

        this.timerActiveColor = "black";
        this.timerDeactiveColor = "gray";
    }

    #updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = (this.timeLeft % 60);
        document.getElementById(this.remainingTimeId).textContent =
            `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    startTimer() {
        this.resumeTimer();
    }

    pauseTimer() {
        if (!this.timerRunning) {
            return;
        }
        clearInterval(this.timerInterval);
        this.timerRunning = false;
    }

    resumeTimer() {
        document.getElementById(this.remainingTimeId).style.color =
            this.timerActiveColor;
        if (this.timerRunning) {
            return;
        }
        this.timerRunning = true;
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.#updateTimer();
            } else {
                this.resetTimer();
            }
        }, 1000);
    }

    toggleTimer() {
        if (this.timerRunning) {
            this.pauseTimer();
            document.getElementById(this.toggleButtonId).textContent =
                "⏵";
        } else {
            this.resumeTimer();
            document.getElementById(this.toggleButtonId).textContent =
                "⏸";
        }
    }

    isTimerRunning() {
        return this.timerRunning;
    }

    resetTimer() {
        if (this.timerInterval != null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timeLeft = this.totalTime;
        document.getElementById(this.remainingTimeId).style.color =
            this.timerDeactiveColor;
        this.#updateTimer();
        this.timerRunning = false;
            document.getElementById(this.toggleButtonId).textContent =
                "⏵";
    }

    setTotalTime(totalTime) {
        this.totalTime = totalTime;
        resetTimer();
    }

    getTotalTime() {
        return this.totalTime;
    }
}

let mainTimer = new CountdownTimer(MAIN_TIME, "mainTimer", "mainTimerToggleButton");
let penaltyTimers = [
    new CountdownTimer(PENALTY_TIME, "penaltyTimer1", "penaltyTimer1toggleButton"),
    new CountdownTimer(PENALTY_TIME, "penaltyTimer2", "penaltyTimer2toggleButton"),
    new CountdownTimer(PENALTY_TIME, "penaltyTimer3", "penaltyTimer3toggleButton"),
    new CountdownTimer(PENALTY_TIME, "penaltyTimer4", "penaltyTimer4toggleButton")
];

function swapTeams() {
    let teamYellow = document.getElementById("team-yellow");
    let teamBlue = document.getElementById("team-blue");

    let team1 = document.getElementById("team1");
    let team2 = document.getElementById("team2");

    let teamAtYellow;
    let teamAtBlue;

    if (teamYellow.contains(team1)) {
        // currently yellow = team1, blue = team2
        // we want yellow = team2, blue = team1
        teamAtYellow = team1;
        teamAtBlue = team2;
    } else {
        // currently yellow = team2, blue = team1
        // we want yellow = team1, blue = team2
        teamAtYellow = team2;
        teamAtBlue = team1;
    }

    teamBlue.appendChild(teamYellow.removeChild(teamAtYellow));
    teamYellow.appendChild(teamBlue.removeChild(teamAtBlue));
}
