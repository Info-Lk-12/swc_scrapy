import OverviewConfigType from "../../types/overviewConfigType";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
    Collapse,
    Fade,
    FormControlLabel,
    Modal,
    TextField
} from "@mui/material";
import React from "react";
import {useServicesAPI, useTasksAPI} from "../../hooks/apiHooks";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}


interface ModalContentProps {
    overviewConfig: OverviewConfigType
    update: () => void
    onHide: () => void
}
function ModalContent(props: ModalContentProps) {
    const [loadingTasks, tasks] = useTasksAPI()
    const [loadingServices, services] = useServicesAPI()

    const [showSystemInfo, setShowSystemInfo] = React.useState(props.overviewConfig.show_system_info == "1")
    const [showTasks, setShowTasks] = React.useState(props.overviewConfig.show_tasks == "1")
    const [visibleTasks, setVisibleTasks] = React.useState(props.overviewConfig.visible_tasks ?? "")
    const [showServices, setShowServices] = React.useState(props.overviewConfig.show_services == "1")
    const [showSystemServices, setShowSystemServices] = React.useState(props.overviewConfig.show_system_services == "1")
    const [visibleServices, setVisibleServices] = React.useState(props.overviewConfig.visible_services ?? "")

    function handleSave(){
        let formData = new FormData();
        formData.append("show_system_info", showSystemInfo ? "1" : "0")
        formData.append("show_services", showServices ? "1" : "0")
        formData.append("show_system_services", showSystemServices ? "1" : "0")
        formData.append("visible_services", visibleServices)
        formData.append("show_tasks", showTasks ? "1" : "0")
        formData.append("visible_tasks", visibleTasks)

        fetch("/api/overview/config", {
            method: "POST",
            body: formData
        }).then(() => {
            props.onHide()
            props.update()
        })
    }

    return (
        <>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showSystemInfo}
                        onChange={(e) => {
                            setShowSystemInfo(e.target.checked)
                        }}
                    />
                }
                label="Show system info"
            />
            <hr />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showTasks}
                        onChange={(e) => {
                            setShowTasks(e.target.checked)
                        }}
                    />
                }
                label="Show tasks"
            />
            <Collapse in={showTasks}>
                <Autocomplete
                    className="my-3"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Visible tasks"
                            placeholder="All"
                            disabled={loadingTasks}
                        />
                    )}
                    renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                            <Chip variant="outlined" label={tasks.find(task => task.id === parseInt(option))?.name} {...getTagProps({ index })} />
                        ))
                    }
                    renderOption={(props, option) => (
                        <li {...props}>
                            {tasks.find(task => task.id === parseInt(option))?.name}
                        </li>
                    )}
                    multiple
                    options={tasks.map(t => t.id.toString())}
                    value={visibleTasks !== "" ? visibleTasks.split(",") : []}
                    onChange={(e, newValue) => setVisibleTasks(newValue.join(","))}
                />
            </Collapse>
            <hr />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showServices}
                        onChange={(e) => {
                            setShowServices(e.target.checked)
                        }}
                    />
                }
                label="Show services"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showSystemServices}
                        onChange={(e) => {
                            setShowSystemServices(e.target.checked)
                        }}
                    />
                }
                label="Show system services"
            />
            <Collapse in={showServices || showSystemServices}>
                <Autocomplete
                    className="my-3"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Visible services"
                            placeholder="All"
                            disabled={loadingServices}
                        />
                    )}
                    renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                            <Chip variant="outlined" label={services.find(service => service.id === parseInt(option))?.name} {...getTagProps({ index })} />
                        ))
                    }
                    renderOption={(props, option) => (
                        <li {...props}>
                            {services.find(service => service.id === parseInt(option))?.name}
                        </li>
                    )}
                    multiple
                    options={services.filter(s => (s.system_service && showSystemServices) || (!s.system_service && showServices)).map(s => s.id.toString())}
                    value={visibleServices !== "" ? visibleServices.split(",") : []}
                    onChange={(e, newValue) => setVisibleServices(newValue.join(","))}
                />
            </Collapse>
            <hr />
            <Box className="d-flex justify-content-end">
                <Button
                    onClick={handleSave}
                    disabled={loadingTasks || loadingServices}
                >
                    Save
                </Button>
            </Box>
        </>
    )
}


interface OverviewConfigModalProps {
    overviewConfig: OverviewConfigType
    show: boolean;
    onHide: () => void;
    update: () => void;
}
function OverviewConfigModal(props: OverviewConfigModalProps){
    return (
        <Modal
            sx={{overflowY: 'auto'}}
            disableScrollLock={false}
            open={props.show}
            onClose={props.onHide}
            closeAfterTransition
            componentsProps={{
                // ignoring since it's a bug in the typings
                // @ts-ignore
                backdrop: {timeout: 500}
            }}
        >
            <Fade in={props.show}>
                <Box className="container" sx={modalStyle}>
                    <ModalContent overviewConfig={props.overviewConfig} onHide={props.onHide} update={props.update} />
                </Box>
            </Fade>
        </Modal>
    )
}

export default OverviewConfigModal;