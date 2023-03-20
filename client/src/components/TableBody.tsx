import PartRow from "./PartRow";
import { Part, Status } from "../Interfaces";

type Props = {
    searchQuery: string;
    machineFilter: string;
    BACKEND_URL: string;
    parts: Part[];
    projectFilter: string;
    filter: string;
    setShowPopup: (show: boolean) => void;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

export default function TableBody({
    setPopupPart,
    setHotPart,
    searchQuery,
    machineFilter,
    setShowPopup,
    parts,
    projectFilter,
    BACKEND_URL,
    filter,
}: Props) {
    const randomQuote1 = "Go do some more CAD :)";
    const randomQuote2 = "You can rest easy now  🦆";
    const randomQuote3 = "You're all caught up!";
    const randomQuote4 = "Go do some more CAD Abishek  😡";

    const getRandomQuote = () => {
        const random = Math.floor(Math.random() * 4);
        if (random === 0) return randomQuote1;
        else if (random === 1) return randomQuote2;
        else if (random === 2) return randomQuote3;
        else if (random === 3) return randomQuote4;
        else return randomQuote4;
    };

    if (machineFilter === "All") machineFilter = "";

    if (parts === null)
        return (
            <tr>
                <td>Loading...</td>
            </tr>
        );

    return parts == null ? (
        <tr>
            <td>{getRandomQuote()}</td>
        </tr>
    ) : (
        <>
            {parts
                .filter((part) =>
                    part.machine
                        .toLowerCase()
                        .includes(machineFilter.toLowerCase())
                )
                .filter((part) =>
                    projectFilter === "All"
                        ? true
                        : part.project.toLowerCase() ===
                          projectFilter.toLowerCase()
                )
                .filter((part) =>
                    part.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .filter((part) =>
                    filter === "✓"
                        ? parseInt(part.needed) !== 0 &&
                          part.status !==
                              Object.keys(Status).indexOf("COMPLETE")
                        : true
                )
                .map((part: Part, id: number) => {
                    return (
                        <PartRow
                            key={id}
                            part={part}
                            setPopupPart={setPopupPart}
                            setHotPart={setHotPart}
                            setShowPopup={setShowPopup}
                            BACKEND_URL={BACKEND_URL}
                        />
                    );
                })}
        </>
    );
}
