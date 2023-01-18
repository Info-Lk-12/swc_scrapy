interface SystemInfoType{
    boot_time: number;
    cpu: number
    cpu_freq: {
        current: number
        max: number
        min: number
    }
    cpu_individual: number[]
    disk: {
        total: number
        used: number
        free: number
        percent: number
    }
    disk_io: {
        read_count: number
        write_count: number
        read_bytes: number
        write_bytes: number
        read_time: number
        write_time: number
    }
    memory: {
        total: number
        available: number
        percent: number
        used: number
        free: number
    }
    network: {
        bytes_sent: number
        bytes_recv: number
        packets_sent: number
        packets_recv: number
        errin: number
        errout: number
        dropin: number
        dropout: number
    }
    sensors: {
        temperature: any
        fans: any
    }
    swap: {
        total: number
        used: number
        free: number
        percent: number
        sin: number
        sout: number
    }
}

export default SystemInfoType