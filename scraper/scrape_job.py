import bs4
import requests

from models.scrape_job import ScrapeJobModel
from models.scrape_result import ScrapeResultModel


class ScrapeJob:
    def __init__(self, scrape_job: ScrapeJobModel):
        self.scrape_job = scrape_job
        self.response = None
        self.soup = None
        self.parsed_data = None
        self.scrape_result = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    def execute(self):
        self._fetch()
        if self.response.status_code == 200:
            self._parse()
        self._save()
        return self.scrape_result

    def _fetch(self):
        match self.scrape_job.request_method:
            case "GET":
                self.response = requests.get(self.scrape_job.url, params=self.scrape_job.request_params_dict,
                                             #headers=self.scrape_job.request_headers_list)
                                             headers=None)
            case "POST":
                self.response = requests.post(self.scrape_job.url, params=self.scrape_job.request_params_dict,
                                              data=self.scrape_job.request_body_dict, headers=self.scrape_job.request_headers_list)
            case "PUT":
                self.response = requests.put(self.scrape_job.url, params=self.scrape_job.request_params_dict,
                                             data=self.scrape_job.request_body_dict, headers=self.scrape_job.request_headers_list)
            case "DELETE":
                self.response = requests.delete(self.scrape_job.url, params=self.scrape_job.request_params_dict,
                                                data=self.scrape_job.request_body_dict, headers=self.scrape_job.request_headers_list)
            case _:
                raise Exception("Invalid request method")

    def _parse(self):
        self.soup = bs4.BeautifulSoup(self.response.text, 'html.parser')
        self.parsed_data = {}
        for pattern in self.scrape_job.search_patterns_list:
            self.parsed_data[pattern["name"]] = self.soup.select(pattern["find"])

    def _save(self):
        self.scrape_result = ScrapeResultModel.create(self.scrape_job, self.response.status_code, self.parsed_data)
