from flask import Flask, render_template, Response, request, jsonify, redirect, url_for, session
import json
import time
import random
learnStartTime = None
learnEndTime = None


app = Flask(__name__)
app.secret_key = 'some_random_secret_key'  # Set to a random string

with open('./data/learn.json', 'r') as file:
    learn_data = json.load(file)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<int:id>')
def learn(id):
    global learnStartTime
    global learnEndTime
    if id ==1 and learnStartTime == None:
        learnStartTime = time.time()
    if id == 8:
        learnEndTime = time.time()
        print(f"Total learning time in seconds: {learnEndTime - learnStartTime}")
    for data in learn_data:
        if data["id"] == id:
            return render_template('learn.html', data=data)

#  QUIZ SECTION ----------------------------------------------------------------------------------------------

with open('./data/quiz.json', 'r') as file:
    quiz_data = json.load(file)["questions"]

# RENDERS THE HTML FOR THE QUIZ
@app.route('/start_quiz')
def start_quiz():
    return render_template('quiz.html')

# SENDS THE JSON DATA AROUND (CONFIRMED SUCCESSFUL)
@app.route('/quiz')
def quiz():
    # Randomly select 10 questions
    selected_questions = random.sample(quiz_data, 10)
    session['questions'] = selected_questions
    return jsonify(questions=[q for q in selected_questions])


@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    answers = request.json.get('answers')
    correct = 0
    for answer, question in zip(answers, session.get('questions', [])):
        if question['type'] == 'multiple-choice' and answer == question['correct_answer']:
            correct += 1
        elif question['type'] == 'drag-and-drop' and answer == question['correct_answer']:
            correct += 1
    return jsonify(score=correct, total=len(session['questions']))

@app.route('/results')
def results():
    return render_template('results.html', score=session.get('score'), total=len(session.get('questions', [])))

# ----------------------------------------------------------------------------------------------


if __name__ == '__main__':
    app.run(debug=True)
