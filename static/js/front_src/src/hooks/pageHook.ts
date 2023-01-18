import {useEffect, useState} from "react";

const lastPage = sessionStorage.getItem('page') ? Number(sessionStorage.getItem('page')) : undefined;

function usePage(def?: number): [number, (page: number) => void] {
    const [page, setPage] = useState(lastPage || (def || 0))

    useEffect(() => {
        sessionStorage.setItem('page', page.toString())
    }, [page])

    return [page, setPage]
}

export default usePage