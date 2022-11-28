import React from "react";
import "../App.css";

type CardProps = {
    title: string;
};

export default function TableRow({ title }: CardProps): JSX.Element {
    return (
        <tr>
            <td>{title}</td>
            <td>Status</td>
            <td>Machine</td>
            <td>Edit</td>
        </tr>
    );
}
