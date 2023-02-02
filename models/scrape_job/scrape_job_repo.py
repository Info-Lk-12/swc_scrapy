from models.scrape_job import ScrapeJobModel


def create_scrape_job(*args, **kwargs):
    return ScrapeJobModel.create_from_web(*args, **kwargs)


def update_scrape_job(uuid: str, name: str = None, url: str = None, request_method: str = None, search_patterns: dict = None,
                      request_params: dict[str, str] = None, request_body: dict[str, str] = None, request_headers: list[str] = None):
    job_model = ScrapeJobModel.query.filter_by(uuid=uuid).first()
    if name is not None:
        job_model.name = name
    if url is not None:
        job_model.url = url
    if request_method is not None:
        job_model.request_method = request_method
    if search_patterns is not None:
        job_model.search_patterns = search_patterns
    if request_params is not None:
        job_model.request_params = request_params
    if request_body is not None:
        job_model.request_body = request_body
    if request_headers is not None:
        job_model.request_headers = request_headers
    job_model.commit()

    return job_model


def delete_scrape_job(uuid: str):
    job_model = ScrapeJobModel.query.filter_by(uuid=uuid).first()
    job_model.delete()


def get_scrape_job(uuid: str):
    return ScrapeJobModel.query.filter_by(uuid=uuid).first()


def get_scrape_jobs(uuids: list[str] = None):
    if uuids is None:
        return ScrapeJobModel.query.all()
    return ScrapeJobModel.query.filter(ScrapeJobModel.uuid.in_(uuids)).all()
