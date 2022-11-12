import React from "react";
import TableHeader from "../components/TableHeader";
import TableBody from "../components/TableBody";
import Table from "react-bootstrap/Table";

export default function Dashboard() {
    return (
        <Table striped bordered hover>
            <TableHeader />
            <TableBody />
        </Table>
    );
}
