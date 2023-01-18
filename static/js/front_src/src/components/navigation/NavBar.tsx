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
                        </Tabs>
                    </Box>
                </AppBar>
            </HideOnScroll>
            <Toolbar sx={{minHeight: "48px !important"}} />
        </>
    )
}

export default NavBar