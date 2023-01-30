interface RequestBodyType{
    [key: string]: any;
}
interface RequestParamsType{
    [key: string]: any;
}
interface RequestPatternType{
    find: string;
    name: string;
    type?: string;
    regex?: string;
}

const jobMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

interface ScrapeJobType{
    id: number;
    uuid: string;
    name: string;
    url: string;
    request_method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    request_headers: string[];
    request_body: RequestBodyType;
    request_params: RequestParamsType;
    search_patterns: RequestPatternType[];
}

export default ScrapeJobType;
export type {RequestBodyType, RequestParamsType, RequestPatternType};
export {jobMethods};