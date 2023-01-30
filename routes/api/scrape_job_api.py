from __init__ import app
from models.scrape_job import get_scrape_job, get_scrape_jobs, create_scrape_job, update_scrape_job, delete_scrape_job

from flask import request


@app.route("/api/scrape_jobs", methods=["GET", "POST"])
@app.route("/api/scrape_job/<uuid:string>", methods=["GET", "PUT"])
def scrape_job_api_route(uuid=None):
    if request.method in ["POST", "PUT"]:
        if uuid is None:
            return create_scrape_job(**request.form).formatted
        return update_scrape_job(uuid, **request.form).formatted

    if uuid is None:
        return [scrape_job.formatted for scrape_job in get_scrape_jobs()]
    return get_scrape_job(uuid).formatted