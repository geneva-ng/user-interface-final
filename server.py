from flask import Flask, render_template, Response, request, jsonify, redirect, url_for, session
import json

app = Flask(__name__)
app.secret_key = 'some_random_secret_key'  # Set to a random string

with open('./data/learn.json', 'r') as file:
    learn_data = json.load(file)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<int:id>')
def learn(id):
    for data in learn_data:
        if data["id"] == id:
            return render_template('learn.html', data=data)

@app.route('/cappuccino')
def cappuccino():
    return render_template('cappuccino.html')

@app.route('/macchiato')
def macchiato():
    return render_template('macchiato.html')

@app.route('/iced_coffee')
def iced_coffee():
    return render_template('iced_coffee.html')

@app.route('/latte')
def latte():
    return render_template('latte.html')

@app.route('/espresso')
def espresso():
    return render_template('espresso.html')

@app.route('/americano')
def americano():
    return render_template('americano.html')

with open('./data/quiz.json', 'r') as f:
    quiz_data = json.load(f)

@app.route('/quiz')
def start_quiz():
    return render_template('start_quiz.html')

@app.route('/quiz/<int:question_id>')
def quiz(question_id):
    questions = quiz_data['questions']
    question = next((q for q in questions if q['id'] == question_id), None)
    if question:
        return render_template('quiz.html', question=question)
    else:
        return "Question not found", 404
    
@app.route('/results', methods=['GET'])
def results():
    user_answers = session['answers']
    score = 0
    for question_id, user_answer in user_answers.items():
        correct_answer = answers.get(question_id)
        if user_answer == correct_answer:  
            score += 1

    total_questions = len(answers)
    result_percentage = (score / total_questions) * 100

    session.pop('answers', None)
    return render_template('results.html', score=score, total_questions=total_questions, result_percentage=result_percentage)


@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    question_id = int(request.form['question_id'])
    selected_answers = request.form.getlist('answers')

    # Store answers in session
    if 'answers' not in session:
        session['answers'] = {}
    session['answers'][str(question_id)] = selected_answers

    # Prepare to redirect to the next question
    next_question_id = question_id + 1
    return redirect(url_for('quiz', question_id=next_question_id))


if __name__ == '__main__':
    app.run(debug=True)
