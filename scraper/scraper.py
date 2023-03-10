import asyncio
from scraper import ScrapeJob
from models.scrape_job import ScrapeJobModel
from models.scrape_result import ScrapeResultModel


async def run_scrape_for(scrape_job: ScrapeJobModel, callback: callable = None) -> ScrapeResultModel:
    scrape_job = ScrapeJob(scrape_job)
    result = scrape_job.execute()
    if callback:
        callback(result.to_dict())
    return result


async def run_scrape_for_jobs(scrape_jobs: list[ScrapeJobModel], callback: callable = None):
    tasks = [run_scrape_for(job, callback) for job in scrape_jobs]
    return await asyncio.gather(*tasks)


def run_scrape_for_jobs_sync(scrape_jobs: list[ScrapeJobModel], callback: callable = None):
    return asyncio.run(run_scrape_for_jobs(scrape_jobs, callback))
