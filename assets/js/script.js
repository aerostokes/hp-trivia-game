// Initiate variables 
var quizLength = 10;
var secondsLeft = 120;
var penaltySeconds = 10;
var startButton = document.getElementById("start");
var timerSpan = document.getElementById("timer");
var questionSpan = document.getElementById("question");
var answersOl = document.getElementById("answers");
var quiz = [], score = 0, question, answer, choices, questionIndex = 0

// Start Button click event
startButton.addEventListener("click", function() {
    quiz = generateQuiz();
    startTimer();
    setQuestion(questionIndex);
})

// Answer click event
answersOl.addEventListener("click", function (event) {
    if (event.target.textContent == answer) {
        questionIndex++;
        if (questionIndex <= quizLength) {setQuestion(questionIndex++);}
        else {
            alert("you win!");
        }
    }
    else if (event.target.matches("li")) {
        wrongAnswer(event.target);
    }
})

// Create triviaArray by pulling the specified number of questions from the full list in triviaSource.js
var generateQuiz = function() {
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
var startTimer = function() {
    timerSpan.textContent = secondsLeft;

    var countDown = setInterval(function(){
        secondsLeft--;
        timerSpan.textContent = secondsLeft;
    }, 1000);

    // if secondsLeft == 0 {}
}

// Remove current (if any) question and display new question on page
var setQuestion = function(index) {
    question = quiz[index].question;
    answer = quiz[index].answer;
    choices = quiz[index].wrongs.concat(answer);
    do {
        answersOl.removeChild(answersOl.firstChild)
    } while (answersOl.children.length > 0);

    questionSpan.textContent = question;
    do {
        var newLi = document.createElement("li");
        var random = Math.floor(Math.random() * choices.length);
        newLi.textContent = choices[random];
        choices.splice(random,1);
        answersOl.appendChild(newLi);
    } while (choices.length > 0 );
}

var wrongAnswer = function(target) {
    secondsLeft = secondsLeft - penaltySeconds;
    target.setAttribute("style", "background: linear-gradient(-15deg, white, white 49%, red, white 51%, white);")
}


// Hermione
// NEWT
// OWL Ready
// Squib
// Muggle
// Well, you're either a troll or you fell asleep and a dark wizard attached your subconcious with fake premonitions. Go battle the forces of evil and come back when you're ready. \n\nWant to try again? 