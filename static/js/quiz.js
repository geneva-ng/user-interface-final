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
                displayQuestion(currentQuestionIndex); // Display the first question
            },
            error: function(error) {
                console.error('Error fetching quiz data:', error);
            }
        });
    });

    function displayQuestion(index) {
        if (!questions[index]) {
            console.error("No question found at index:", index);
            return; // Stop further execution if the question is undefined
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
                questionHtml += `<li><input type='radio' name='question${index}' value='${option}'> ${option}</li>`;
            });
            questionHtml += '</ul>';
        } else if (question.type === 'drag-and-drop') {
            questionHtml += '<ul class="sortable">';
            question.items.forEach(item => {
                questionHtml += `<li class='ui-state-default'>${item}</li>`;
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
            if (index < questions.length - 1) {
                displayQuestion(index + 1);
            } else {
                submitAnswers();
            }
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
});
