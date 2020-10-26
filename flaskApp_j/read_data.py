from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from db_engine import eng

def get_planet_data():
    engine = create_engine(eng)
    Base = automap_base()
    Base.prepare(engine, reflect = True)

    StackedChart = Base.classes.stackedchart
    BarChart = Base.classes.barchart
    Exo = Base.classes.exoplanets
    Further = Base.classes.furtherinterest
    Glossary = Base.classes.glossary

    session = Session(engine)

    s_query = session.query(StackedChart.year, StackedChart.radialvelocity, StackedChart.transit, StackedChart.imaging, StackedChart.microlensing)
    b_query = session.query(BarChart.type, BarChart.number, BarChart.percent)
    e_query = session.query(Exo.exoPlanetName, Exo.PlanetMassEst, Exo.PlanetRadiusEst, Exo.PlanetTempType, Exo.PlanetDetection, Exo.DiscoverYr, Exo.StarConst, Exo.PotHabitableOptimistic, Exo.PotHabitableConservative, Exo.LastUpdate, Exo.StarRtAsc, Exo.StarDistance)
    g_query = session.query(Glossary.name, Glossary.value, Glossary.description, Glossary.more_info)
    f_query = session.query(Further.cat, Further.name, Further.duration, Further.description, Further.link)

    queries = [s_query, b_query, e_query, g_query, f_query]

    s_keys = ["year", "RadialVelocity", "Transit", "Imaging", "Microlensing"]
    b_keys = ["type", "number", "percent"]
    e_keys = ["exoPlanetName", "PlanetMassEst", "PlanetRadiusEst", "PlanetTempType", "PlanetDetection", "DiscoverYr", "StarConst", "PotHabitableOptimistic", "PotHabitableConservative", "LastUpdate", "StarRtAsc", "StarDistance"]
    g_keys = ["name", "value", "description", "more_info"]
    f_keys = ["Cat", "Name", "Duration", "Description", "Link"]

    keys = [s_keys, b_keys, e_keys, g_keys, f_keys]

    data = {
        "stackedChart": [],
        "barChart": [],
        "exoplanets": [],
        "glossary": [],
        "furtherInterest": []
    }

    for (query, i) in zip(queries, range(len(queries))):
        for row in query:
            temp_dict = {}
            for (key, j) in zip(keys[i], range(len(row))):
                temp_dict[key] = row[j]
            data[list(data.keys())[i]].append(temp_dict)

    return data