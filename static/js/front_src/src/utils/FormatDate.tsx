import React from "react"
import {Tooltip} from "@mui/material";

function FormatDate(props: { children: Date }) {
    return (
        <Tooltip title={`at ${props.children.toLocaleTimeString(["de"])}`} arrow>
            <span>{props.children.toLocaleDateString(["de"])}</span>
        </Tooltip>
    )
}

export default FormatDate