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
import torqueLogo from "../imgs/torqueLogo.jpg";

const defaultPart = {
    id: "",
    name: "",
    status: 0,
    machine: "",
    material: "",
    needed: "0",
    priority: "0",
    notes: "",
    files: { camExt: "", cadExt: "" },
    dev: { delete: false, upload: false, download: false },
};

export default function Dashboard() {
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        success: false,
    });

    const [popupPart, setPopupPart] = useState<Part>(defaultPart);
    const [showPopup, setShowPopup] = useState(false);
    const [hotPart, setHotPart] = useState<Part>(defaultPart);
    const [completedPart, setCompletedPart] = useState<Part>(defaultPart);

    const [filter, setFilter] = useState("Select a filter");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleAsync = async () => {
            if (hotPart.id === "") return;

            const request = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}editPart`,
                {
                    hotPart,
                }
            );

            const message = hotPart.dev.delete
                ? "Successfully deleted part"
                : "Successfully modified " + hotPart.name + "!";

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
                    src={torqueLogo}
                    alt="TorqueLogo"
                    className="h-10 Textenter TextCenterDiv"
                    style={{ position: "absolute", left: "42%", right: "50%" }}
                ></img>
                <h1
                    className="TextCenter TextCenterDiv"
                    style={{ position: "absolute", left: "45%", right: "50%" }}
                >
                    Torqueue
                </h1>

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
