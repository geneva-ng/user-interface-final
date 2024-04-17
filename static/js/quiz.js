console.log("quiz.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    const startTime = 5;  // Duration of the quiz timer in minutes
    let timeLeft = startTime * 60;  // Time left in seconds

    const timerDisplay = document.getElementById('timer');
    const quizForm = document.getElementById('quiz-form');

    function updateTimer() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            quizForm.submit();  // Submit the quiz form when the time is up
        }
    }

    let timerInterval = setInterval(updateTimer, 1000);

});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quiz-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the form from submitting normally

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        }).then(response => {
            if (response.ok) {
                return response.json();  // Convert the response body to JSON
            }
            throw new Error('Network response was not ok.');
        }).then(data => {
            window.location.href = data.next_url;  // Redirect to the next question
        }).catch(error => console.error('Error:', error));
    });
});
