import TableHeader from "../components/TableHeader";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import TableBody from "../components/TableBody";
import ManagePopup from "../components/ManagePopup";
import "../index.css";
import { Part } from "../Interfaces";
import { v4 as uuid4 } from "uuid";
import axios from "axios";
import { classNames } from "@hkamran/utility-web";
import torqueueLogo from "../imgs/torqueueLogo.png";
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
    files: { camExt: "", cadExt: "" },
    dev: { delete: false, upload: false, download: false },
};

const numberSortArray = (a: any, b: any) => {
    return a > b ? 1 : a < b ? -1 : 0;
};

export default function Dashboard() {
    //const BACKEND_URL = "https://torqueue.texastorque.org";
    const BACKEND_URL = "http://localhost:5738";
    let partsList = [defaultPart];

    initializeApp(firebaseConfig);
    const db = getDatabase();
    const dbRef = ref(db, "/");

    const [alert, setAlert] = useState({
        show: false,
        message: "",
        success: false,
    });

    const [popupPart, setPopupPart] = useState<Part>(defaultPart);
    const [showPopup, setShowPopup] = useState(false);
    const [hotPart, setHotPart] = useState<Part>(defaultPart);
    const [completedPart, setCompletedPart] = useState<Part>(defaultPart);
    const [parts, setParts] = useState<Part[]>(null);

    const [filter, setFilter] = useState("Select a filter");
    const [searchQuery, setSearchQuery] = useState("");

    onValue(dbRef, async (snapshot) => {
        console.log("Pulling Parts");
        partsList = [];
        snapshot.forEach((childSnapshot) => {
            partsList.push(childSnapshot.val());
        });

        partsList.sort((a, b) => {
            return numberSortArray(a.priority, b.priority);
        });

//        setParts(partsList);

        console.log(parts);
    });

    useEffect(() => {
        const handleAsync = async () => {
            if (hotPart.id === "") return;

            const request = await axios.post(`${BACKEND_URL}/editPart`, {
                hotPart,
            });

            const message = hotPart.dev.delete
                ? "Part Successfully Deleted"
                : "Successfully Modified " + hotPart.name + "!";

            if (request.data === "success") {
                setAlert({
                    show: true,
                    message: message,
                    success: true,
                });

                setTimeout(() => {
                    setAlert({
                        show: false,
                        message: "",
                        success: false,
                    });
                }, 2000);

                setCompletedPart(hotPart);
            }
        };

        handleAsync();
    }, [hotPart]);

    useEffect(() => {
        const statusKeyboardInput = (e: any) => {
            if (e.keyCode === 65) setShowPopup(true);
        };

        window.addEventListener("keydown", statusKeyboardInput);
        return () => window.removeEventListener("keydown", statusKeyboardInput);
    });

    const handleAddPart = (e: any) => {
        e.preventDefault();
        let newPart = defaultPart;
        newPart.id = uuid4();
        setPopupPart(newPart);
        setShowPopup(true);
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
                <h2 className="flex pl-3">Filter: </h2>
                <Dropdown className="top-0 flex" style={{ paddingLeft: "1em" }}>
                    <Dropdown.Toggle variant="success">
                        {filter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setFilter("None")}>
                            None
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => setFilter("All machines")}
                        >
                            All machines
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter("Tormach")}>
                            Tormach
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter("Nebula")}>
                            Nebula
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter("Omio")}>
                            Omio
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter("Lathe")}>
                            Lathe
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <img
                    src={torqueueLogo}
                    alt="TorqueueLogo"
                    className="h-12 Textenter TextCenterDiv"
                    style={{ position: "absolute", left: "43%", right: "50%" }}
                ></img>

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
                                    completedPart={completedPart}
                                    setHotPart={setHotPart}
                                    searchQuery={searchQuery}
                                    filter={filter}
                                    setShowPopup={setShowPopup}
                                    BACKEND_URL={BACKEND_URL}
                                    parts={parts}
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
            />

            <button
                type="button"
                className="AddPartButton"
                onClick={(e) => handleAddPart(e)}
            >
                +
            </button>
        </>
    );
}
