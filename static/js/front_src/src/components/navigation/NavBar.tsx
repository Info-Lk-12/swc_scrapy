import React from "react";
import HideOnScroll from "../../utils/HideOnScroll";
import {AppBar, Box, Tab, Tabs, Toolbar} from "@mui/material";


interface NavBarProps{
    value: number,
    onChange: (num: number) => void
}
function NavBar(props: NavBarProps){
    return (
        <>
            <HideOnScroll>
                <AppBar>
                    <Box>
                        <Tabs
                            value={props.value}
                            onChange={(e: React.SyntheticEvent, v: number) => {
                                props.onChange(v)
                            }}
                            variant="scrollable"
                        >
                            <Tab value={0} label="Overview" />
                            <Tab value={1} label="Tasks" />
                            <Tab value={2} label="Services" />
                            <Tab value={3} label="Commands & Actions" />
                            <Tab value={4} label="Settings" />
                        </Tabs>
                    </Box>
                </AppBar>
            </HideOnScroll>
            <Toolbar sx={{minHeight: "48px !important"}} />
        </>
    )
}

export default NavBar