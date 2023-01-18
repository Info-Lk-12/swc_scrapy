import React, {useEffect} from "react";
import PageLoader from "../components/PageLoader";
import PageBase from "./PageBase";
import {useTasksAPI} from "../hooks/apiHooks";
import TaskModal from "../components/tasks/TaskModal";
import TaskType from "../types/TaskType";
import {
    Button,
    ButtonGroup,
    Checkbox, CircularProgress, Collapse, LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import SwcModal from "../components/SwcModal";
import {SwcFab, SwcFabContainer} from "../components/SwcFab";

function Services(){
    const [showLoader, setShowLoader] = React.useState(true);
    const [loading, tasks, update] = useTasksAPI();

    const [infoModal, setInfoModal] = React.useState(false)
    const [taskModal, setTaskModal] = React.useState(false)
    const [deleteModal, setDeleteModal] = React.useState(false)
    const [selectedTask, setSelectedTask] = React.useState<TaskType | null>(null)
    const [selectedTasks, setSelectedTasks] = React.useState<number[]>([])

    const [loadingEnabled, setLoadingEnabled] = React.useState(false)

    useEffect(() => {
        if (!loading) {
            setShowLoader(false)
        }
    }, [loading])

    function handleCheckboxSelect(event: React.MouseEvent<unknown>, id: number){
        const selectedIndex = selectedTasks.indexOf(id)
        let newSelected: number[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedTasks, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedTasks.slice(1))
        } else if (selectedIndex === selectedTasks.length - 1) {
            newSelected = newSelected.concat(selectedTasks.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedTasks.slice(0, selectedIndex),
                selectedTasks.slice(selectedIndex + 1),
            )
        }
        setSelectedTasks(newSelected);
    }

    return (
        <PageBase>
            {showLoader ? <PageLoader/> : (
                <>
                    <Collapse in={loading}>
                        <LinearProgress hidden={!loading}/>
                    </Collapse>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            checked={selectedTasks.length === tasks.length}
                                            indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                if(event.target.checked){
                                                    setSelectedTasks(services.map(service => service.id))
                                                }else{
                                                    setSelectedTasks([])
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Enabled</TableCell>
                                    <TableCell align="right">Options</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map((task, index) => (
                                    <TableRow
                                        key={index}
                                        hover
                                        role="checkbox"
                                        selected={selectedTasks.includes(task.id)}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={selectedTasks.includes(task.id)}
                                                onClick={(event) => handleCheckboxSelect(event, task.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{task.id}</TableCell>
                                        <TableCell>{task.name}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                disabled={loadingEnabled || loading}
                                                color="primary"
                                                checked={task.enabled}
                                                onChange={(event) => {
                                                    setLoadingEnabled(true)
                                                    let formData = new FormData()
                                                    formData.append("enabled", event.target.checked.toString())
                                                    fetch(`/api/task/${task.id}`, {
                                                        method: "PUT",
                                                        body: formData
                                                    })
                                                        .then(response => {
                                                            if(response.ok){
                                                                update()
                                                            }
                                                            setLoadingEnabled(false)
                                                        })
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <ButtonGroup size="small">
                                                <Button color="info" onClick={() => {
                                                    setSelectedTask(task)
                                                    setInfoModal(true)
                                                }}>Info</Button>
                                                <Button color="warning" onClick={() => {
                                                    setSelectedTask(task)
                                                    setTaskModal(true)
                                                }}>Edit</Button>
                                                <Button color="error" onClick={() => {
                                                    setSelectedTask(task)
                                                    setDeleteModal(true)
                                                }}>Delete</Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <SwcFabContainer flexDirection="column">
                <SwcFab
                    color="secondary"
                    icon={loading ? <CircularProgress color="info" size={20} /> : "refresh"}
                    onClick={() => {
                        update()
                    }}
                    tooltip="Refresh list"
                    tooltipPlacement="left"
                />
                <SwcFab
                    color="primary"
                    icon="add"
                    onClick={() => {
                        setSelectedTask(null)
                        setTaskModal(true)
                    }}
                    tooltip="Add task"
                    tooltipPlacement="left"
                />
            </SwcFabContainer>

            <SwcModal show={infoModal} onHide={() => setInfoModal(false)}>
                <>
                    <h2>Task Info</h2>
                    <hr/>
                </>
            </SwcModal>
            <TaskModal
                task={selectedTask}
                show={taskModal}
                onHide={() => setTaskModal(false)}
                update={update}
            />
            <SwcModal show={deleteModal} onHide={() => setDeleteModal(false)}>
                <>
                    <h2>Delete Task</h2>
                    <hr/>
                    <p>Are you sure you want to delete the selected tasks?</p>
                    <ButtonGroup>
                        <Button color="info" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button color="error" onClick={() => {
                            fetch(`/api/task/${selectedTask?.id}`, {
                                method: "DELETE"
                            })
                                .then(res => {
                                    if(res.ok){
                                        setDeleteModal(false)
                                        update()
                                    }
                                })
                        }
                        }>Delete</Button>
                    </ButtonGroup>
                </>
            </SwcModal>
        </PageBase>
    )
}

export default Services;