import { Button } from "react-bootstrap";
import { Part, Status } from "../Interfaces";
type Props = {
    part: Part;
    setPopupPart: (part: Part) => void;
    setShowPopup: (show: boolean) => void;
    setHotPart: (part: Part) => void;
};

export default function PartRow({
    part,
    setPopupPart,
    setHotPart,
    setShowPopup,
}: Props): JSX.Element {
    const manage = (e: any) => {
        e.preventDefault();
        setPopupPart(part);
        setShowPopup(true);
    };

    const complete = (e: any) => {
        e.preventDefault();
        if (parseInt(part.needed) > 0) part.needed = parseInt(part.needed) - 1 + "";
        if (part.needed === "0") part.status++
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