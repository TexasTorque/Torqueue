import TableHeader from "../components/TableHeader";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import TableBody from "../components/TableBody";
import ManagePopup from "../components/ManagePopup";
import "../index.css";
import { Part } from "../Interfaces";
import { v4 as uuid4 } from "uuid";

const defaultPart = {
    id: "",
    name: "",
    status: 0,
    machine: "",
    material: "",
    needed: "0",
    priority: "",
    files: { id: "", filetypes: [""] },
    dev: { delete: false, upload: false, download: false },
};

export default function Dashboard() {
    const [popupPart, setPopupPart] = useState<Part>(defaultPart);
    const [hotPart, setHotPart] = useState<Part>(defaultPart);

    const [machineView, setMachineView] = useState("Select a filter");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (hotPart.name !== "")
            fetch(process.env.REACT_APP_BACKEND_URL + "/editPart", {
                method: "post",
                headers: new Headers({
                    "Content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                }),
                body: hotPart as any,
            });
        else if (hotPart.dev.delete)
            fetch(process.env.REACT_APP_BACKEND_URL + "/deletePart", {
                method: "post",
                headers: new Headers({
                    "Content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                }),
                body: hotPart.id as string,
            });
    }, [hotPart]);

    const handleAddPart = (e: any) => {
        e.preventDefault();
        let newPart = defaultPart;
        newPart.id = uuid4();
        setPopupPart(defaultPart);
    };

    return (
        <>
            <div className="fixed-top navbar NavHead flex">
                <h2 className="flex pl-3">Filter: </h2>
                <Dropdown className="top-0 flex" style={{ paddingLeft: "1em" }}>
                    <Dropdown.Toggle variant="success">
                        {machineView}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => setMachineView("Lathe")}>
                            View all
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={(e) => setMachineView("Tormach")}
                        >
                            Tormach
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={(e) => setMachineView("Nebula")}
                        >
                            Nebula
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setMachineView("Omio")}>
                            Omio
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => setMachineView("Lathe")}>
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
