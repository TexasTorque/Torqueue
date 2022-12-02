import { Button } from "react-bootstrap";

interface Part {
    name: string;
    status: number;
    machine: string;
    needed: string;
    priority: string;
    files: Files[];
}

interface Files {
    name: string;
    filetype: string;
}

type Props = {
    part: Part;
    setPopupPart: (part: Part) => void;
    setHotPart: (part: Part) => void;
};

enum Status {
    NEEDS_3D_PRINTING = "Needs 3D Printing",
    NEEDS_CAM = "Needs CAM",
    NEEDS_MACHINING = "Needs Machining",
    NEEDS_PROCESSING = "Needs Processing",
    NEEDS_ASSEMBLY = "Needs Assembly",
}

export default function TableRow({
    part,
    setPopupPart,
    setHotPart,
}: Props): JSX.Element {
    const manage = (e: any) => {
        e.preventDefault();
        setPopupPart(part);
    };

    const complete = (e: any) => {
        e.preventDefault();
        part.needed = parseInt(part.needed) - 1 + "";
        setHotPart(part);
    };
    return (
        <tr>
            <td>{part.priority}</td>
            <td>{part.name}</td>
            <td>{Object.values(Status)[part.status < 0 ? 0 : part.status]}</td>
            <td>{part.needed}</td>
            <td>
                <Button
                    onClick={(e) => complete(e)}
                    className="btn btn-success"
                >
                    ✓
                </Button>
            </td>
            <td className="grid">
                <button
                    className="btn btn-primary my-2"
                    onClick={(e) => manage(e)}
                >
                    Manage
                </button>
            </td>
        </tr>
    );
}
