interface OverviewConfigType {
    show_system_info: "1" | "0";
    show_services: "1" | "0";
    show_system_services: "1" | "0";
    visible_services: string | "all"
    show_tasks: "1" | "0";
    visible_tasks: string | "all"
}

export default OverviewConfigType