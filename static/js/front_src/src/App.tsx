import React from "react"
import {ThemeProvider} from "@mui/material";
import defaultTheme from "./themes/defaultTheme";
import NavBar from "./components/navigation/NavBar";

import usePage from "./hooks/pageHook";
import OverviewPage from "./pages/OverviewPage";
import ScrapeJobsPage from "./pages/ScrapeJobsPage";


function getPage(page: number){
    switch (page){
        case 0:
        default:
            return <OverviewPage />
        case 2:
            return <ScrapeJobsPage />
    }
}


function App(){
    const [page, setPage] = usePage(0)

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar value={page} onChange={setPage} />

            {getPage(page)}
        </ThemeProvider>
    )
}

export default App;
