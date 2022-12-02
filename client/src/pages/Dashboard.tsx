import TableHeader from "../components/TableHeader";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import TableBody from "../components/TableBody";
import ManagePopup from "../components/ManagePopup";
import "../index.css";

interface Part {
    name: string;
    status: number;
    machine: string;
    needed: string;
    priority: string;
    files: Files[];
}

interface Files {
    name: string;
    filetype: string;
}

export default function Dashboard() {
    const [popupPart, setPopupPart] = useState<Part>({
        name: "",
        status: 0,
        machine: "",
        needed: "0",
        priority: "",
        files: [],
    });

    const [hotPart, setHotPart] = useState<Part>({
        name: "",
        status: 0,
        machine: "",
        needed: "0",
        priority: "",
        files: [],
    });

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_URL + "/editPart", {
            method: "post",
            headers: new Headers({
                "Content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            }),
            body: hotPart as any,
        });
    }, [hotPart]);

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
