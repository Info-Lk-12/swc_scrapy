import React, {useEffect} from "react";

import {useSystemInfoAPI} from "../../hooks/apiHooks";
import {Box, CircularProgress, CircularProgressProps, Typography} from "@mui/material";
import {gatherSubProps} from "../../utils/propUtils";
import {SwcCenteredLoader} from "../PageLoader";

interface CircularProgressWithLabelProps extends CircularProgressProps {
    value: number;
    label: string;
    valueLabelProcessor?: (value: number) => string;
    loading?: boolean;
}
function CircularProgressWithLabel(props: CircularProgressWithLabelProps) {
    const eProps = gatherSubProps(props, ["valueLabelProcessor", "loading"])
    function processValueLabel(value: number){
        if(props.valueLabelProcessor){
            return props.valueLabelProcessor(value)
        }
        return `${value}%`
    }

    return (
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
            <div className="card">
                <div className="card-body d-flex">
                    <CircularProgress
                        variant={props.loading ? "indeterminate" : "determinate"}
                        sx={{
                            height: "100px !important",
                            width: "100px !important",
                        }}
                        {...eProps}
                    />
                    <Box className="flex-grow-1 d-flex align-items-center justify-content-center ms-3">
                        <div>
                            <Typography
                                variant="h5"
                                component="div"
                                color="text.primary"
                            >
                                {props.label}
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                color="text.secondary"
                            >
                                {processValueLabel(props.value)}
                            </Typography>
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    );
}

function OverviewSystemInfo(){
    const [loadingInfo, info, updateInfo] = useSystemInfoAPI()

    useEffect(() => {
        let interval = setInterval(() => {
            updateInfo()
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="row m-0">
            <CircularProgressWithLabel
                label="CPU Usage"
                value={info.cpu || 0}
            />
            <CircularProgressWithLabel
                label="CPU Clock"
                value={info.cpu_freq ? (info.cpu_freq.current / info.cpu_freq?.max)*100 : 0}
                valueLabelProcessor={() => `${info.cpu_freq ? info.cpu_freq.current : 0} MHz`}
                color="success"
            />
            <CircularProgressWithLabel
                label="Memory Usage"
                value={info.memory ? info.memory.percent : 0}
                color="secondary"
            />
            <CircularProgressWithLabel
                label="Disk Usage"
                value={info.disk ? info.disk.percent : 0}
                color="warning"
            />
            <CircularProgressWithLabel
                label="Swap Usage"
                value={info.swap ? info.swap.percent : 0}
                color="warning"
            />
        </div>
    )
}

export default OverviewSystemInfo