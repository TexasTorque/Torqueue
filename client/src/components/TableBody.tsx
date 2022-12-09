import PartRow from "./PartRow";
import { Part } from "../Interfaces";

type Props = {
    searchQuery: string;
    filter: string;
    BACKEND_URL: string;
    parts: Part[];
    setShowPopup: (show: boolean) => void;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

export default function TableBody({
    setPopupPart,
    setHotPart,
    searchQuery,
    filter,
    setShowPopup,
    parts,
}: Props) {
    let includeCompleted = false;

    if (filter === "All machines" || filter === "Select a filter") {
        includeCompleted = false;
        filter = "";
    } else if (filter === "None") {
        filter = "";
        includeCompleted = true;
    }
    return parts === null ? (
        <tr>
            <td>Loading...</td>
        </tr>
    ) : (
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
