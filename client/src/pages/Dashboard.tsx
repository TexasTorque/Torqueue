import React from "react";
import TableHeader from "../components/TableHeader";
import Table from "react-bootstrap/Table";
import TableBody from "../components/PartBody";

export default function Dashboard() {
    return (
        <>
            {
                <Table striped bordered hover>
                    <TableHeader />
                    <tbody>
                        <TableBody />
                    </tbody>
                </Table>
            }
        </>
    );
}
