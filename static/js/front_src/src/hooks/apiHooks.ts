import {useEffect, useState} from "react";
import ServiceType, {ServiceInfoType} from "../types/ServiceType";
import OverviewConfigType from "../types/overviewConfigType";
import SystemInfoType from "../utils/SystemInfoType";
import TaskType from "../types/TaskType";

declare global {
    var services: ServiceType[]
    var systemUsers: string[]
    var overviewConfig: OverviewConfigType
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

function useOverviewConfigAPI(): [boolean, OverviewConfigType, () => void] {
    return useRequestBaseAPI("overviewConfig", "/api/overview/config", {})
}

function useSystemInfoAPI(): [boolean, SystemInfoType, () => void] {
    return useRequestBaseAPI("systemStatus", "/api/system_info", {}, 5000)
}

function useTaskAPI(taskId: string): [boolean, TaskType, () => void] {
    return useRequestBaseAPI(`task-${taskId}`, `/api/task/${taskId}`, {}, 5000)
}

function useTasksAPI(): [boolean, TaskType[], () => void] {
    return useRequestBaseAPI("tasks", "/api/tasks", [])
}

function useServiceAPI(serviceId: string): [boolean, ServiceInfoType, () => void] {
    return useRequestBaseAPI(`service-${serviceId}`, `/api/service/${serviceId}`,{}, 5000)
}

function useServicesAPI(): [boolean, ServiceType[], () => void] {
    return useRequestBaseAPI("services", "/api/services", [])
}

function useSystemUsersAPI(): [boolean, string[], () => void] {
    return useRequestBaseAPI("systemUsers", "/api/system_users", [])
}

export {useOverviewConfigAPI, useSystemInfoAPI, useTaskAPI, useTasksAPI, useServiceAPI, useServicesAPI, useSystemUsersAPI};