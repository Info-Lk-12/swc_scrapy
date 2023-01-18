import React from "react";
import ServiceType from "../../types/ServiceType";
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
import {useSystemUsersAPI} from "../../hooks/apiHooks";
import {CUSTOM_SERVICE_CONFIG_TEMPLATE} from "../../utils/constants";

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
const codeEntryStyle = {
    "& .MuiInputBase-root": {
        fontFamily: "monospace",
    }
}

interface ModalContentProps {
    service: ServiceType | null;
    onHide: () => void;
    update: () => void;
}
function ModalContent(props: ModalContentProps){
    const [loadingUsers, users, updateUsers] = useSystemUsersAPI()
    const [saveLoading, setSaveLoading] = React.useState(false)

    const [name, setName] = React.useState(props.service?.name ?? "")
    const [description, setDescription] = React.useState(props.service?.description ?? "")

    const [enabled, setEnabled] = React.useState(props.service?.enabled ?? false)
    const [systemService, setSystemService] = React.useState(props.service?.system_service ?? false)
    const [targetUser, setTargetUser] = React.useState(props.service?.target_user ?? "")
    const [workingDirectory, setWorkingDirectory] = React.useState(props.service?.working_directory ?? "")

    const [allowStart, setAllowStart] = React.useState(props.service?.allow_start ?? false)
    const [allowStop, setAllowStop] = React.useState(props.service?.allow_stop ?? false)
    const [allowRestart, setAllowRestart] = React.useState(props.service?.allow_restart ?? false)
    const [allowReload, setAllowReload] = React.useState(props.service?.allow_reload ?? false)
    const [allowStatus, setAllowStatus] = React.useState(props.service?.allow_status ?? false)
    const [allowEnable, setAllowEnable] = React.useState(props.service?.allow_enable ?? false)
    const [allowDisable, setAllowDisable] = React.useState(props.service?.allow_disable ?? false)
    const allowanceCheckboxes: [string, boolean, any][] = [
        ["Allow Start", allowStart, setAllowStart],
        ["Allow Stop", allowStop, setAllowStop],
        ["Allow Restart", allowRestart, setAllowRestart],
        ["Allow Reload", allowReload, setAllowReload],
        ["Allow Status", allowStatus, setAllowStatus],
        ["Allow Enable", allowEnable, setAllowEnable],
        ["Allow Disable", allowDisable, setAllowDisable]
    ]

    const [targetExecutable, setTargetExecutable] = React.useState(props.service?.target_executable ?? "")
    const [targetArguments, setTargetArguments] = React.useState(props.service?.target_arguments ?? "")

    const [customConfig, setCustomConfig] = React.useState(props.service?.custom_config ?? CUSTOM_SERVICE_CONFIG_TEMPLATE)

    function handleSave(){
        setSaveLoading(true)

        let data: {[key: string]: any} = {
            name,
            description,
            enabled,
            system_service: systemService,
            target_user: targetUser,
            working_directory: workingDirectory,
            allow_start: allowStart,
            allow_stop: allowStop,
            allow_restart: allowRestart,
            allow_reload: allowReload,
            allow_status: allowStatus,
            allow_enable: allowEnable,
            allow_disable: allowDisable,
            target_executable: targetExecutable,
            target_arguments: targetArguments,
            custom_config: customConfig
        }

        let url = props.service ? `/api/service/${props.service.id}` : "/api/service"
        let form = new FormData()
        Object.keys(data).forEach(key => {
            form.append(key, data[key])
        })

        fetch(url, {
            method: props.service ? "PUT" : "POST",
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
            <hr />
            <FormControlLabel
                className="mb-3"
                control={
                    <Checkbox
                        checked={systemService}
                        onChange={(event) => setSystemService(event.target.checked)}
                    />
                }
                label="System Service"
                disabled={enabled}
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
                disabled={systemService && !enabled}
            />
            <Collapse in={!systemService}>
                <div className="d-flex mb-3">
                    <Autocomplete
                        className="flex-grow-1"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                label="Target User"
                                placeholder="Target User"
                                error={targetUser === ""}
                                required
                            />
                        )}
                        renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        options={users}
                        value={users.includes(targetUser) && targetUser !== "" ? targetUser : null}
                        onChange={(e, newValue) => setTargetUser(newValue || "")}
                        disabled={loadingUsers || systemService}
                    />
                    <Button
                        title="Refresh Users"
                        size="small"
                        variant="text"
                        onClick={() => updateUsers()}
                        disabled={loadingUsers}
                    >
                        {loadingUsers ? <CircularProgress size={20} /> : <i className="material-icons">refresh</i>}
                    </Button>
                </div>
                <TextField
                    sx={codeEntryStyle}
                    className="mb-3"
                    variant="filled"
                    label="Working Directory"
                    value={workingDirectory}
                    onChange={(event) => setWorkingDirectory(event.target.value)}
                    fullWidth
                    disabled={systemService}
                    error={(workingDirectory === "") && !systemService}
                    required
                />
            </Collapse>
            <hr />
            {allowanceCheckboxes.map(([name, allowance, setAllowance], index) => (
                <FormControlLabel
                    className="mb-3"
                    control={
                        <Checkbox
                            checked={allowance}
                            onChange={(event) => setAllowance(event.target.checked)}
                        />
                    }
                    label={name}
                    key={index}
                    disabled={!systemService && (
                        (name === "Allow Enable" && !allowEnable) ||
                        (name === "Allow Disable" && !allowDisable)
                    )}
                />
            ))}
            <hr />
            <Collapse in={!systemService}>
                <TextField
                    sx={codeEntryStyle}
                    className="mb-3"
                    variant="filled"
                    label="Target Executable"
                    value={targetExecutable}
                    onChange={(event) => setTargetExecutable(event.target.value)}
                    fullWidth
                    error={(targetExecutable === "") && !systemService}
                    disabled={systemService}
                    required={!systemService}
                />
                <TextField
                    sx={codeEntryStyle}
                    className="mb-3"
                    variant="filled"
                    label="Target Arguments"
                    value={targetArguments}
                    onChange={(event) => setTargetArguments(event.target.value)}
                    fullWidth
                    disabled={systemService}
                />
            </Collapse>
            <Collapse in={systemService}>
                <TextField
                    sx={codeEntryStyle}
                    className="mb-3"
                    variant="filled"
                    label="Custom Config"
                    value={customConfig}
                    onChange={(event) => setCustomConfig(event.target.value)}
                    fullWidth
                    multiline
                    disabled={!systemService}
                    required
                    error={(customConfig === "") && systemService}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </Collapse>

            <Button
                className="mt-3 float-end"
                variant="contained"
                color="primary"
                onClick={() => {
                    handleSave()
                }}
                disabled={saveLoading || loadingUsers || !(
                    name !== "" &&
                    systemService ? customConfig : (
                        targetUser !== "" &&
                        workingDirectory !== "" &&
                        targetExecutable !== ""
                    )
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

interface ServiceModalProps {
    service: ServiceType | null;
    show: boolean;
    onHide: () => void;
    update: () => void;
}
function ServiceModal(props: ServiceModalProps){
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
                    <ModalContent service={props.service} onHide={props.onHide} update={props.update} />
                </Box>
            </Fade>
        </Modal>
    )
}

export default ServiceModal;