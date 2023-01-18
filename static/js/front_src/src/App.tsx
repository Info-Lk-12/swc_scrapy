import React, {useEffect} from "react"
import {ThemeProvider} from "@mui/material";
import defaultTheme from "./themes/defaultTheme";
import NavBar from "./components/navigation/NavBar";

import Overview from "./pages/Overview";
import Services from "./pages/Services";
import usePage from "./hooks/pageHook";
import Tasks from "./pages/Tasks";


function getPage(page: number){
    switch (page){
        case 0:
            return <Overview />
        case 1:
            return <Tasks />
        case 2:
            return <Services />
        default:
            return null
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
