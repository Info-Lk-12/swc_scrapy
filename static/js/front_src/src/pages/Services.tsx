import React, {useEffect} from "react";
import PageLoader from "../components/PageLoader";
import PageBase from "./PageBase";
import {useServicesAPI} from "../hooks/apiHooks";
import ServiceModal from "../components/services/ServiceModal";
import ServiceType from "../types/ServiceType";
import {
    Button,
    ButtonGroup,
    Checkbox, CircularProgress, Collapse, LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import SwcModal from "../components/SwcModal";
import {SwcFab, SwcFabContainer} from "../components/SwcFab";

function Services(){
    const [showLoader, setShowLoader] = React.useState(true);
    const [loading, services, update] = useServicesAPI()

    const [infoModal, setInfoModal] = React.useState(false)
    const [serviceModal, setServiceModal] = React.useState(false)
    const [deleteModal, setDeleteModal] = React.useState(false)
    const [selectedService, setSelectedService] = React.useState<ServiceType | null>(null)
    const [selectedServices, setSelectedServices] = React.useState<number[]>([])

    const [loadingEnabled, setLoadingEnabled] = React.useState(false)
    const [reloadingSystemd, setReloadingSystemd] = React.useState(false)

    useEffect(() => {
        if (!loading) {
            setShowLoader(false)
        }
    }, [loading])

    function handleCheckboxSelect(event: React.MouseEvent<unknown>, id: number){
        const selectedIndex = selectedServices.indexOf(id)
        let newSelected: number[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedServices, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedServices.slice(1))
        } else if (selectedIndex === selectedServices.length - 1) {
            newSelected = newSelected.concat(selectedServices.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedServices.slice(0, selectedIndex),
                selectedServices.slice(selectedIndex + 1),
            )
        }
        setSelectedServices(newSelected);
    }
    function handleReloadSystemServices(){
        setReloadingSystemd(true)
        fetch("/api/services/reload", {
            method: "POST",
        }).then(() => {
            setReloadingSystemd(false)
        })
    }

    return (
        <PageBase>
            {showLoader ? <PageLoader/> : (
                <>
                    <Collapse in={loading}>
                        <LinearProgress hidden={!loading}/>
                    </Collapse>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            checked={selectedServices.length === services.length}
                                            indeterminate={selectedServices.length > 0 && selectedServices.length < services.length}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                if(event.target.checked){
                                                    setSelectedServices(services.map(service => service.id))
                                                }else{
                                                    setSelectedServices([])
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Enabled</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell align="right">Options</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.map((service, index) => (
                                    <TableRow
                                        key={index}
                                        hover
                                        role="checkbox"
                                        selected={selectedServices.includes(service.id)}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={selectedServices.includes(service.id)}
                                                onClick={(event) => handleCheckboxSelect(event, service.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{service.id}</TableCell>
                                        <TableCell>{service.name}</TableCell>
                                        <TableCell>{service.system_service ? "System Service" : "Integrated"}</TableCell>
                                        <TableCell>
                                            {service.system_service ? "-" : (
                                                <Checkbox
                                                    disabled={loadingEnabled || loading}
                                                    color="primary"
                                                    checked={service.enabled}
                                                    onChange={(event) => {
                                                        setLoadingEnabled(true)
                                                        let formData = new FormData()
                                                        formData.append("enabled", event.target.checked.toString())
                                                        fetch(`/api/service/${service.id}`, {
                                                            method: "PUT",
                                                            body: formData
                                                        })
                                                            .then(response => {
                                                                if(response.ok){
                                                                    update()
                                                                }
                                                                setLoadingEnabled(false)
                                                            })
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>{service.system_service ? "-" : service.target_user}</TableCell>
                                        <TableCell align="right">
                                            <ButtonGroup size="small">
                                                <Button color="info" onClick={() => {
                                                    setSelectedService(service)
                                                    setInfoModal(true)
                                                }}>Info</Button>
                                                <Button color="warning" onClick={() => {
                                                    setSelectedService(service)
                                                    setServiceModal(true)
                                                }}>Edit</Button>
                                                <Button color="error" onClick={() => {
                                                    setSelectedService(service)
                                                    setDeleteModal(true)
                                                }}>Delete</Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <SwcFabContainer flexDirection="column">
                <SwcFab
                    color="secondary"
                    icon={loading ? <CircularProgress color="info" size={20} /> : "refresh"}
                    onClick={() => {
                        update()
                    }}
                    tooltip="Refresh list"
                    tooltipPlacement="left"
                />
                <SwcFab
                    color="warning"
                    icon={reloadingSystemd ? <CircularProgress color="info" size={20} /> : "save"}
                    onClick={handleReloadSystemServices}
                    tooltip="Reload services"
                    tooltipPlacement="left"
                />
                <SwcFab
                    color="primary"
                    icon="add"
                    onClick={() => {
                        setSelectedService(null)
                        setServiceModal(true)
                    }}
                    tooltip="Add service"
                    tooltipPlacement="left"
                />
            </SwcFabContainer>

            <SwcModal show={infoModal} onHide={() => setInfoModal(false)}>
                <>
                    <h2>Service Info</h2>
                    <hr/>
                    <p>Service Name: {selectedService?.name}</p>
                    <p>Service Type: {selectedService?.system_service ? "System Service" : "Integrated"}</p>
                    <p>Service Enabled: {selectedService?.system_service ? "-" : selectedService?.enabled ? "Yes" : "No"}</p>
                    <p>Service User: {selectedService?.system_service ? "-" : selectedService?.target_user}</p>
                    <p>Service Description: {selectedService?.description}</p>
                </>
            </SwcModal>
            <ServiceModal
                service={selectedService}
                show={serviceModal}
                onHide={() => setServiceModal(false)}
                update={update}
            />
            <SwcModal show={deleteModal} onHide={() => setDeleteModal(false)}>
                <>
                    <h2>Delete Service</h2>
                    <hr/>
                    <p>Are you sure you want to delete the selected services?</p>
                    <ButtonGroup>
                        <Button color="info" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button color="error" onClick={() => {
                            fetch(`/api/service/${selectedService?.id}`, {
                                method: "DELETE"
                            })
                                .then(res => {
                                    if(res.ok){
                                        setDeleteModal(false)
                                        update()
                                    }
                                })
                        }
                        }>Delete</Button>
                    </ButtonGroup>
                </>
            </SwcModal>
        </PageBase>
    )
}

export default Services;