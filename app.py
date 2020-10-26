from flask import Flask, render_template, jsonify
from read_data import get_planet_data

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Read data from database using SQL alchemy, and store to a variable
# This function is located in read_data.py
data = get_planet_data()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/charts")
def charts():
    return render_template("charts.html")

@app.route("/glossary")
def glossary():
    return render_template("glossary.html")

@app.route("/further")
def further():
    return render_template("further.html")

@app.route("/observatory")
def observatory():
    return render_template("observatory.html")

# API that provides data to JS files
@app.route("/api")
def api():
    return jsonify(data)

if __name__ == "__main__":
    app.run()