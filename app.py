from flask import Flask, jsonify, request, render_template
import pandas as pd
import random

app = Flask(__name__, static_folder="static", template_folder="templates")

# Load dataset
df = pd.read_csv("tiny_tales_glossary.csv", delimiter='|').dropna()
data = df.to_dict(orient='records')

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start-quiz", methods=["GET"])
def start_quiz():
    quiz_questions = random.sample(data, 10)  # Get 10 random non-repeating questions
    formatted_questions = []

    for item in quiz_questions:
        correct = item["entity"]
        description = item["description"]
        # Pick 3 wrong options
        wrongs = random.sample([d["entity"] for d in data if d["entity"] != correct], 3)
        options = wrongs + [correct]
        random.shuffle(options)

        formatted_questions.append({
            "description": description,
            "options": options,
            "answer": correct
        })

    return jsonify(formatted_questions)

if __name__ == "__main__":
    app.run(debug=True)
