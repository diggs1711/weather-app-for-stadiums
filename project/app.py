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


@app.route('/stadiums.json', methods=['GET'])
def get_stadium_data():
    data = read_data('stadiums_20150302.csv')
    d = extract_data(data)
    weather = create_array_of_weather_data_objects(d)

    return jsonify(weather)


def create_array_of_weather_data_objects(dat):
    pArr = {"stadiums": []}

    print("GETTING VALUES")

    for d in dat["stadiums"]:
        p = get_weather_data(str(d['city']), d['team'], d['capacity'])
        pArr["stadiums"].append(p)

    return pArr


def get_weather_data(city, team, capacity):
    owm = pyowm.OWM('3de7fb8fb1c069056680599cc817d3cb')

    observation = owm.weather_at_place(city)

    w = observation.get_weather()
    w.get_humidity()

    temp = str(w.get_temperature('celsius')['temp'])
    wspeed = str(w.get_wind()['speed'])
    d = {}

    d["city"] = city
    d["temp"] = temp
    d["wind_speed"] = wspeed
    d["team"] = team
    d["capacity"] = str(capacity)

    return d


def read_data(f):
    f = os.path.join(os.path.dirname(__file__), f)

    return pd.read_csv(f, index_col=1, encoding="utf-8").to_dict()


def get_cities(d):
    return d['City'].values()


def get_team(d):
    return d['Team'].values()


def get_capacity(d):
    return d['Capacity'].values()


def extract_data(d):
    cities = get_cities(d)
    teams = get_team(d)
    capacity = get_capacity(d)
    data = {
        "stadiums": []
    }

    for ind, val in enumerate(cities):
        temp = {
            'city': cities[ind],
            'team': teams[ind],
            'capacity': capacity[ind]
        }

        data["stadiums"].append(temp)

    return data


if __name__ == '__main__':
    app.run(debug=True)
