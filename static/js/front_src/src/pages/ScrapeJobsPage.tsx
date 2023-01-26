import React from "react";
import PageBase from "./PageBase";
import {useScrapeJobsAPI} from "../hooks/apiHooks";
import PageLoader from "../components/PageLoader";
import {Container} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

function ScrapeJobsPage(){
    const [loading, scrapeJobs, update] = useScrapeJobsAPI()

    return (
        <PageBase>
            <Container>
                {loading ? <PageLoader /> : (
                    <DataGrid columns={[]} rows={[]} checkboxSelection />
                )}
            </Container>
        </PageBase>
    )
}

export default ScrapeJobsPage