import TableHeader from "../components/TableHeader";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import TableBody from "../components/TableBody";
import ManagePopup from "../components/ManagePopup";
import "../index.css";

interface Part {
    name: string;
    status: number;
    machine: string;
    needed: string;
    priority: number;
}

export default function Dashboard() {
    const [popupPart, setPopupPart] = useState<Part>({
        name: "",
        status: 0,
        machine: "",
        needed: "0",
        priority: 0,
    });
    const [hotPart, setHotPart] = useState<Part>({
        name: "",
        status: 0,
        machine: "",
        needed: "0",
        priority: 0,
    });

    return (
        <>
            {
                <Table striped bordered hover variant="dark">
                    <TableHeader />
                    <tbody>
                        <TableBody
                            setPopupPart={setPopupPart}
                            hotPart={hotPart}
                            setHotPart={setHotPart}
                        />
                    </tbody>
                </Table>
            }

            <ManagePopup
                popupPart={popupPart}
                setPopupPart={setPopupPart}
                setHotPart={setHotPart}
            />
        </>
    );
}
