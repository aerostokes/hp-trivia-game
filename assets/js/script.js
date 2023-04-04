// Declare variables 
var quizLength = 10;
var secondsAllotment = 300;
var penaltySeconds = 10;
var saveScoreButton = document.getElementById("saveScore")
var playerNameInput = document.getElementById("playerName")
var highScoresOl = document.getElementById("highScores")
var startButton = document.getElementById("start");
var scoreSpan = document.getElementById("score")
var timerSpan = document.getElementById("timer");
var questionSpan = document.getElementById("question");
var answersOl = document.getElementById("answers");
var highScoresArray, countDown, secondsLeft, question, answer, choices, firstAttempt = true;
var quiz = [], questionIndex = 0, score = 0

// On page load
fetchHighScores();

// Click Listeners
startButton.addEventListener("click", handlerStartClick);
answersOl.addEventListener("click", handlerAnswerClick);
saveScoreButton.addEventListener("click", handlerSaveScore);

// On start click, generate the quiz questions, start the timer, and display the first question
// TODO: Hide messageBox and highScoresBox, show scoreBox, timerBox, and triviaBox 
function handlerStartClick() {
    quiz = generateQuiz();
    startTimer();
    setQuestion(questionIndex);
}

// Reset variables and create triviaArray by pulling the specified number of questions from the full list in triviaSource.js
function generateQuiz() {
console.log("generateQuiz()")
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
    timerSpan.textContent = secondsLeft;
    countDown = setInterval(function(){
        secondsLeft--;
        timerSpan.textContent = secondsLeft;
    }, 1000);

    if (secondsLeft <= 0) gameOver()
}

// On answer click, if the answer is correct, update the score and set the next question. If not, mark it incorrect and wait for another attempt
function handlerAnswerClick (event) {
    if (event.target.textContent == answer) {
        if (firstAttempt) score++;
        questionIndex++;
        if (questionIndex < quizLength) setQuestion(questionIndex);
        else gameOver();
    }
    else if (event.target.matches("li")) {
        wrongAnswer(event.target);
    }
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

// When selecting a wrong answer, mark it incorrect and reduce timer by penaltySeconds. Temporarilty change the timer class to indicate the penalty to the user
function wrongAnswer(target) {
    firstAttempt = false;
    secondsLeft = secondsLeft - penaltySeconds;
    target.setAttribute("style", "background: linear-gradient(-15deg, white, white 49%, red, white 51%, white);");
    timerSpan.setAttribute("data-penalty", -penaltySeconds + "s");
    timerSpan.setAttribute("class", "penalty");
    setTimeout(() => {
        timerSpan.removeAttribute("data-penalty");
        timerSpan.removeAttribute("class");
    }, 2000);
}

function gameOver() {
    clearInterval(countDown);
    scoreSpan.textContent = score + "/" + quizLength;
console.log("Game Over. You got " + score + "/" + quizLength + " answers correct on the first try with " + secondsLeft + " seconds left to spare.")
}

// Hermione
// NEWT
// OWL Ready
// Squib
// Muggle
// Well, you're either a troll or you fell asleep and a dark wizard attached your subconcious with fake premonitions. Go battle the forces of evil and come back when you're ready. \n\nWant to try again? 

// Poplate the highscores on the page from local storate

function fetchHighScores() {
    highScoresArray = JSON.parse(localStorage.getItem("highScores"));
    if (highScoresArray != null) {
        highScoresArray.forEach(highScore => {
            var newScoreLi = document.createElement("li");
            newScoreLi.textContent = highScore.name + " -- " + highScore.score + " -- " + highScore.timeBonus;
        highScoresOl.appendChild(newScoreLi);
        });
    }
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
    localStorage.setItem("highScores", JSON.stringify(highScoresArray));

    // Update the ol on the page
    var newScoreLi = document.createElement("li");
    newScoreLi.textContent = newScoreObject.name + " -- " + newScoreObject.score + " -- " + newScoreObject.timeBonus;
    highScoresOl.insertBefore(newScoreLi, (highScoresOl.children[rank] || null ))
}


