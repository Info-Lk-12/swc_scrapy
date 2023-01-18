import React from "react";
import PageBase from "../pages/PageBase";
import SwcLoader from "./SwcLoader";

function SwcCenteredLoader(props: {className?: string}) {
    return (
        <div className={"d-flex justify-content-center " + props.className}>
            <SwcLoader />
        </div>
    )
}

function PageLoader(){
    return (
        <PageBase>
            <SwcCenteredLoader className="swc-loader-middle" />
        </PageBase>
    )
}

export default PageLoader;
export {SwcCenteredLoader};