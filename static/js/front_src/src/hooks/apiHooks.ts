import {useEffect, useState} from "react";

declare global {
    var caching: {[key: string]: number}
}
global.caching = {}

function useRequestBaseAPI(
    target: string,
    url: string,
    defaultData: any,
    noCache?: boolean | number,
    type?: "GET" | "POST",
    inpData?: {[key: string]: any}
): [
    boolean,
    any,
    () => void
] {
    const [loading, setLoading] = useState(true);

    function makeRequest() {
        setLoading(true);
        fetch(url, {
            method: type || "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inpData)
        })
            .then(response => response.json())
            .then(data => {
                // @ts-ignore
                global[target] = data
                setLoading(false);
                global.caching[target] = Date.now()
            })
    }

    useEffect(() => {
        // @ts-ignore
        if(global[target] && ((typeof noCache !== "number" && !noCache) || (Date.now() - global.caching[target]) < noCache)) {
            setLoading(false);
        }else{
            makeRequest()
        }
    }, [])

    // @ts-ignore
    return [loading, global[target] || defaultData, makeRequest];
}

function useScrapeJobsAPI(job_uuid?: string){
    if (!!job_uuid){
        return useRequestBaseAPI(
            `scrape_job_${job_uuid.replace("-", "")}`,
            `/api/scrape_job/${job_uuid}`,
            [],
            true,
            "GET"
        )
    }
    return useRequestBaseAPI("scrape_jobs", "/api/scrape_jobs",  [], false, "GET")
}

export {useScrapeJobsAPI};