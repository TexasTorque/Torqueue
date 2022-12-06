import { useState, useEffect } from "react";
import PartRow from "./PartRow";
import { Part } from "../Interfaces";

type Props = {
    completedPart: Part;
    searchQuery: string;
    filter: string;
    setShowPopup: (show: boolean) => void;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

export default function TableBody({
    setPopupPart,
    setHotPart,
    searchQuery,
    filter,
    completedPart,
    setShowPopup,
}: Props) {
    let [parts, setParts] = useState<Part[]>([]);
    let includeCompleted = false;

    useEffect(() => {
        getAllParts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completedPart]);

    const getAllParts = async () => {
        let responseJSON: any;
        let listParts = [] as Part[];
        await fetch("http://localhost:5738/getAllParts").then(
            (response) =>
                response.json().then((data) => {
                    responseJSON = data[1].active;
                })
        );

        for (let part in responseJSON) listParts.push(responseJSON[part]);

        listParts.sort((a, b) => {
            return numberSortArray(a.priority, b.priority);
        });

        setParts(listParts);
    };

    const numberSortArray = (a: any, b: any) => {
        return a > b ? 1 : a < b ? -1 : 0;
    };

    if (filter === "All machines" || filter === "Select a filter") {
        includeCompleted = false;
        filter = "";
    } else if (filter === "None") {
        filter = "";
        includeCompleted = true;
    }
    return (
        <>
            {parts
                .filter((part) =>
                    part.machine.toLowerCase().includes(filter.toLowerCase())
                )
                .filter((part) => (includeCompleted ? true : part.status !== 5))
                .filter((part) =>
                    part.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((part: Part, id: number) => {
                    return (
                        <PartRow
                            key={id}
                            part={part}
                            setPopupPart={setPopupPart}
                            setHotPart={setHotPart}
                            setShowPopup={setShowPopup}
                        />
                    );
                })}
        </>
    );
}
