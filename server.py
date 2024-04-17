from flask import Flask, render_template, Response, request, jsonify
import json

app = Flask(__name__)

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

@app.route('/quiz-page/<int:question_id>')
def quiz_page(question_id):
    if question_id in questions:
        return render_template('quiz.html', question_id=question_id) 
    else:
        return "Question not found", 404

if __name__ == '__main__':
    app.run(debug=True)
