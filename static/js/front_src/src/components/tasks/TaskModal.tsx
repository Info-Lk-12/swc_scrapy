import React from "react";
import TaskType from "../../types/TaskType";
import {
    Box,
    Modal,
    Fade,
    TextField,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    Chip,
    Collapse, Button, CircularProgress
} from "@mui/material";
import {useServicesAPI} from "../../hooks/apiHooks";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    padding: "30px",
    width: "calc(100% - 60px)",
    maxWidth: "none !important",
    maxHeight: "none !important",
    bgcolor: 'background.paper',
    margin: "30px !important",
}

function checkTimeValue(value: string, specific: boolean): boolean {
    const timeRegex = new RegExp("^([0-2][0-9]):([0-5][0-9])$")
    return timeRegex.test(value) || (!specific && value === "startup")
}

interface TimeSelectProps {
    active: boolean
    specific: boolean
    setSpecific: (specific: boolean) => void
    timeValue: string
    setTimeValue: (value: string) => void
}
function TimeSelect(props: TimeSelectProps) {
    return (
        <Collapse in={props.active} className="mb-3">
            <FormControlLabel
                control={<Checkbox checked={props.specific} onChange={() => props.setSpecific(true)}/>}
                label="Specific time"
            />
            <FormControlLabel
                control={<Checkbox checked={!props.specific} onChange={() => props.setSpecific(false)}/>}
                label="Every"
            />
            {props.specific ? (
                <TextField
                    label="Time"
                    type="time"
                    value={props.timeValue}
                    onChange={(event) => props.setTimeValue(event.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                    fullWidth
                    error={!checkTimeValue(props.timeValue, true)}
                />
            ) : (
                <TextField
                    label="Time in hh:mm format or 'startup'"
                    value={props.timeValue}
                    onChange={(event) => props.setTimeValue(event.target.value)}
                    error={!checkTimeValue(props.timeValue, false)}
                    fullWidth
                />
            )}
        </Collapse>
    )
}

interface ModalContentProps {
    task: TaskType | null;
    onHide: () => void;
    update: () => void;
}
function ModalContent(props: ModalContentProps){
    const [saveLoading, setSaveLoading] = React.useState(false)
    const [loadingServices, services] = useServicesAPI()

    const [name, setName] = React.useState(props.task?.name ?? "")
    const [description, setDescription] = React.useState(props.task?.description ?? "")

    const [enabled, setEnabled] = React.useState(props.task?.enabled ?? false)
    const [targetServices, setTargetServices] = React.useState(props.task?.target_services ?? "")

    const [scheduleStart, setScheduleStart] = React.useState(props.task?.schedule_start ?? false)
    const [scheduleStartSpecific, setScheduleStartSpecific] = React.useState(props.task?.schedule_start_specific ?? false)
    const [scheduleStartTime, setScheduleStartTime] = React.useState(props.task?.schedule_start_time ?? "")

    const [scheduleRestart, setScheduleRestart] = React.useState(props.task?.schedule_restart ?? false)
    const [scheduleRestartSpecific, setScheduleRestartSpecific] = React.useState(props.task?.schedule_restart_specific ?? false)
    const [scheduleRestartTime, setScheduleRestartTime] = React.useState(props.task?.schedule_restart_time ?? "")

    const [scheduleStop, setScheduleStop] = React.useState(props.task?.schedule_stop ?? false)
    const [scheduleStopSpecific, setScheduleStopSpecific] = React.useState(props.task?.schedule_stop_specific ?? false)
    const [scheduleStopTime, setScheduleStopTime] = React.useState(props.task?.schedule_stop_time ?? "")

    function handleSave(){
        setSaveLoading(true)

        let data: {[key: string]: any} = {
            name,
            description,
            enabled,
            target_services: targetServices,
            schedule_start: scheduleStart,
            schedule_start_specific: scheduleStartSpecific,
            schedule_start_time: scheduleStartTime,
            schedule_restart: scheduleRestart,
            schedule_restart_specific: scheduleRestartSpecific,
            schedule_restart_time: scheduleRestartTime,
            schedule_stop: scheduleStop,
            schedule_stop_specific: scheduleStopSpecific,
            schedule_stop_time: scheduleStopTime
        }

        let url = props.task ? `/api/task/${props.task.id}` : "/api/task"
        let form = new FormData()
        Object.keys(data).forEach(key => {
            form.append(key, data[key])
        })

        fetch(url, {
            method: props.task ? "PUT" : "POST",
            body: form
        })
            .then(response => {
                setSaveLoading(false)
                return response.json()
            })
            .then(() => {
                props.onHide()
                props.update()
            })
    }

    return (
        <>
            <TextField
                className="mb-3"
                variant="filled"
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                required
                error={name === ""}

            />
            <TextField
                className="mb-3"
                variant="filled"
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                fullWidth
                multiline
            />
            <Autocomplete
                className="mb-3"
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="filled"
                        label="Target services"
                        placeholder="All"
                        disabled={loadingServices}
                        required
                        error={targetServices === ""}
                    />
                )}
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip variant="outlined" label={services.find(s => s.id === parseInt(option))?.name} {...getTagProps({ index })} />
                    ))
                }
                renderOption={(props, option) => (
                    <li {...props}>
                        {services.find(s => s.id === parseInt(option))?.name}
                    </li>
                )}
                multiple
                options={services.map(s => s.id.toString())}
                value={targetServices !== "" ? targetServices.split(",") : []}
                onChange={(e, newValue) => setTargetServices(newValue.join(","))}
            />
            <FormControlLabel
                className="mb-3"
                control={
                    <Checkbox
                        checked={enabled}
                        onChange={(event) => setEnabled(event.target.checked)}
                    />
                }
                label="Enabled"
            />
            <hr />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={scheduleStart}
                        onChange={(event) => setScheduleStart(event.target.checked)}
                    />
                }
                label="Schedule Start"
            />
            <TimeSelect
                active={scheduleStart}
                specific={scheduleStartSpecific}
                setSpecific={setScheduleStartSpecific}
                timeValue={scheduleStartTime}
                setTimeValue={setScheduleStartTime}
            />
            <hr />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={scheduleRestart}
                        onChange={(event) => setScheduleRestart(event.target.checked)}
                    />
                }
                label="Schedule Restart"
            />
            <TimeSelect
                active={scheduleRestart}
                specific={scheduleRestartSpecific}
                setSpecific={setScheduleRestartSpecific}
                timeValue={scheduleRestartTime}
                setTimeValue={setScheduleRestartTime}
            />
            <hr />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={scheduleStop}
                        onChange={(event) => setScheduleStop(event.target.checked)}
                    />
                }
                label="Schedule Stop"
            />
            <TimeSelect
                active={scheduleStop}
                specific={scheduleStopSpecific}
                setSpecific={setScheduleStopSpecific}
                timeValue={scheduleStopTime}
                setTimeValue={setScheduleStopTime}
            />
            <hr />


            <Button
                className="mt-3 float-end"
                variant="contained"
                color="primary"
                onClick={() => {
                    handleSave()
                }}
                disabled={saveLoading || loadingServices || !(
                    targetServices !== "" &&
                    (!scheduleStart || checkTimeValue(scheduleStartTime, scheduleStartSpecific)) &&
                    (!scheduleRestart || checkTimeValue(scheduleRestartTime, scheduleRestartSpecific)) &&
                    (!scheduleStop || checkTimeValue(scheduleStopTime, scheduleStopSpecific))
                )}
            >{saveLoading ? <CircularProgress size={20} /> : "Save"}</Button>
            <Button
                className="mt-3 mb-5"
                variant="contained"
                color="secondary"
                onClick={() => {props.onHide()}}
                disabled={saveLoading}
            >Close</Button>
        </>
    )
}

interface TaskModalProps {
    task: TaskType | null;
    show: boolean;
    onHide: () => void;
    update: () => void;
}
function TaskModal(props: TaskModalProps){
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
                    <ModalContent task={props.task} onHide={props.onHide} update={props.update} />
                </Box>
            </Fade>
        </Modal>
    )
}

export default TaskModal;