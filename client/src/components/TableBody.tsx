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
    if (machineFilter === "All") machineFilter = "";

    return parts === null ? (
        <tr>
            <td>Loading...</td>
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
