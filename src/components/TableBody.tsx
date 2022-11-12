import React from "react";
import "../App.css";
import { ReactElement } from "react";

export default function TableBody() {
    var alphas: string[] = ["asdas", "adfas", "asdasdf"];

    alphas.map((str: string) => {
        <tr>
            <th>{str}</th>
            <th>Status</th>
            <th>Machine</th>
            <th>Edit</th>
        </tr>;
    });

    return alphas.map((str: string) => {
        return (
            <tr>
                <th>{str}</th>
                <th>Status</th>
                <th>Machine</th>
                <th>Edit</th>
            </tr>
        );
    });
}
