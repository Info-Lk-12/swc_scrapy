import React, {useEffect} from "react"
import {ThemeProvider} from "@mui/material";
import defaultTheme from "./themes/defaultTheme";
import NavBar from "./components/navigation/NavBar";

import usePage from "./hooks/pageHook";
import OverviewPage from "./pages/OverviewPage";
import ScrapeJobsPage from "./pages/ScrapeJobsPage";
import {socket, SocketContext} from "./contexts/socket-context";


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

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server")
        })
        return () => {
            socket.off("connect")
        }
    })

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavBar value={page} onChange={setPage} />

            <SocketContext.Provider value={socket}>
                {getPage(page)}
            </SocketContext.Provider>
        </ThemeProvider>
    )
}

export default App;
