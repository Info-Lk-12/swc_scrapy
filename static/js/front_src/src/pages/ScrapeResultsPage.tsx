import React from "react";
import {useScrapeResultsAPI} from "../hooks/apiHooks";
import {DataGrid, GridColDef, GridSelectionModel} from "@mui/x-data-grid";
import PageBase from "./PageBase";
import ScrapeJobType from "../types/ScrapeJobType";
import {Box, Fade, Modal} from "@mui/material";
import ScrapeResultType from "../types/ScrapeResultType";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'url', headerName: 'URL', flex: 1 },
  { field: 'status_code', headerName: 'Status' }
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

function ModalContent({scrapeResult, onHide}: {scrapeResult: ScrapeResultType | null, onHide: () => void}){
    return scrapeResult && (
        <div>
            <h4>Scrape job '{scrapeResult?.name}'</h4>
            <p>
                URL: {scrapeResult?.url} <br />
                Status code: {scrapeResult?.status_code}
                <ul>
                    {Object.keys(scrapeResult.data).map((key, listIndex) => (
                        <li key={listIndex}>
                            <b>{key}</b>: {scrapeResult.data[key].toString()}
                        </li>
                    ))}
                </ul>
            </p>
        </div>
    )
}

function EditModal({show, onHide, scrapeResult}: {show: boolean, onHide: () => void, scrapeResult: ScrapeResultType | null}){
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
                    <ModalContent scrapeResult={scrapeResult} onHide={onHide} />
                </Box>
            </Fade>
        </Modal>
    )
}

function ScrapeResultsPage(){
    const [loading, scrapeResults, update] = useScrapeResultsAPI()
    const [checked, setChecked] = React.useState<GridSelectionModel>([])

    const [showModal, setShowModal] = React.useState(false)
    const [scrapeResult, setScrapeResult] = React.useState<ScrapeResultType | null>(null)

    return (
        <PageBase>
            <div style={{height: "calc(100vh - 48px)"}}>
                <DataGrid
                    columns={columns}
                    rows={scrapeResults}
                    autoPageSize
                    loading={loading}
                    checkboxSelection
                    keepNonExistentRowsSelected
                    disableSelectionOnClick
                    selectionModel={checked}
                    onSelectionModelChange={(newSelection) => {
                        setChecked(newSelection)
                    }}
                    onRowDoubleClick={(e) => {
                        const job = scrapeResults.find((job) => job.id === e.row.id)
                        if (job){
                            setScrapeResult(job)
                            setShowModal(true)
                        }
                    }}
                    pageSize={64}
                />
            </div>
            <EditModal show={showModal} onHide={() => setShowModal(false)} scrapeResult={scrapeResult} />
        </PageBase>
    )
}

export default ScrapeResultsPage;