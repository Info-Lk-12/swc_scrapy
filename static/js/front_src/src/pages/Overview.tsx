import React, {useEffect} from "react";
import PageBase from "./PageBase";
import {useOverviewConfigAPI, useServicesAPI, useTasksAPI} from "../hooks/apiHooks";
import PageLoader from "../components/PageLoader";
import {SwcFab, SwcFabContainer} from "../components/SwcFab";
import OverviewConfigModal from "../components/overview/OverviewConfigModal";
import OverviewControlSection from "../components/overview/OverviewControlSection";
import ServiceType from "../types/ServiceType";
import OverviewServiceControl from "../components/overview/OverviewServiceControl";
import OverviewSystemInfo from "../components/overview/OverviewSystemInfo";
import {Collapse} from "@mui/material";
import OverviewTaskControl from "../components/overview/OverviewTaskControl";


function Overview(){
    const [showLoader, setShowLoader] = React.useState(true)
    const [loading, overviewConfig, update] = useOverviewConfigAPI()
    const [loadingTasks, tasks] = useTasksAPI()
    const [loadingServices, services] = useServicesAPI()

    const [showConfigModal, setShowConfigModal] = React.useState(false)

    useEffect(() => {
        if(!loading){
            setShowLoader(false)
        }
    }, [loading])

    function serviceFilter(service: ServiceType){
        return (
            (service.system_service && overviewConfig.show_system_services === "1") ||
            (!service.system_service && overviewConfig.show_services === "1")
        ) && (overviewConfig.visible_services?.split(",").includes(service.id.toString()) || overviewConfig.visible_services === "")
    }

    return (
        <PageBase>
            {showLoader ? <PageLoader /> : (
                <>
                    <Collapse in={overviewConfig.show_system_info === "1"}>
                        <h2 className="ms-3 mt-2">System Info</h2>
                        <OverviewSystemInfo />
                    </Collapse>

                     <Collapse in={overviewConfig.show_tasks === "1"}>
                         <hr />
                        <h2 className="ms-3 mt-2">Tasks</h2>
                        <OverviewControlSection>
                            {tasks.map((task, index) => (
                                <OverviewTaskControl task={task} key={index} />
                            ))}
                        </OverviewControlSection>
                    </Collapse>

                    <Collapse in={overviewConfig.show_services === "1" || overviewConfig.show_system_services === "1"}>
                        <hr />
                        <h2 className="ms-3 mt-2">Services</h2>
                        <OverviewControlSection>
                            {services.filter(serviceFilter).map((service, index) => (
                                <OverviewServiceControl key={index} service={service} />
                            ))}
                        </OverviewControlSection>
                    </Collapse>

                    <SwcFabContainer>
                        <SwcFab icon="edit" color="warning" onClick={() => setShowConfigModal(true)} />
                    </SwcFabContainer>

                    <OverviewConfigModal
                        overviewConfig={overviewConfig}
                        show={showConfigModal}
                        onHide={() => setShowConfigModal(false)}
                        update={update}
                    />
                </>
            )}
        </PageBase>
    )
}

export default Overview;