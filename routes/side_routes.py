from __init__ import app
from scraper import ScrapeJob
from models.scrape_job import get_scrape_jobs


@app.route("/favicon")
def favicon():
    return "favicon"


@app.route('/test')
def test_route():

    li = []
    res = get_scrape_jobs()
    for job in res:
        sj = ScrapeJob(job)
        sj.execute()
        li.append(sj.scrape_result.to_dict())

    return {'result': li}
