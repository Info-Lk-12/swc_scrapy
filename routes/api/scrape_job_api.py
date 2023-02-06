import json

from __init__ import app
from models.scrape_job import get_scrape_job, get_scrape_jobs, create_scrape_job, update_scrape_job, delete_scrape_job
from scraper import run_scrape_for_jobs_sync

from flask import request, make_response
from utils.request_codes import RequestCode


@app.route("/api/scrape_jobs", methods=["GET", "POST"])
@app.route("/api/scrape_job/<string:uuid>", methods=["GET", "PUT", "DELETE"])
def scrape_job_api_route(uuid=None):
    if request.method in ["POST", "PUT"]:
        if uuid is None:
            return create_scrape_job(**request.form).formatted
        return update_scrape_job(uuid, **request.form).formatted

    if request.method == "DELETE" and uuid is not None:
        delete_scrape_job(uuid)
        return make_response("", RequestCode.Success.OK)

    if uuid is None:
        return [scrape_job.formatted for scrape_job in get_scrape_jobs()]
    return get_scrape_job(uuid).formatted


@app.route("/api/scrape_jobs/run", methods=["POST"])
def run_scrape_jobs_api_route():
    jobs = request.form.get("jobs")
    scrape_jobs = [get_scrape_job(uuid) for uuid in json.loads(jobs)]
    run_scrape_for_jobs_sync(scrape_jobs)
    return "done"
