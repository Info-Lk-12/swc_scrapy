import {Box, Fade, Modal} from "@mui/material";
import React from "react";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface SwcModalProps {
    show: boolean
    onHide: () => void
    children: React.ReactNode
}
function SwcModal(props: SwcModalProps) {
    return (
        <Modal
            open={props.show}
            onClose={props.onHide}
            closeAfterTransition
            componentsProps={{
                // ignoring since it's a bug in the typings
                // @ts-ignore
                backdrop: {timeout: 500}
            }}
        >
            <Fade in={props.show}>
                <Box sx={style}>
                    {props.children}
                </Box>
            </Fade>
        </Modal>
    )
}

export default SwcModal