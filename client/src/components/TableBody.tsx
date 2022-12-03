import { useState, useEffect } from "react";
import PartRow from "./PartRow";
import { Part } from "../Interfaces";

type Props = {
    hotPart: Part;
    searchQuery: string;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

export default function TableBody({
    setPopupPart,
    setHotPart,
    searchQuery,
}: Props) {
    let [parts, setParts] = useState<Part[]>([]);

    useEffect(() => {
        getAllParts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllParts = async () => {
        let responseJSON: any;
        let listParts = [] as Part[];
        await fetch(process.env.REACT_APP_BACKEND_URL + "getAllParts").then(
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
        return a < b ? 1 : a > b ? -1 : 0;
    };

    return (
        <>
            {parts
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
                        />
                    );
                })}
        </>
    );
}
