import React from "react";
import "../App.css";
import TableRow from "./PartRow";

export default function TableBody(): JSX.Element {
    var alphas: string[] = ["part 1", "part 2", "part 3"];

    return (
        <>
            {alphas.map((string1: string) => {
                return <TableRow key={string1} title={string1} />;
            })}
        </>
    );
}
