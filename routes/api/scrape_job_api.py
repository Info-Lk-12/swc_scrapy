from __init__ import app
from models.scrape_job import get_scrape_job, get_scrape_jobs


@app.route("/api/scrape_jobs")
@app.route("/api/scrape_job/<uuid:string>")
def scrape_job_api_route(uuid=None):
    if uuid is None:
        return [scrape_job.formatted for scrape_job in get_scrape_jobs()]
    return get_scrape_job(uuid).formatted
