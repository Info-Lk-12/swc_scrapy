import React from "react";
import {TransitionGroup} from "react-transition-group";
import {SwcCenteredLoader} from "../PageLoader";

interface OverviewControlSectionProps {
    children: React.ReactNode[]
}
function OverviewControlSection(props: OverviewControlSectionProps) {
    return (
        <div className="row m-0">
            <TransitionGroup component={null}>
                {props.children}
            </TransitionGroup>
        </div>
    )
}

export default OverviewControlSection;