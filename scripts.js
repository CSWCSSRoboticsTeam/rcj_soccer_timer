const MAIN_TIME = 10 * 60 * 1000; // 10 minutes game time in millis
const PENALTY_TIME = 60 * 1000; // 60 seconds penalty time in millis

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
            document.getElementById(this.decrementButtonId).disabled = (this.goals === 0);
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
    // long this.totalTime
    // String this.remainingTimeId
    // String this.toggleButtonId
    // Interval this.timerInterval
    // boolean this.timerRunning
    constructor(totalTime, remainingTimeId, toggleButtonId, resetButtonId) {
        this.totalTime = totalTime;
        this.timeLeft = totalTime;
        this.endTime = -1;
        this.remainingTimeId = remainingTimeId;
        this.toggleButtonId = toggleButtonId;
        this.resetButtonId = resetButtonId;
        this.timerInterval = null;
        this.timerRunning = false;

        this.timerActiveColor = "black";
        this.timerDeactiveColor = "gray";
    }

    #updateTimer() {
        const timeLeftSeconds = Math.floor(this.timeLeft / 1000);
        const minutes = Math.floor(timeLeftSeconds / 60);
        const seconds = (timeLeftSeconds % 60);
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
        const currentTime = new Date().getTime();
        this.timeLeft = this.endTime - currentTime;
        clearInterval(this.timerInterval);
        this.timerRunning = false;
    }

    resumeTimer() {
        const currentTime = new Date().getTime();
        document.getElementById(this.remainingTimeId).style.color =
            this.timerActiveColor;
        document.getElementById(this.resetButtonId).disabled = false;
        if (this.timerRunning) {
            return;
        }
        this.endTime = currentTime + this.timeLeft;
        this.timerRunning = true;
        this.timerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            this.timeLeft = this.endTime - currentTime;
            if (this.timeLeft > 0) {
                this.#updateTimer();
            } else {
                this.resetTimer();
            }
        }, 50);
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
        document.getElementById(this.resetButtonId).disabled = true;
    }

    setTotalTime(totalTime) {
        this.totalTime = totalTime;
        resetTimer();
    }

    getTotalTime() {
        return this.totalTime;
    }
}

let mainTimer = new CountdownTimer(MAIN_TIME, "mainTimer", "mainTimerToggleButton", "mainTimerResetButton");
let penaltyTimers = [
    new CountdownTimer(PENALTY_TIME, "penaltyTimer1", "penaltyTimer1toggleButton", "penaltyTimer1resetButton"),
    new CountdownTimer(PENALTY_TIME, "penaltyTimer2", "penaltyTimer2toggleButton", "penaltyTimer2resetButton"),
    new CountdownTimer(PENALTY_TIME, "penaltyTimer3", "penaltyTimer3toggleButton", "penaltyTimer3resetButton"),
    new CountdownTimer(PENALTY_TIME, "penaltyTimer4", "penaltyTimer4toggleButton", "penaltyTimer4resetButton")
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
