import { Button } from "react-bootstrap";
import { Part, Status } from "../Interfaces";
type Props = {
    part: Part;
    setPopupPart: (part: Part) => void;
    setHotPart: (part: Part) => void;
};

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
            <td>{part.machine}</td>
            <td>{part.material}</td>
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