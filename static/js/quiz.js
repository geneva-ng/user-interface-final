$(document).ready(function() {
    let currentQuestionIndex = 0;
    let questions = [];
    let answers = [];

    $('#startQuiz').on('click', function() {
        $('.quiz-intro').hide();
        $('#quizContainer').show();

        $.ajax({
            url: '/quiz',
            type: 'GET',
            success: function(data) {
                questions = data.questions;
                questions = shuffleArray(questions); // Shuffle the questions
                currentQuestionIndex = 0;
                answers = new Array(questions.length).fill(null); // Initialize answers array
                displayQuestion(currentQuestionIndex); // Display the first question
            },
            error: function(error) {
                console.error('Error fetching quiz data:', error);
            }
        });
    });

    function displayQuestion(index) {
        if (index >= questions.length) {
            submitAnswers();
            return;
        }

        let quizContainer = $('#quizContainer');
        quizContainer.empty(); // Clear previous contents

        let question = questions[index];
        console.log("Displaying question:", question); // Logs the current question

        if (!question.options && question.type === 'multiple-choice') {
            console.error("Options missing for multiple-choice question:", question);
        }

        let questionHtml = `<div class='question'><h3>Q${index + 1}: ${question.prompt}</h3>`;

        if (question.type === 'multiple-choice') {
            questionHtml += '<ul class="list-unstyled">';
            question.options.forEach((option, optionIndex) => {
                const checked = answers[index] === option ? "checked" : "";
                questionHtml += `<li><input type='radio' name='question${index}' value='${option}' ${checked}> ${option}</li>`;
            });
            questionHtml += '</ul>';
        } else if (question.type === 'drag-and-drop') {
            questionHtml += '<ul class="sortable">';
            question.items.forEach(item => {
                questionHtml += `<li class='ui-state-default' data-item='${item}'>${item}</li>`;
            });
            questionHtml += '</ul>';
        }

        questionHtml += '</div>';
        quizContainer.html(questionHtml);

        if (question.type === 'drag-and-drop') {
            initSortable();
        }

        quizContainer.append(`<button id="nextQuestion" class="btn btn-primary">Next Question</button>`);
        $('#nextQuestion').on('click', function() {
            collectAnswer(index);
            displayQuestion(index + 1);
        });
    }

    function initSortable() {
        $(".sortable").sortable();
        $(".sortable").disableSelection();
    }

    function collectAnswer(index) {
        if (questions[index].type === 'multiple-choice') {
            let selectedOption = $(`input[name='question${index}']:checked`).val();
            answers[index] = selectedOption;
        } else if (questions[index].type === 'drag-and-drop') {
            let sortedItems = $(".sortable").sortable("toArray", { attribute: "data-item" });
            answers[index] = sortedItems;
        }
    }

    function submitAnswers() {
        $.ajax({
            url: '/submit_quiz',
            type: 'POST',
            data: JSON.stringify({ answers: answers }),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                showResults(response.score, response.total);
            }
        });
    }

    function showResults(score, total) {
        $('#quizContainer').empty().html(`<h2>Your Score: ${score}/${total}</h2>`);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});

$(document).ready(function() {
    let currentQuestionIndex = 0;
    let questions = [];
    let answers = [];

    $('#startQuiz').on('click', function() {
        $('.quiz-intro').hide();
        $('#quizContainer').show();

        $.ajax({
            url: '/quiz/questions',
            type: 'GET',
            success: function(data) {
                questions = data.questions;
                questions = shuffleArray(questions); // Shuffle the questions
                currentQuestionIndex = 0;
                answers = new Array(questions.length).fill(null); // Initialize answers array
                displayQuestion(currentQuestionIndex); // Display the first question
            },
            error: function(error) {
                console.error('Error fetching quiz data:', error);
            }
        });
    });

    function displayQuestion(index) {
        let quizContainer = $('#quizContainer');
        quizContainer.empty(); // Clear previous contents

        if (index >= questions.length) {
            submitAnswers();
            return;
        }

        let question = questions[index];
        console.log("Displaying question:", question);

        let questionHtml = `<div class='question animate-fade-in'><h3>Q${index + 1}: ${question.prompt}</h3>`;

        if (question.type === 'multiple-choice') {
            questionHtml += '<ul class="options-list">';
            question.options.forEach((option, optionIndex) => {
                const checked = answers[index] === option ? "checked" : "";
                questionHtml += `<li><input type='radio' name='question${index}' value='${option}' ${checked}> ${option}</li>`;
            });
            questionHtml += '</ul>';
        }

        questionHtml += '</div>';
        quizContainer.html(questionHtml);

        quizContainer.append(`<button id="nextQuestion" class="btn btn-primary">Next Question</button>`);
        $('#nextQuestion').on('click', function() {
            collectAnswer(index);
            displayQuestion(index + 1);
        });
    }

    function collectAnswer(index) {
        let selectedOption = $(`input[name='question${index}']:checked`).val();
        answers[index] = selectedOption;
    }

    function submitAnswers() {
        $.ajax({
            url: '/quiz/submit',
            type: 'POST',
            data: JSON.stringify({ answers: answers }),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                showResults(response.score, response.total);
            }
        });
    }

    function showResults(score, total) {
        $('#quizContainer').hide();
        $('#quizResults').show().empty().html(`<h2>Your Score: ${score}/${total}</h2><button class="btn btn-primary" onclick="location.reload()">Try Again</button>`);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
