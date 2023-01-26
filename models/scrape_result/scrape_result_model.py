from sqlalchemy import Column, Integer, String, DateTime, TEXT
from models.base_model import BaseModel
from uuid import uuid4
from datetime import datetime
import json


class ScrapeResultModel(BaseModel):
    __tablename__ = 'scrape_results'

    id = Column(Integer, primary_key=True)
    uuid = Column(String(36), unique=True, nullable=False)
    url = Column(String(255), nullable=False)
    status_code = Column(Integer, nullable=False)
    data = Column(TEXT(), nullable=False)
    created_at = Column(DateTime, nullable=False)

    def __init__(self, url, status_code, data):
        self.uuid = str(uuid4())
        self.url = url
        self.status_code = status_code
        self.data = json.dumps(data)
        self.created_at = datetime.now()

    @classmethod
    def create(cls, url, status_code, data):
        scrape_result = cls(url, status_code, data)
        scrape_result.commit()
        return scrape_result
