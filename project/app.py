from flask import Flask, render_template
from flask import jsonify
import pandas as pd
import os
import pyowm
import json
import sys
from forecastiopy import *

reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)

api_key = "3403643b4b7d8e6fb46d1848e1267c02"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hello')
def hello():
    return render_template('hello.html')


@app.route('/stadiums.json', methods=['GET'])
def get_stadium_data():
    data = read_data('stadiums-premier-league.csv')
    d = extract_data(data)
    weather = create_array_of_weather_data_objects(d)

    return jsonify(weather)


def create_array_of_weather_data_objects(dat):
    pArr = {"stadiums": []}

    print("GETTING VALUES")

    for d in dat["stadiums"]:
        p = get_weather_data(str(d['city']), d['team'], d[
                             'capacity'], d["longitude"], d["latitude"])
        pArr["stadiums"].append(p)

    return pArr


def get_weather_data(city, team, capacity, lng, lat):
    fio = ForecastIO.ForecastIO(api_key, units=ForecastIO.ForecastIO.UNITS_SI,
                                lang=ForecastIO.ForecastIO.LANG_ENGLISH,
                                latitude=lat, longitude=lng)

    wspeed = 0
    code = 0
    icon = ""
    summary = ""
    temp = 0

    if fio.has_minutely() is True:
        minutely = FIOMinutely.FIOMinutely(fio)

        summary = minutely.summary
        icon = minutely.icon

    else:
        print 'No Minutely data'

    if fio.has_currently() is True:
        currently = FIOCurrently.FIOCurrently(fio)
        temp = currently.temperature
        wspeed = currently.windSpeed

    else:
        print 'No Currently data'

    d = {}

    d["city"] = city
    d["temp"] = temp
    d["wind_speed"] = wspeed
    d["team"] = team
    d["capacity"] = str(capacity)
    d["longitude"] = lng
    d["latitude"] = lat
    d["icon"] = icon
    d["status"] = summary

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


def get_longitude(d):
    return d['Longitude'].values()


def get_latitude(d):
    return d["Latitude"].values()


def extract_data(d):
    cities = get_cities(d)
    teams = get_team(d)
    capacity = get_capacity(d)
    Longitude = get_longitude(d)
    Latitude = get_latitude(d)
    data = {
        "stadiums": []
    }

    for ind, val in enumerate(cities):
        temp = {
            'city': cities[ind],
            'team': teams[ind],
            'capacity': capacity[ind],
            'longitude': Longitude[ind],
            'latitude': Latitude[ind]
        }

        data["stadiums"].append(temp)

    return data


if __name__ == '__main__':
    app.run(debug=True)
