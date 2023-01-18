import TaskType from "../../types/TaskType";
import {Zoom} from "@mui/material";
import React from "react";
import {gatherSubProps} from "../../utils/propUtils";

interface OverviewTaskProps {
    task: TaskType
    [key: string]: any
}
function OverviewTaskControl(props: OverviewTaskProps) {
    const eProps = gatherSubProps(props, ["task"])

    return (
        <Zoom {...eProps}>
            <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-12 ">
                <div className="card h-100" style={{cursor: "default"}}>
                    <div className="card-body">
                        <h4 className="card-title">{props.task.name}</h4>
                        <p className="card-text">{props.task.description}</p>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </Zoom>
    )
}

export default OverviewTaskControl;