import React, {useEffect} from "react";
import {useScrapeResultsAPI} from "../hooks/apiHooks";
import {DataGrid, GridColDef, GridSelectionModel} from "@mui/x-data-grid";
import PageBase from "./PageBase";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'url', headerName: 'URL', flex: 1 },
  { field: 'status_code', headerName: 'Status' }
]

function ScrapeResultsPage(){
    const [loading, scrapeResults, update] = useScrapeResultsAPI()
    const [checked, setChecked] = React.useState<GridSelectionModel>([])

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
                />
            </div>
        </PageBase>
    )
}

export default ScrapeResultsPage;