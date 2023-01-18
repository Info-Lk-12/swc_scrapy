import React from "react";
import {Fade} from "@mui/material";
import {TransitionGroup} from "react-transition-group";

interface PageBaseProps {
    children: React.ReactNode | React.ReactNode[] | React.ReactElement | React.ReactElement[];
}
function PageBase(props: PageBaseProps) {
    return (
        <TransitionGroup component={null}>
            <Fade>
                <div>{props.children}</div>
            </Fade>
        </TransitionGroup>
    )
}

export default PageBase;