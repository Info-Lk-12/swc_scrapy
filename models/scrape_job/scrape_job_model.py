from sqlalchemy import Column, Integer, String, DateTime, TEXT
from models.base_model import BaseModel
from uuid import uuid4
import json


class ScrapeJobModel(BaseModel):
    __tablename__ = 'scrape_jobs'

    id = Column(Integer, primary_key=True)
    uuid = Column(String(36), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    url = Column(String(4096), nullable=False)
    request_method = Column(String(16), nullable=False)
    request_params = Column(String(4096), nullable=True)
    request_body = Column(TEXT(), nullable=True)
    request_headers = Column(TEXT(), nullable=True)
    search_patterns = Column(TEXT(), nullable=False)

    created_at = Column(DateTime, nullable=False)

    def __init__(self, name):
        self.name = name
        self.uuid = str(uuid4())

    @classmethod
    def create(cls, name, url, request_method, search_patterns: list[dict], request_params: dict[str, str] = None,
               request_body: dict[str, str] = None, request_headers: list[str] = None):
        job_model = cls(name)
        job_model.url = url
        job_model.request_method = request_method
        job_model.search_patterns = json.dumps(search_patterns)
        job_model.request_params = json.dumps(request_params)
        job_model.request_body = json.dumps(request_body)
        job_model.request_headers = json.dumps(request_headers)
        job_model.commit()
        return job_model

    @property
    def search_patterns_list(self) -> list[dict]:
        return json.loads(self.search_patterns)

    @property
    def request_params_dict(self) -> dict[str, str] or None:
        if self.request_params is None:
            return None
        return json.loads(self.request_params)

    @property
    def request_body_dict(self) -> dict[str, str] or None:
        if self.request_body is None:
            return None
        return json.loads(self.request_body)

    @property
    def request_headers_list(self) -> list[str] or None:
        if self.request_headers is None:
            return None
        return json.loads(self.request_headers)
