import TableHeader from "../components/TableHeader";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState, useRef } from "react";
import TableBody from "../components/TableBody";
import ManagePopup from "../components/ManagePopup";
import { ProjectFilter } from "../components/ProjectFilter";
import "../index.css";
import { Part } from "../Interfaces";
import axios from "axios";
import { classNames } from "@hkamran/utility-web";
import torqueLogo from "../imgs/torqueLogo.png";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebaseConfig } from "../keys";

const defaultPart = {
    id: "",
    name: "",
    status: 0,
    machine: "",
    material: "",
    needed: "0",
    priority: "5",
    notes: "",
    project: "",
    files: { camExt: "", cadExt: "" },
    dev: { delete: false, upload: false, download: false },
};

const numberSortArray = (a: any, b: any) => {
    return a > b ? 1 : a < b ? -1 : 0;
};

export default function Dashboard() {
    const BACKEND_URL = "https://torqueue.texastorque.org";
    //const BACKEND_URL = "http://localhost:5738";

    initializeApp(firebaseConfig);

    const [alert, setAlert] = useState({
        show: false,
        message: "",
        success: false,
    });

    const [popupPart, setPopupPart] = useState<Part>(defaultPart);
    const [showPopup, setShowPopup] = useState(false);
    const [hotPart, setHotPart] = useState<Part>(defaultPart);
    const [parts, setParts] = useState<Part[]>(null);
    const [name, setName] = useState("");
    const [projects, setProjects] = useState<string[]>([]);

    const [machineFilter, setMachineFilter] = useState("Select a filter");
    const [projectFilter, setProjectFilter] = useState("Select a filter");

    const [searchQuery, setSearchQuery] = useState("");

    let addPart = useRef(false);

    const getParts = async () => {
        let responseJSON: any;
        let listParts = [] as Part[];
        await axios.get(`${BACKEND_URL}/getAllParts`).then((data) => {
            responseJSON = data.data[1];
        });

        for (let part in responseJSON) listParts.push(responseJSON[part]);

        for (let i = 0; i < listParts.length; i++) {
            if (
                !projects.includes(listParts[i].project) &&
                listParts[i].project !== undefined &&
                listParts[i].project !== ""
            ) {
                projects.push(listParts[i].project);
            }
        }

        setProjects(projects);

        listParts.sort((a, b) => {
            return numberSortArray(a.priority, b.priority);
        });

        setParts(listParts);
    };

    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db, "/");
        onValue(dbRef, async () => {
            getParts();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleAsync = async () => {
            if (hotPart.id === "" || hotPart.name === "") return;

            let deleteStatus = "success",
                message = "";

            const successMessage = hotPart.dev.delete
                ? `Successfully Deleted ${hotPart.name}!`
                : `Successfully Changed ${hotPart.name}!`;

            const errorMessage = hotPart.dev.delete
                ? `Failed To Deleted ${hotPart.name}!`
                : `Failed To Change ${hotPart.name}!`;

            const setRequest = await axios.post(`${BACKEND_URL}/editPart`, {
                hotPart,
            });

            if (hotPart.dev.delete) {
                const deleteRequest = await axios.post(
                    `${BACKEND_URL}/deletePart`,
                    {
                        hotPart,
                    }
                );

                deleteStatus = deleteRequest.data;
            }

            getParts();

            message =
                setRequest.data === "success" && deleteStatus === "success"
                    ? successMessage
                    : errorMessage;

            setAlert({
                show: true,
                message: message,
                success: message === successMessage,
            });

            setTimeout(() => {
                setAlert({
                    show: false,
                    message: "",
                    success: false,
                });
            }, 2000);
        };

        handleAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotPart]);

    useEffect(() => {
        const statusKeyboardInput = (e: any) => {
            if (e.keyCode === 65 && !showPopup) handleAddPart();
        };

        window.addEventListener("keydown", statusKeyboardInput);
        return () => window.removeEventListener("keydown", statusKeyboardInput);
    });

    const handleAddPart = () => {
        addPart.current = true;
        setPopupPart(defaultPart);
        setShowPopup(true);
        setName("");
    };

    return (
        <>
            <div
                className={classNames(
                    "fixed-top alert",
                    alert.success ? "alert-success" : "alert-danger"
                )}
                style={{ display: alert.show ? "" : "none" }}
            >
                {alert.message}
            </div>
            <div className="fixed-top navbar NavHead flex">
                <h2 className="flex pl-3">Project: </h2>
                <Dropdown className="top-0 flex" style={{ paddingLeft: "1em" }}>
                    <Dropdown.Toggle variant="success">
                        {projectFilter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setProjectFilter("None")}>
                            None
                        </Dropdown.Item>
                        <ProjectFilter
                            projects={projects}
                            setProjectFilter={setProjectFilter}
                        />
                    </Dropdown.Menu>
                </Dropdown>
                <h2 className="flex pl-3">Machine: </h2>
                <Dropdown className="top-0 flex" style={{ paddingLeft: "1em" }}>
                    <Dropdown.Toggle variant="success">
                        {machineFilter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setMachineFilter("None")}>
                            None
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => setMachineFilter("All machines")}
                        >
                            All machines
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => setMachineFilter("Tormach")}
                        >
                            Tormach
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => setMachineFilter("Nebula")}
                        >
                            Nebula
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setMachineFilter("Omio")}>
                            Omio
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => setMachineFilter("Lathe")}
                        >
                            Lathe
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <div
                    className="flex TextCenterDiv"
                    style={{
                        alignItems: "center",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <img
                        src={torqueLogo}
                        alt="TorqueueLogo"
                        className="h-12"
                    ></img>
                    <h1>Torqueue</h1>
                </div>

                <div style={{ marginLeft: "auto" }}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="SearchBar BlackTextBox form-control relative right-2"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="TableGrandParent">
                <div className="TableParent">
                    {
                        <Table
                            striped
                            bordered
                            hover
                            variant="dark"
                            className="ActualTable"
                        >
                            <TableHeader />
                            <tbody>
                                <TableBody
                                    setPopupPart={setPopupPart}
                                    setHotPart={setHotPart}
                                    searchQuery={searchQuery}
                                    filter={machineFilter}
                                    setShowPopup={setShowPopup}
                                    BACKEND_URL={BACKEND_URL}
                                    parts={parts}
                                    projectFilter={projectFilter}
                                />
                            </tbody>
                        </Table>
                    }
                </div>
            </div>

            <ManagePopup
                popupPart={popupPart}
                setPopupPart={setPopupPart}
                setHotPart={setHotPart}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
                setAlert={setAlert}
                BACKEND_URL={BACKEND_URL}
                defaultPart={defaultPart}
                addPart={addPart}
                name={name}
                setName={setName}
            />

            <button
                type="button"
                className="AddPartButton"
                onClick={() => handleAddPart()}
            >
                +
            </button>
        </>
    );
}
