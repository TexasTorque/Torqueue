import PartRow from "./PartRow";
import { Part, Status } from "../Interfaces";

type Props = {
    searchQuery: string;
    filter: string;
    BACKEND_URL: string;
    parts: Part[];
    projectFilter: string;
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
    projectFilter,
    BACKEND_URL,
}: Props) {
    let includeCompleted = false;

    if (filter === "All Machines" || filter === "Show All") {
        includeCompleted = false;
        filter = "";
    } else if (filter === "Include Completed") {
        filter = "";
        includeCompleted = true;
    }
    console.log(Object.keys(Status).indexOf('COMPLETE'));
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
                .filter((part) =>
                    projectFilter === "Show All"
                        ? true
                        : part.project
                              .toLowerCase()
                              .includes(projectFilter.toLowerCase())
                )
                .filter((part) => (includeCompleted ? true : part.status !== Object.keys(Status).indexOf('COMPLETE')))
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
                            BACKEND_URL={BACKEND_URL}
                        />
                    );
                })}
        </>
    );
}
