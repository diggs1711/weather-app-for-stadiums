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
lat = 53.3349740
lng = -6.3320550

fio = ForecastIO.ForecastIO(api_key, units=ForecastIO.ForecastIO.UNITS_SI,
                            lang=ForecastIO.ForecastIO.LANG_ENGLISH,
                            latitude=lat, longitude=lng)

if fio.has_currently() is True:
    currently = FIOCurrently.FIOCurrently(fio)
    print 'Currently'
    for item in currently.get().keys():
        print item + ' : ' + unicode(currently.get()[item])
    print
    # Or access attributes directly
    print currently.temperature
    print currently.humidity
    print
else:
    print 'No Currently data'



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


def get_weather_data(city, team, capacity, longitude, lat):
    owm = pyowm.OWM('3de7fb8fb1c069056680599cc817d3cb')

    observation = owm.weather_at_place(city)
    l = observation.get_location()

    w = observation.get_weather()
    w.get_humidity()

    temp = str(w.get_temperature('celsius')['temp'])
    wspeed = str(w.get_wind()['speed'])

    code = w.get_weather_code()
    status = w.get_status()
    d = {}

    d["city"] = city
    d["temp"] = temp
    d["wind_speed"] = wspeed
    d["team"] = team
    d["capacity"] = str(capacity)
    d["longitude"] = longitude
    d["latitude"] = lat
    d["code"] = code
    d["status"] = status

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
