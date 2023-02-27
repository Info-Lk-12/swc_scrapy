from __init__ import app
from flask import render_template

from models.scrape_result import get_scrape_results, get_scrape_result_by_id


@app.route("/viz/penny")
@app.route("/viz/penny/<id_>")
def viz_penny(id_=None):
    if id_ is None:
        scrape_result = get_scrape_results().pop()
    else:
        scrape_result = get_scrape_result_by_id(id_)

    return render_template("viz/penny.html", result=scrape_result)
