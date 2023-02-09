from sqlalchemy import Column, Integer, String, DateTime, TEXT
from models.base_model import BaseModel
from models.scrape_job import ScrapeJobModel
from uuid import uuid4
from datetime import datetime
import json


class ScrapeResultModel(BaseModel):
    __tablename__ = 'scrape_results'

    id = Column(Integer, primary_key=True)
    uuid = Column(String(36), unique=True, nullable=False)
    scrape_job_uuid = Column(String(36), nullable=False)
    name = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False)
    status_code = Column(Integer, nullable=False)
    data = Column(TEXT(), nullable=True)
    created_at = Column(DateTime, nullable=False)

    def __init__(self, scrape_job_uuid, name, url, status_code, data):
        self.uuid = str(uuid4())
        self.scrape_job_uuid = scrape_job_uuid
        self.name = name
        self.url = url
        self.status_code = status_code
        self.data = json.dumps(data) if data is not None else None
        self.created_at = datetime.now()

    @classmethod
    def create(cls, scrape_job: ScrapeJobModel, status_code, data):
        scrape_result = cls(scrape_job.uuid, scrape_job.name, scrape_job.url, status_code, data)
        scrape_result.add()
        return scrape_result

    @property
    def data_json(self):
        return json.loads(self.data) if self.data is not None else None

    @property
    def formatted(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "scrape_job_uuid": self.scrape_job_uuid,
            "name": self.name,
            "url": self.url,
            "status_code": self.status_code,
            "data": self.data_json,
            "created_at": self.created_at
        }
