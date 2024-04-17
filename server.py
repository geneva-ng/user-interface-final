from flask import Flask, render_template, Response, request, jsonify
import json
import time

app = Flask(__name__)
learnStartTime = None
learnEndTime = None

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

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

if __name__ == '__main__':
    app.run(debug=True)
