const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text"));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");
const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

function csvToArray(str, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  return arr;
}

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = csvFile.files[0];
  const reader = new FileReader();
  let questionsObject;

  reader.onload = function (e) {
    const text = e.target.result;
    console.log(text);
    const data = csvToArray(text);

    let questions = data;
    console.log(questions);
    const score_points = 10;
    const max_questions = questions.length;

    startGame = () => {
      questionCounter = 0;
      score = 0;
      console.log([...questions]);
      availableQuestions = [...questions];
      console.log(availableQuestions);
      getNewQuestion();
    };
    getNewQuestion = () => {
      if (availableQuestions.length === 0 || questionCounter > max_questions) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("end.html");
      }

      questionCounter++;
      progressText.innerText = `Question ${questionCounter} of ${max_questions}`;
      progressBarFull.style.width = `${
        (questionCounter / max_questions) * 100
      }%`;

      const questionsIndex = Math.floor(
        Math.random() * availableQuestions.length
      );
      currentQuestion = availableQuestions[questionsIndex];
      question.innerText = currentQuestion.question;

      choices.forEach((choice) => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
      });

      availableQuestions.splice(questionsIndex, 1);
      acceptingAnswers = true;
    };

    choices.forEach((choice) => {
      choice.addEventListener("click", (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        let correctAnswerHighlight = currentQuestion.answer;
        let correctChoice = document.querySelector(
          `[data-number="${correctAnswerHighlight}"]`
        );

        let classToApply =
          selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
          incremementScore(score_points);
        } else if (classToApply === "incorrect") {
          // Highlight the correct answer
          // Select the class choice-container where one of the children has a data-number class with currentQuestion.answer
        }
        correctChoice.parentElement.classList.add("correct");
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
          selectedChoice.parentElement.classList.remove(classToApply);
          correctChoice.parentElement.classList.remove("correct");
          getNewQuestion();
          console.log("New Question");
        }, 1000);
      });
    });

    incremementScore = (num) => {
      score += num;
      scoreText.innerText = score;
    };

    startGame();
  };

  reader.readAsText(input);
});

// let questions = [
//   {
//     question: "What is 2 + 2",
//     choice1: "2",
//     choice2: "4",
//     choice3: "12",
//     choice4: "21",
//     answer: 2,
//   },
//   {
//     question: "What is 21 + 2",
//     choice1: "2",
//     choice2: "4",
//     choice3: "23",
//     choice4: "21",
//     answer: 3,
//   },
//   {
//     question: "What is 12 + 12",
//     choice1: "2",
//     choice2: "21",
//     choice3: "12",
//     choice4: "24",
//     answer: 4,
//   },
//   {
//     question: "What is 12 + 10",
//     choice1: "22",
//     choice2: "4",
//     choice3: "12",
//     choice4: "21",
//     answer: 1,
//   },
//   {
//     question: "Will This work?",
//     choice1: "Yes",
//     choice2: "No",
//     choice3: "12",
//     choice4: "21",
//     answer: 1,
//   },
//   {
//     question: "What is my name?",
//     choice1: "Yes",
//     choice2: "No",
//     choice3: "12",
//     choice4: "21",
//     answer: 1,
//   },
//   {
//     question: "What time is it?",
//     choice1: "Yes",
//     choice2: "No",
//     choice3: "12",
//     choice4: "21",
//     answer: 1,
//   },
// ];
