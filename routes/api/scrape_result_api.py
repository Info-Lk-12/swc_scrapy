from __init__ import app
from models.scrape_result import get_scrape_results, get_scrape_result


@app.route("/api/scrape_results")
@app.route("/api/scrape_result/<string:uuid>")
def scrape_result_api_route(uuid=None):
    if uuid is None:
        return [r.formatted for r in get_scrape_results()]
    return get_scrape_result(uuid).formatted
