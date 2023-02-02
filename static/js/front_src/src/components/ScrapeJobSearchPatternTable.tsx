import {
    Button,
    Collapse, FormControl,
    IconButton,
    InputLabel,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import React from "react";
import {TransitionGroup} from "react-transition-group";
import {RequestPatternType} from "../types/ScrapeJobType";

const availablePatternTypes = [undefined, "text", "number", "attribute", "attribute_number", "attribute_text", "attribute_url", "url", "html", "json", "json_array", "json_object", "json_number", "json_text", "json_url", "json_html", "json_attribute", "json_attribute_number", "json_attribute_text", "json_attribute_url"]

interface SearchPatternFormProps {
    name: string
    find: string
    regex: string
    type: string
    onNameChange: (name: string) => void
    onFindChange: (find: string) => void
    onRegexChange: (regex: string) => void
    onTypeChange: (type: string) => void
    additions?: React.ReactNode
}
function SearchPatternForm(props: SearchPatternFormProps){
    return (
        <div className="d-flex">
            <div className="flex-grow-1">
                <TextField
                    label="Name"
                    value={props.name}
                    onChange={(e) => props.onNameChange(e.target.value)}
                    variant="standard"
                    className="w-25"
                />
                <TextField
                    label="Find"
                    value={props.find}
                    onChange={(e) => props.onFindChange(e.target.value)}
                    variant="standard"
                    className="w-25"
                />
                <TextField
                    label="Regex"
                    value={props.regex}
                    onChange={(e) => props.onRegexChange(e.target.value)}
                    variant="standard"
                    className="w-25"
                />
                <FormControl
                    variant="standard"
                    className="w-25"
                >
                    <InputLabel id="job-method-label">Type</InputLabel>
                    <Select
                        labelId="job-method-label"
                        id="job-method"
                        value={props.type}
                        onChange={(e) => props.onTypeChange(e.target.value as string)}
                        label="Type"
                    >
                        {availablePatternTypes.map((option, index) => (
                            <MenuItem key={index} value={option} sx={{background: "error"}}>
                                <ListItemText primary={option} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div>
                {props.additions}
            </div>
        </div>
    )
}

interface ScrapeJobSearchPatternTableProps {
    object: RequestPatternType[]
    onChange: (object: RequestPatternType[]) => void
    label?: string
}
function ScrapeJobSearchPatternTable(props: ScrapeJobSearchPatternTableProps){
    const [newName, setNewName] = React.useState("")
    const [newFind, setNewFind] = React.useState("")
    const [newRegex, setNewRegex] = React.useState("")
    const [newType, setNewType] = React.useState("")

    return (
        <div className="w-100 mt-3" style={{borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.23)", padding: "16.5px 14px"}}>
            <h6>{props.label}</h6>
            <SearchPatternForm
                name={newName}
                find={newFind}
                regex={newRegex}
                type={newType}
                onNameChange={setNewName}
                onFindChange={setNewFind}
                onRegexChange={setNewRegex}
                onTypeChange={setNewType}
                additions={
                    <Button
                        onClick={() => {
                            if(newName === "" || newFind === "") return
                            const newObject = [...props.object]
                            newObject.push({
                                name: newName,
                                find: newFind,
                                regex: newRegex,
                                type: newType
                            })
                            props.onChange(newObject)
                            setNewName("")
                            setNewFind("")
                            setNewRegex("")
                            setNewType("")
                        }}
                        className="ml-1 mt-2"
                        variant="contained"
                    >Add</Button>
                }
            />
            <TransitionGroup>
                {props.object.map((pattern, index) => (
                    <Collapse key={index}>
                        <ListItem
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    title="Delete"
                                    onClick={() => {
                                        const newObject = [...props.object]
                                        newObject.splice(index, 1)
                                        props.onChange(newObject)
                                    }}
                                >
                                    <i className="material-icons">delete</i>
                                </IconButton>
                            }
                        >
                            <span className="w-25">{pattern.name}</span>
                            <span className="w-25">{pattern.find}</span>
                            <span className="w-25">{pattern.regex || "*"}</span>
                            <span className="w-25">{pattern.type || "generic"}</span>
                        </ListItem>
                    </Collapse>
                ))}
            </TransitionGroup>
        </div>
    )
}

export default ScrapeJobSearchPatternTable