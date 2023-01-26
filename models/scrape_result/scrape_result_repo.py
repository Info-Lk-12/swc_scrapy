from models.scrape_result import ScrapeResultModel


def create_scrape_result(*args, **kwargs):
    return ScrapeResultModel.create(*args, **kwargs)


def delete_scrape_result(uuid: str):
    result_model = ScrapeResultModel.query.filter_by(uuid=uuid).first()
    result_model.delete()


def get_scrape_result(uuid: str):
    return ScrapeResultModel.query.filter_by(uuid=uuid).first()


def get_scrape_results(uuids: list[str] = None):
    if uuids is None:
        return ScrapeResultModel.query.all()
    return ScrapeResultModel.query.filter(ScrapeResultModel.uuid.in_(uuids)).all()
