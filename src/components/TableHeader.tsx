import React from "react";
import "../App.css";

export default function TableHeader() {
    return (
        <thead>
            <tr>
                <th className="bold">Part</th>
                <th>Status</th>
                <th>Machine</th>
                <th>Edit</th>
            </tr>
        </thead>
    );
}
