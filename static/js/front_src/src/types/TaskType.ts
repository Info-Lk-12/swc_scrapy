interface TaskType {
    id: number;
    name: string;
    description: string;

    enabled: boolean;
    target_services: string;

    schedule_start: boolean;
    schedule_start_specific: boolean;
    schedule_start_time: string;

    schedule_restart: boolean;
    schedule_restart_specific: boolean;
    schedule_restart_time: string;

    schedule_stop: boolean;
    schedule_stop_specific: boolean;
    schedule_stop_time: string;
}

export default TaskType;