interface Part {
    name: string;
    status: number;
    machine: string;
    needed: string;
    priority: number;
}

type Props = {
    part: Part;
    setPopupPart: (hotPart: Part) => void;
};

export default function TableRow({ part, setPopupPart }: Props): JSX.Element {
    const manage = (e: any) => {
        e.preventDefault();
        setPopupPart(part);
    };
    return (
        <tr>
            <td>{part.priority}</td>
            <td>{part.name}</td>
            <td>{part.status}</td>
            <td>{part.needed}</td>
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
