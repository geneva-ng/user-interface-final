$(document).ready(function() {
    let currentQuestionIndex = 0;
    let questions = [];
    let answers = [];
    let scores = new Array(questions.length).fill(false); // Track if a question has been correctly answered


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
        if (index >= questions.length) {  // If no more questions, submit answers and show results
            submitAnswers();
            return;
        }
    
        let quizContainer = $('#quizContainer');
        quizContainer.empty();  // Clear previous contents
    
        let question = questions[index];
        let questionHtml = `<div class='question'><h3>Q${index + 1}: ${question.prompt}</h3>`;
    
        if (question.type === 'multiple-choice') {
            questionHtml += '<ul class="list-unstyled">';
            question.options.forEach((option, optionIndex) => {
                const checked = answers[index] === option ? "checked" : "";
                questionHtml += `<li><input type='radio' name='question${index}' value='${option}' ${checked}> ${option}</li>`;
            });
            questionHtml += '</ul>';
        }
    
        questionHtml += `<div id='feedback' class='feedback'></div></div>`;
        quizContainer.html(questionHtml);
    
        quizContainer.append(`<button id="checkAnswer" class="btn btn-info">Check Answer</button>`);
        $('#checkAnswer').on('click', function() {
            checkAnswer(index);
        });
    
        quizContainer.append(`<button id="nextQuestion" class="btn btn-primary">Next Question</button>`);
        $('#nextQuestion').on('click', function() {
            $('#feedback').empty(); // Clear feedback when moving to next question
            collectAnswer(index);
            displayQuestion(index + 1);
        });
    }
    
    
    // function checkAnswer(index) {
    //     let selectedOption = $(`input[name='question${index}']:checked`).val();
    //     let correctAnswer = questions[index].correct_answer;
    //     let feedbackElement = $('#feedback');
    //     let feedback = selectedOption === correctAnswer ? "<span style='color: white;'>Correct!</span>" : `Wrong, the correct answer was <strong>${correctAnswer}</strong>`;
    //     feedbackElement.html(feedback);
    // }

    function checkAnswer(index) {
        let selectedOption = $(`input[name='question${index}']:checked`).val();
        let correctAnswer = questions[index].correct_answer;
        let feedbackElement = $('#feedback');

        if (selectedOption === correctAnswer) {
            if (!scores[index]) { // If the question hasn't been marked correct before
                scores[index] = true; // Mark as correctly answered
                feedbackElement.html("<span style='color: white;'>Correct!</span>");
            } else {
                feedbackElement.html("<span style='color: white;'>Already answered correctly!</span>");
            }
        } else {
            feedbackElement.html(`Wrong, the correct answer was <strong>${correctAnswer}</strong>`);
        }
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
        let score = scores.filter(isCorrect => isCorrect).length; // Count true values in the scores array
        $.ajax({
            url: '/submit_quiz',
            type: 'POST',
            data: JSON.stringify({ answers: answers, score: score }),
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
