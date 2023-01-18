interface ServiceType {
    id: number;
    name: string;
    description: string;

    enabled: boolean;
    system_service: boolean;
    target_user: string;
    working_directory: string;

    allow_start: boolean;
    allow_stop: boolean;
    allow_restart: boolean;
    allow_reload: boolean;
    allow_status: boolean;
    allow_enable: boolean;
    allow_disable: boolean;

    target_executable: string;
    target_arguments: string;

    custom_config: string;
}
interface ServiceInfoType extends ServiceType {
    status: boolean;
    system_service_enabled: boolean;
    log: string;
}

export default ServiceType;
export type {ServiceInfoType};