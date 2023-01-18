import ServiceType from "../../types/ServiceType";
import {Button, ButtonGroup, Skeleton, Snackbar, Zoom} from "@mui/material";
import React from "react";
import {gatherSubProps} from "../../utils/propUtils";
import {useServiceAPI} from "../../hooks/apiHooks";
import SwcModal from "../SwcModal";

interface OverviewControlProps {
    service: ServiceType
    [key: string]: any
}
function OverviewServiceControl(props: OverviewControlProps) {
    const eProps = gatherSubProps(props, ["service"])
    const [loading, service, update] = useServiceAPI(props.service.id.toString())
    const [logModalOpen, setLogModalOpen] = React.useState(false)
    const [error, setError] = React.useState("")

    function handleOperation(operation: string){
        fetch(`/api/service/${props.service.id}/operation/${operation}`, {
            method: "POST"
        })
            .then(res => {
                if(!res.ok) setError(res.statusText)
                setTimeout(update, 1000)
            })
    }

    return (
        <Zoom {...eProps}>
            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-12 ">
                <div className="card h-100" style={{cursor: "default"}}>
                    <div className="card-body">
                        <h4 className="card-title">{props.service.name}</h4>
                        <p className="card-text">{props.service.description}</p>
                        <div>
                            {loading ? (<Skeleton animation="wave" variant="text" width={100} />) : (
                                service.allow_status && (
                                    <p>
                                        Enabled: {(service.system_service ? service.system_service_enabled : service.enabled) ? "Yes" : "No"} <br/>
                                        Running: {service.status ? "Yes" : "No"}
                                    </p>
                                )
                            )}
                            <ButtonGroup variant="text" disabled={loading}>
                                <Button
                                    color="info"
                                    onClick={update}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    color="info"
                                    onClick={() => setLogModalOpen(true)}
                                >
                                    Log
                                </Button>
                                {service.system_service && service.allow_enable && (
                                    <Button
                                        color="warning"
                                        onClick={() => {
                                            handleOperation("enable")
                                        }}
                                        disabled={service.system_service_enabled && service.allow_status}
                                    >
                                        Enable
                                    </Button>
                                )}
                                {service.system_service && service.allow_disable && (
                                    <Button
                                        color="warning"
                                        onClick={() => {
                                            handleOperation("disable")
                                        }}
                                        disabled={!service.system_service_enabled  && service.allow_status}
                                    >
                                        Disable
                                    </Button>
                                )}
                            </ButtonGroup>
                        </div>
                    </div>

                    <div className="card-footer">
                        {loading ? <Skeleton variant="rounded" width="100%" animation="wave" height={40} /> : (
                            <ButtonGroup
                                variant="contained"
                                color="secondary"
                                disabled={!service.system_service && !service.enabled}
                                fullWidth
                            >
                                {service.allow_start && (
                                    <Button
                                        color="success"
                                        onClick={() => {
                                            handleOperation("start")
                                        }}
                                        disabled={service.status && service.allow_status}
                                    >
                                        Start
                                    </Button>
                                )}
                                {service.allow_restart && (
                                    <Button
                                        color="warning"
                                        onClick={() => {
                                            handleOperation("restart")
                                        }}
                                        disabled={!service.status && service.allow_status}
                                    >
                                        Restart
                                    </Button>
                                )}
                                {service.allow_stop && (
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            handleOperation("stop")
                                        }}
                                        disabled={!service.status && service.allow_status}
                                    >
                                        Stop
                                    </Button>
                                )}
                            </ButtonGroup>
                        )}
                    </div>
                </div>

                <SwcModal show={logModalOpen} onHide={() => setLogModalOpen(false)}>
                    <pre><code>{service.log}</code></pre>
                </SwcModal>
                <Snackbar
                    open={error !== ""}
                    autoHideDuration={6000}
                    onClose={() => {
                        setError("")
                    }}
                    message={error}
                    action={
                        <Button color="inherit" size="small" onClick={() => {
                            setError("")
                        }}>Dismiss</Button>
                    }
                />
            </div>
        </Zoom>
    )
}

export default OverviewServiceControl;