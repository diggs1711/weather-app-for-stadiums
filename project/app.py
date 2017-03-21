from flask import Flask, render_template
from flask import jsonify
import pandas as pd
import os
import pyowm
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hello')
def hello():
    return render_template('hello.html')


@app.route('/stadiums')
def get_stadium_data():
    data = read_data('stadiums_20150302.csv')
    cities = get_cities(data)
    weather = create_array_of_weather_data_objects(cities)

    return jsonify(weather)


def create_array_of_weather_data_objects(cities):
    pArr = {"stadiums": []}

    print("GETTING VALUES")

    for c in cities:
        p = get_weather_data(str(c))
        pArr["stadiums"].append(p)

    return pArr


def get_weather_data(city):
    owm = pyowm.OWM('3de7fb8fb1c069056680599cc817d3cb')

    observation = owm.weather_at_place(city)

    w = observation.get_weather()
    w.get_wind()                  # {'speed': 4.6, 'deg': 330}
    w.get_humidity()              # 87

    temp = str(w.get_temperature('celsius')['temp'])
    wspeed = str(w.get_wind()['speed'])
    d = {}

    d["city"] = city
    d["temp"] = temp
    d["wind_speed"] = wspeed

    return d


def read_data(f):
    f = os.path.join(os.path.dirname(__file__), f)

    return pd.read_csv(f, index_col=1, encoding="utf-8").to_dict()


def get_cities(d):
    return d['City'].values()


if __name__ == '__main__':
    app.run(debug=True)
