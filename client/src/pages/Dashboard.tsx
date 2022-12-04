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

const defaultPart = {
    id: "",
    name: "",
    status: 0,
    machine: "",
    material: "",
    needed: "0",
    priority: "0",
    files: { id: "", filetypes: [""] },
    dev: { delete: false, upload: false, download: false },
};

export default function Dashboard() {
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        success: false,
    });

    const [popupPart, setPopupPart] = useState<Part>(defaultPart);
    const [hotPart, setHotPart] = useState<Part>(defaultPart);

    const [filter, setFilter] = useState("Select a filter");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleAsync = async () => {
            if (hotPart.name !== "") {
                console.log(hotPart);
                const request = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}editPart`,
                    {
                        hotPart,
                    }
                );

                if (request.data === "success") {
                    setAlert({
                        show: true,
                        message: "Successfully modified " + hotPart.name + "!",
                        success: true,
                    });

                    setTimeout(() => {
                        setAlert({
                            show: false,
                            message: "",
                            success: false,
                        });
                    }, 2000);

                    setHotPart(defaultPart);
                }
            } else if (hotPart.dev.delete) {
            }
        };

        handleAsync();
    }, [hotPart]);

    const handleAddPart = (e: any) => {
        e.preventDefault();
        let newPart = defaultPart;
        newPart.id = uuid4();
        setPopupPart(defaultPart);
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
                        <Dropdown.Item onClick={(e) => setFilter("View all")}>
                            View all
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setFilter("Tormach")}>
                            Tormach
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setFilter("Nebula")}>
                            Nebula
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setFilter("Omio")}>
                            Omio
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setFilter("Lathe")}>
                            Lathe
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

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
                        className="SearchBar BlackTextBox"
                        style={{ margin: "1em" }}
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
                                    hotPart={hotPart}
                                    setHotPart={setHotPart}
                                    searchQuery={searchQuery}
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
                defaultPart={defaultPart}
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
