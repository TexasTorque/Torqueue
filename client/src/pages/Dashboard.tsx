import TableHeader from "../components/TableHeader";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState, useRef } from "react";
import TableBody from "../components/TableBody";
import ManagePopup from "../components/ManagePopup";
import "../index.css";
import { Part } from "../Interfaces";
import axios from "axios";
import { classNames } from "@hkamran/utility-web";
import torqueLogo from "../imgs/torqueLogo.png";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebaseConfig } from "../keys";
import ProjectDropdown from "../components/ProjectDropdown";

const defaultPart = {
    id: "",
    name: "",
    status: 4,
    machine: "",
    endmill: "",
    creator: "",
    material: "",
    needed: "1",
    priority: "5",
    notes: "",
    project: "",
    link: "",
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
    let [projects, setProjects] = useState<string[]>([]);

    const [machineFilter, setMachineFilter] = useState("All");
    const [projectFilter, setProjectFilter] = useState("All");
    const [filter, setFilter] = useState("✓");

    const [searchQuery, setSearchQuery] = useState("");
    let responseJSON = useRef<HTMLInputElement>();
    let partsList = [] as Part[];

    let addPart = useRef(false);

    let firstRun = useRef(true);

    useEffect(() => {
        if (localStorage.getItem("machineFilter")) {
            setMachineFilter(localStorage.getItem("machineFilter"));
        }
    }, []);

    const getParts = async () => {
        await axios.get(`${BACKEND_URL}/getAllParts`).then((data) => {
            responseJSON.current = data.data[1];
        });

        getProjects();

        partsList.sort((a, b) => {
            return numberSortArray(a.priority, b.priority);
        });

        setParts(partsList);
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
        if (firstRun.current && localStorage.getItem("machineFilter")) {
            setMachineFilter(localStorage.getItem("machineFilter"));
            firstRun.current = false;
        } else localStorage.setItem("machineFilter", machineFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machineFilter]);

    const getProjects = async () => {
        partsList = [];
        let localPartsList = [];
        for (let part in responseJSON.current)
            partsList.push(responseJSON.current[part]);

        localPartsList = partsList
            .filter((v) => (filter === "✓" ? v.status !== 7 : true))
            .filter((v) => (filter === "✓" ? parseInt(v.needed) !== 0 : true));

        projects = localPartsList.map((v) => v.project);

        projects = projects
            .filter(
                (part, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t.toLowerCase() === part.toLowerCase()
                    )
            )
            .filter((v) => v !== "");

        setProjects(projects);
    };

    useEffect(() => {
        getProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machineFilter, filter]);

    useEffect(() => {
        const handleAsync = async () => {
            // This is why it'll randomly update a part. It doesn't reset hotpart
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
            //getProjects();

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
                <h2 className="flex pl-3 Filter">Project: </h2>
                <Dropdown className="top-0 flex" style={{ paddingLeft: "1em" }}>
                    <Dropdown.Toggle variant="success">
                        {projectFilter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="DropdownScroll">
                        <Dropdown.Item onClick={() => setProjectFilter("All")}>
                            Show All
                        </Dropdown.Item>
                        {projects.map((project: string, id: number) => (
                            <ProjectDropdown
                                key={id}
                                project={project}
                                setProjectFilter={setProjectFilter}
                            />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <h2 className="flex pl-3 Filter">Machine: </h2>
                <Dropdown className="top-0 flex" style={{ paddingLeft: "1em" }}>
                    <Dropdown.Toggle variant="success">
                        {machineFilter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setMachineFilter("All")}>
                            All Machines
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
                        <Dropdown.Item
                            onClick={() => setMachineFilter("Mini Mill")}
                        >
                            Mini Mill
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setMachineFilter("Any")}>
                            Any
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <h2 className="flex pl-3 Filter">Filter: </h2>
                <Dropdown className="top-0 flex" style={{ paddingLeft: "1em" }}>
                    <Dropdown.Toggle variant="success">
                        {filter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setFilter("✓")}>
                            Hide Completed
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter("X")}>
                            Show Completed
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <img
                    src={torqueLogo}
                    alt="TorqueueLogo"
                    className="CenterImage"
                ></img>
                <h1 className="TextCenterDiv" style={{ marginRight: "auto" }}>
                    Torqueue
                </h1>

                <div className="SearchBarDiv">
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
                                    machineFilter={machineFilter}
                                    setShowPopup={setShowPopup}
                                    BACKEND_URL={BACKEND_URL}
                                    parts={parts}
                                    projectFilter={projectFilter}
                                    filter={filter}
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
