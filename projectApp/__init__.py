import sys
sys.path.insert(0,"/var/www/html/myProject/FlaskApp/")
from flask import Flask, render_template
from projectApp.read_data import get_planet_data

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

@app.route("/")
def index():
    data = get_planet_data()
    return render_template("index.html", data=data)

@app.route("/zoom")
def zoom():
    data = get_planet_data()
    return render_template("zoom.html", data=data)

if __name__ == "__main__":
    app.run()