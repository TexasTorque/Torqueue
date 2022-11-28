import React, { useState, useEffect } from "react";
import "../App.css";
import TableRow from "./PartRow";

interface TestPart {
    title: string;
    status: string;
    machine: string;
}

export default function TableBody() {
    let [parts, setParts] = useState<TestPart>({title: "", status: "", machine: ""});


    useEffect(() => {
        const callGetAllBooks = async () => {
            await getAllParts();
        };
        callGetAllBooks();
    }, []);

    const getAllParts = async () => {
        //const request = await fetch(
        //    `${process.env.REACT_APP_BACKEND_URL}/api/getAllParts`
        //);

        

        let array = [];

        const testPartArray: TestPart[] = [
            {
                title: "test part",
                status: "test status",
                machine: "test machine",
            },
            {
                title: "test part 2",
                status: "test status 2",
                machine: "test machine 2",
            },
            {
                title: "test part 3",
                status: "test status 3",
                machine: "test machine 3",
            },
        ];

        setParts(testPartArray);
    };

    return (
        <>
            {parts.map((part: string, id: number) => {
                return <TableRow key={id} part={part} />;
            })}
        </>
    );
}
