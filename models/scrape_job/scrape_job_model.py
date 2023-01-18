from sqlalchemy import Column, Integer, String, DateTime, TEXT
from models.base_model import BaseModel


class ScrapeJobModel(BaseModel):
    __tablename__ = 'scrape_jobs'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    url = Column(String(4096), nullable=False)
    request_method = Column(String(16), nullable=False)
    request_params = Column(String(4096), nullable=True)
    request_body = Column(TEXT(), nullable=True)
    request_headers = Column(TEXT(), nullable=True)
    search_patterns = Column(TEXT(), nullable=False)

    created_at = Column(DateTime, nullable=False)
