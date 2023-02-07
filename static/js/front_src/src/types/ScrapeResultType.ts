interface ScrapeResultDataType {
    [key: string]: any[][];
}

interface ScrapeResultType{
    id: number;
    uuid: string;
    scrape_job_uuid: string;
    name: string;
    url: string;
    status_code: number;
    data: ScrapeResultDataType,
    created_at: string;
}

export default ScrapeResultType;