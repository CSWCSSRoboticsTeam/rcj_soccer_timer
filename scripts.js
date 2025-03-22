const MAIN_TIME = 10 * 60 * 1000; // 10 minutes game time in millis
const PENALTY_TIME = 60 * 1000; // 60 seconds penalty time in millis

const INTERVAL_SEPARATION = 50; // 50 ms separation between intervals => 20Hz refresh rate

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

// Use new Date() instead of counting intervals ran,
// as new Date() retrieves accurate and consistent time from system,
// but intervals are not guaranteed to run sharply at desired frequency.
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
        }, INTERVAL_SEPARATION);
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
        this.resetTimer();
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

function askForMainTime() {
    const prevMainTime = mainTimer.getTotalTime();
    const prevMainTimeSeconds = Math.floor(prevMainTime / 1000);

    const newMainTimeSecondsStr =
        prompt(
            "Enter Countdown Time for a Round (in seconds)\n" +
            "(Hint: enter 600 for 10 minutes, enter 300 for 5 minutes)"
            , prevMainTimeSeconds);
    if (newMainTimeSecondsStr == null) {
        // user cancelled
        return;
    }

    const newMainTimeSeconds = parseInt(newMainTimeSecondsStr, 10);
    if (isNaN(newMainTimeSeconds)) {
        alert("Error: countdown time is not a number.");
        return;
    }
    if (newMainTimeSeconds < 0) {
        alert("Error: countdown time cannot be negative.");
        return;
    }
    if (newMainTimeSeconds == 0) {
        alert("Error: countdown time cannot be 0.");
        return;
    }
    const newMainTime = newMainTimeSeconds * 1000;
    mainTimer.setTotalTime(newMainTime);
}

function askForPenaltyTime() {
    const prevPenaltyTime = penaltyTimers[0].getTotalTime();
    const prevPenaltyTimeSeconds = Math.floor(prevPenaltyTime / 1000);

    const newPenaltyTimeSecondsStr =
        prompt(
            "Enter Countdown Time for a Penalty (in seconds)\n" +
            "(Hint: enter 60 for 60 seconds, enter 30 for 30 seconds)"
            , prevPenaltyTimeSeconds);
    if (newPenaltyTimeSecondsStr == null) {
        // user cancelled
        return;
    }

    const newPenaltyTimeSeconds = parseInt(newPenaltyTimeSecondsStr, 10);
    if (isNaN(newPenaltyTimeSeconds)) {
        alert("Error: countdown time is not a number.");
        return;
    }
    if (newPenaltyTimeSeconds < 0) {
        alert("Error: countdown time cannot be negative.");
        return;
    }
    if (newPenaltyTimeSeconds == 0) {
        alert("Error: countdown time cannot be 0.");
        return;
    }
    const newPenaltyTime = newPenaltyTimeSeconds * 1000;
    penaltyTimers.forEach(penaltyTimer => {
        penaltyTimer.setTotalTime(newPenaltyTime);
    });
}

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

function getHour12(hour) {
    hour %= 12;
    if (hour == 0) {
        return 12;
    } else {
        return hour;
    }
}

function guaranteePaddingZero(value) {
    return `${value < 10 ? "0" : ""}${value}`;
}

function mainBegin() {
    mainTimer.resetTimer();
    penaltyTimers.forEach(penaltyTimer => {
        penaltyTimer.resetTimer();
    });

    setInterval(updateRealTimeDisplay, INTERVAL_SEPARATION);
}

function updateRealTimeDisplay() {
    const monthArray = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    const weekArray = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    // get current timestamp
    const date = new Date();

    // convert into human-readable string formats
    const year = date.getFullYear();
    const month = monthArray[date.getMonth()];
    const dayInMonth = date.getDate();
    const dayInWeek = weekArray[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const millis = date.getMilliseconds();

    const timeSep = ((millis % 1000) < 500) ? ":" : " ";
    const ampm = hours < 12 ? "AM" : "PM";

    // combine into a single string to be displayed
    const dateTimeString =
        `${year} ${month} ${dayInMonth} (${dayInWeek}) ` +
        getHour12(hours) + timeSep +
        guaranteePaddingZero(minutes) + timeSep +
        guaranteePaddingZero(seconds) + ` ${ampm}`;
    
    document.getElementById("realTimeLabel").textContent = dateTimeString;
    document.getElementById("authorLabelYear").textContent = year;
}