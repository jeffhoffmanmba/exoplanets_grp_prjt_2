import sys
sys.path.insert(0,"/var/www/html/myProject/FlaskApp/")
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from projectApp.db_engine import eng

def get_planet_data():
    engine = create_engine(eng)
    Base = automap_base()
    Base.prepare(engine, reflect = True)

    Planets = Base.classes.planets
    Stars = Base.classes.stars

    session = Session(engine)

    p_query = session.query(Planets.name, Planets.host_star, Planets.radius_e, Planets.temp_f, Planets.habit_code, Planets.circumference_k)
    s_query = session.query(Stars.star, Stars.temp_k, Stars.radius_s, Stars.gravity, Stars.gal_lat, Stars.gal_long, Stars.distance)

    p_keys = ["name", "host_star", "radius_e", "temp_f", "habit_code", "circumference_k"]
    s_keys = ["star", "temp_k", "radius_s", "gravity", "gal_lat", "gal_long", "distance"]
    data = {
        "stars": [],
        "planets": [],
    }

    for row in p_query:
        temp_dict = {}
        for (key, i) in zip(p_keys, range(len(row))):
            temp_dict[key] = row[i]    
            data["planets"].append(temp_dict)

    for row in s_query:
        temp_dict = {}
        for (key, i) in zip(s_keys, range(len(row))):
            temp_dict[key] = row[i]    
            data["stars"].append(temp_dict)

    return data