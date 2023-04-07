var quizLength = 10;
var secondsAllotment = 300;
var penaltySeconds = 10;
var saveScoreButton = document.getElementById("saveScore")
var playerNameInput = document.getElementById("playerName")
var scoreSummarySpan = document.getElementById("scoreSummary")
var highScoresOl = document.getElementById("highScores")
var startButton = document.getElementById("start");
var scoreSpan = document.getElementById("score")
var timerSpan = document.getElementById("timer");
var questionSpan = document.getElementById("question");
var answersOl = document.getElementById("answers");
var startScreenSection = document.getElementById("startScreen");
var messageSpan = document.getElementById("message");
var playerForm = document.getElementById("playerBox");
var gameScreenSection = document.getElementById("gameScreen");
var timerSection = document.getElementById("timerBox");
var triviaSection = document.getElementById("triviaBox");
var highScoresArray, countDown, secondsLeft, question, answer, choices, firstAttempt = true;
var quiz = [], questionIndex = 0, score = 0

// On page load, set the screen to start mode and populate the highscores from local storage
setScreen("start");
fetchHighScores();

// Click Listeners
startButton.addEventListener("click", handlerStartClick);
answersOl.addEventListener("click", handlerAnswerClick);
saveScoreButton.addEventListener("click", handlerSaveScore);


// Poplate the highscores on the page from local storate
function fetchHighScores() {
    highScoresArray = JSON.parse(localStorage.getItem("highScores"));
    if (highScoresArray != null) {
        highScoresArray.forEach(highScore => {
            var newScoreLi = document.createElement("li");
            newScoreLi.textContent = highScore.name + " --- " + highScore.score + " +" + highScore.timeBonus + "s";
        highScoresOl.appendChild(newScoreLi);
        });
    }
    else highScoresArray = [];
}


// On start click, set the screen to game mode, generate the quiz questions, start the timer, and display the first question
function handlerStartClick() {
    setScreen("game")
    quiz = generateQuiz();
    startTimer();
    setQuestion(questionIndex);
}

// Reset variables and create triviaArray by pulling the specified number of questions from the full list in triviaSource.js
function generateQuiz() {
    quiz = [], questionIndex = 0, score = 0, secondsLeft = secondsAllotment;
    var randomNums = [], triviaArray = [];
    if (quizLength > triviaALL.length) quizLength = triviaALL.length;
    
    do {
        var random = Math.floor(Math.random() * triviaALL.length);
        if (!randomNums.includes(random)) randomNums.push(random);
    } while (randomNums.length<quizLength);

    randomNums.forEach(random => triviaArray.push(triviaALL[random]));
    return triviaArray;
}

// Timer Countdown
function startTimer() {
    timerSpan.textContent = secondsLeft + "s";
    countDown = setInterval(function(){
        secondsLeft--;
        timerSpan.textContent = secondsLeft + "s";
    }, 1000);

    if (secondsLeft <= 0) gameOver()
}


// On answer click, if the answer is correct, update the score and set the next question. If not, mark it incorrect and wait for another attempt
function handlerAnswerClick (event) {
    if (event.target.textContent == answer) {
        rightAnswer(event.target);
    }
    else if (event.target.matches("li")) {
        wrongAnswer(event.target);
    }
}


// When selecting a write answer, mark it correct 
function rightAnswer(target) {
    target.setAttribute("class", "right");
    setTimeout(() => {
        if (firstAttempt) score++;
        questionIndex++;
        if (questionIndex < quizLength) setQuestion(questionIndex);
        else gameOver();
    }, 500);
}

// Update the score, remove current (if any) question, and display next question 
function setQuestion(index) {
    scoreSpan.textContent = score + "/" + quizLength
    do {
        answersOl.removeChild(answersOl.firstChild)
    } while (answersOl.children.length > 0);

    question = quiz[index].question, answer = quiz[index].answer, choices = quiz[index].wrongs.concat(answer), firstAttempt = true;
    questionSpan.textContent = question;
    do {
        var newChoiceLi = document.createElement("li");
        var random = Math.floor(Math.random() * choices.length);
        newChoiceLi.textContent = choices[random];
        choices.splice(random, 1);
        answersOl.appendChild(newChoiceLi);
    } while (choices.length > 0 );
}

// End game and show results
function gameOver() {
    clearInterval(countDown);
    scoreSpan.textContent = score + "/" + quizLength;
    setScreen("gameover")

    var scorePercent = score / quizLength * 100
    if (scorePercent == 100) messageSpan.textContent = "Outstanding! That's a score that Hermione would be proud of!";
    else if (scorePercent >= 90) messageSpan.textContent = "Excellent! Looks like you're NEWT ready!";
    else if (scorePercent >= 80) messageSpan.textContent = "Good job! Keep studying for those OWL's";
    else if (scorePercent >= 70) messageSpan.textContent = "Not too bad...for a first year.";
    else if (scorePercent >= 60) messageSpan.textContent = "Hmm...you don't have any squibs in your family tree, do you..?";
    else if (scorePercent >= 50) messageSpan.textContent = "Nice try! You're obviously a muggle with a keen interest in the magical world";
    else messageSpan.textContent = "Well, you're either a troll or you fell asleep and a dark wizard attacked your subconcious with fake premonitions. Go battle the forces of evil and come back when you're ready.";
    scoreSummarySpan.textContent = "Score: " + score + "/" + quizLength + " +" + secondsLeft + "s time bonus";
    startButton.textContent = "Play Again" 
}

function setScreen(mode) {
    if (mode == "start") {
        startScreenSection.removeAttribute("style");
        playerForm.setAttribute("style", "display:none");
        gameScreenSection.setAttribute("style", "display:none");
    }
    else if (mode == "game") {
        startScreenSection.setAttribute("style", "display:none");
        gameScreenSection.removeAttribute("style");
    }
    else if (mode == "gameover") {
        startScreenSection.removeAttribute("style");
        playerForm.removeAttribute("style");
        gameScreenSection.setAttribute("style", "display:none");
    }
}

// When selecting a wrong answer, mark it incorrect and reduce timer by penaltySeconds. Temporarily change the timer class to indicate the penalty to the user
function wrongAnswer(target) {
    firstAttempt = false;
    secondsLeft = secondsLeft - penaltySeconds;
    target.setAttribute("class", "wrong");
    target.setAttribute("data-penalty", "Try Again")
    timerSpan.setAttribute("data-penalty", -penaltySeconds + "s");
    timerSpan.setAttribute("class", "penalty");
    setTimeout(() => {
        target.removeAttribute("data-penalty")
        timerSpan.removeAttribute("data-penalty");
        timerSpan.removeAttribute("class");
    }, 2000);
}


// Add a new score to the highscores list
function handlerSaveScore(event) {
    event.preventDefault();
    var newScoreObject = {
        name: playerNameInput.value,
        score: score + "/" + quizLength,
        timeBonus: secondsLeft
    };

    // Find the sorting rank of the new score into the array by descending score value then by descending time bonus value
    for (var rank = highScoresArray.length; rank > 0; rank--) {
        if (eval(score/quizLength) == eval(highScoresArray[rank-1].score)) {
            if (secondsLeft <= highScoresArray[rank-1].timeBonus) {break;}
        }
        else if (eval(score/quizLength) < eval(highScoresArray[rank-1].score)) {break;}
    }

    
    // Update the array and local storage
    highScoresArray.splice(rank, 0, newScoreObject);
    highScoresArray = highScoresArray.slice(0,10);
    localStorage.setItem("highScores", JSON.stringify(highScoresArray));

    // Update the ol on the page
    var newScoreLi = document.createElement("li");
    newScoreLi.textContent = newScoreObject.name + " --- " + newScoreObject.score + " +" + newScoreObject.timeBonus + "s";
    newScoreLi.setAttribute("style", "color: green;")
    highScoresOl.insertBefore(newScoreLi, (highScoresOl.children[rank] || null ))

    playerNameInput.value=""
    playerForm.setAttribute("style", "display:none");
}