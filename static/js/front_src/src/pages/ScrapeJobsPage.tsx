import React, {useContext, useEffect} from "react";
import PageBase from "./PageBase";
import {useScrapeJobsAPI} from "../hooks/apiHooks";
import {DataGrid, GridColDef, GridRowId, GridSelectionModel} from "@mui/x-data-grid";
import ScrapeJobType, {
    jobMethods,
    RequestBodyType,
    RequestParamsType,
    RequestPatternType
} from "../types/ScrapeJobType";
import {SwcFab, SwcFabContainer} from "../components/SwcFab";
import {
    Box, Button, ButtonGroup,
    Container, Fade,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem, Modal,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import KeyValueTableEdit from "../components/KeyValueTableEdit";
import ScrapeJobSearchPatternTable from "../components/ScrapeJobSearchPatternTable";
import ScrapeResultType from "../types/ScrapeResultType";
import {SocketContext} from "../contexts/socket-context";
import SwcModal from "../components/SwcModal";
import {SwcCenteredLoader} from "../components/PageLoader";


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'url', headerName: 'URL', flex: 1 },
  { field: 'request_method', headerName: 'Method' }
]
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

function ModalContent({scrapeJob, onHide, update}: {scrapeJob: ScrapeJobType | null, onHide: () => void, update: () => void}) {
    const [jobName, setJobName] = React.useState<string>(scrapeJob?.name ?? "")
    const [jobUrl, setJobUrl] = React.useState<string>(scrapeJob?.url ?? "")
    const [jobMethod, setJobMethod] = React.useState<ScrapeJobType["request_method"]>(scrapeJob?.request_method ?? "GET")
    const [jobHeaders, setJobHeaders] = React.useState<string[]>(scrapeJob?.request_headers ?? ["Accept: */*"])
    const [jobBody, setJobBody] = React.useState<RequestBodyType>(scrapeJob?.request_body ?? {})
    const [jobParams, setJobParams] = React.useState<RequestParamsType>(scrapeJob?.request_params ?? {})
    const [jobSearchPatterns, setJobSearchPatterns] = React.useState<RequestPatternType[]>(scrapeJob?.search_patterns ?? [])

    useEffect(() => {
        setJobName(scrapeJob?.name || "")
        setJobUrl(scrapeJob?.url || "")
        setJobMethod(scrapeJob?.request_method || "GET")
        setJobHeaders(scrapeJob?.request_headers || ["Accept: */*"])
        setJobBody(scrapeJob?.request_body || {})
        setJobParams(scrapeJob?.request_params || {})
        setJobSearchPatterns(scrapeJob?.search_patterns || [])
    }, [scrapeJob])
    function handleJobMethodChange(event: SelectChangeEvent<ScrapeJobType["request_method"]>){
        setJobMethod(event.target.value as ScrapeJobType["request_method"])
    }
    function handleSave(){
        let data: {[key: string]: any} = {
            name: jobName,
            url: jobUrl,
            request_method: jobMethod,
            request_headers: JSON.stringify(jobHeaders),
            request_body: JSON.stringify(jobBody),
            request_params: JSON.stringify(jobParams),
            search_patterns: JSON.stringify(jobSearchPatterns)
        }

        let url = scrapeJob ? `/api/scrape_job/${scrapeJob.uuid}` : "/api/scrape_jobs"
        let form = new FormData()
        Object.keys(data).forEach(key => {
            form.append(key, data[key])
        })

        fetch(url, {
            method: scrapeJob ? "PUT" : "POST",
            body: form
        })
            .then(res => {
                if (!res.ok) return
                onHide()
                update()
            })
    }
    function handleDelete(){
        if (!scrapeJob) return
        fetch(`/api/scrape_job/${scrapeJob.uuid}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) return
                onHide()
                update()
            })
    }

    return (
        <>
            <h4>{scrapeJob ? `Editing "${scrapeJob.name}"` : "New Scrape Job"}</h4>

            <Container>
                <TextField
                    label="Name"
                    value={jobName}
                    error={jobName === ""}
                    onChange={(e) => setJobName(e.target.value)}
                    fullWidth
                    variant={"standard"}
                    required
                />
                <TextField
                    className="my-3"
                    label="URL"
                    value={jobUrl}
                    error={jobUrl === ""}
                    onChange={(e) => setJobUrl(e.target.value)}
                    fullWidth
                    variant={"standard"}
                    required
                />
                <FormControl
                    variant="standard"
                    className="my-3"
                    fullWidth
                >
                    <InputLabel id="job-method-label">Request method</InputLabel>
                    <Select
                        labelId="job-method-label"
                        id="job-method"
                        value={jobMethod}
                        onChange={handleJobMethodChange}
                        label="Request method"
                    >
                        {jobMethods.map((option, index) => (
                            <MenuItem key={index} value={option} sx={{background: "error"}}>
                                <ListItemText primary={option} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Headers"
                    variant="outlined"
                    onChange={(e) => setJobHeaders(e.currentTarget.value.split("\n"))}
                    value={jobHeaders.join("\n")}
                    multiline
                    fullWidth
                    required
                />
                <div className="d-flex">
                    <div className="flex-grow-1">
                        <KeyValueTableEdit object={jobParams} onChange={setJobParams} label="Request Parameters" />
                    </div>
                    <div className="flex-grow-1">
                        <KeyValueTableEdit object={jobBody} onChange={setJobBody} label="Request Body" />
                    </div>
                </div>
                <ScrapeJobSearchPatternTable object={jobSearchPatterns} onChange={setJobSearchPatterns} />

                <ButtonGroup
                    className="mt-5 mb-1 d-flex justify-content-end"
                >
                    {scrapeJob && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={handleSave}
                        disabled={
                            jobName === "" ||
                            jobUrl === "" ||
                            jobSearchPatterns.length === 0
                        }
                    >
                        Save
                    </Button>
                </ButtonGroup>
            </Container>
        </>
    )
}

function EditModal({show, onHide, scrapeJob, update}: {show: boolean, onHide: () => void, scrapeJob: ScrapeJobType | null, update: () => void}){
    return (
        <Modal
            sx={{overflowY: 'auto'}}
            disableScrollLock={false}
            open={show}
            onClose={onHide}
            closeAfterTransition
            componentsProps={{
                // ignoring since it's a bug in the typings
                // @ts-ignore
                backdrop: {timeout: 500}
            }}
            disableAutoFocus
            disableEnforceFocus
        >
            <Fade in={show}>
                <Box className="container" sx={modalStyle}>
                    <ModalContent scrapeJob={scrapeJob} onHide={onHide} update={update} />
                </Box>
            </Fade>
        </Modal>
    )
}

function ScrapeJobsPage(){
    const socket = useContext(SocketContext)

    const [loading, scrapeJobs, update] = useScrapeJobsAPI()
    const [selected, setSelected] = React.useState<number>(-1)
    const [checked, setChecked] = React.useState<GridSelectionModel>([])
    const [editModalOpen, setEditModalOpen] = React.useState(false)

    const [scrapeProgressModalLoading, setScrapeProgressModalLoading] = React.useState(false)
    const [scrapeProgressModalOpen, setScrapeProgressModalOpen] = React.useState(false)
    const [scrapeProgressModalData, setScrapeProgressModalData] = React.useState<any[]>([])

    function handleProgress(data: ScrapeResultType){
        setScrapeProgressModalData([...scrapeProgressModalData, data])
    }

    useEffect(() => {
        socket.on("scrape_progress", handleProgress)
        return () => {
            socket.off("scrape_progress", handleProgress)
        }
    })

    return (
        <PageBase>
            <div style={{height: "calc(100vh - 48px)"}}>
                <DataGrid
                    columns={columns}
                    rows={scrapeJobs}
                    autoPageSize
                    loading={loading}
                    onCellDoubleClick={(params) => {
                        setSelected(scrapeJobs.findIndex(job => job.uuid === params.row.uuid))
                        setEditModalOpen(true)
                    }}
                    checkboxSelection
                    keepNonExistentRowsSelected
                    disableSelectionOnClick
                    selectionModel={checked}
                    onSelectionModelChange={(newSelection) => {
                        setChecked(newSelection)
                    }}
                />
            </div>

            <SwcFabContainer bottom={64} flexDirection="column">
                {checked.length > 0 && (
                    <SwcFab
                        icon="play_arrow"
                        onClick={() => {
                            let form = new FormData()
                            form.append("jobs", JSON.stringify(
                                checked.map((gridRowId: GridRowId) => scrapeJobs.filter(job => job.id === gridRowId)[0].uuid)
                            ))
                            fetch("/api/scrape_jobs/run", {
                                method: "POST",
                                body: form
                            }).then(() => {
                                setScrapeProgressModalLoading(false)
                            })
                            setScrapeProgressModalOpen(true)
                            setScrapeProgressModalLoading(true)
                            setScrapeProgressModalData([])
                        }}
                        color="success"
                    />
                )}
                <SwcFab
                    icon="add"
                    onClick={() => {
                        setSelected(-1)
                        setEditModalOpen(true)
                    }}
                    color="primary"
                />
            </SwcFabContainer>
            <EditModal
                show={editModalOpen}
                onHide={() => setEditModalOpen(false)}
                scrapeJob={scrapeJobs[selected]}
                update={update}
            />
            <SwcModal show={scrapeProgressModalOpen} onHide={() => setScrapeProgressModalOpen(false)}>
                {scrapeProgressModalLoading && <SwcCenteredLoader />}
                {scrapeProgressModalData.map((scrapeResult, index) => (
                    <div key={index}>
                        <h3>{scrapeResult.name}</h3>
                        <ul>
                            {Object.keys(JSON.parse(scrapeResult.data)).map((key, listIndex) => (
                                <li key={listIndex}>
                                    <b>{key}</b>: {JSON.parse(scrapeResult.data)[key].toString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </SwcModal>
        </PageBase>
    )
}

export default ScrapeJobsPage