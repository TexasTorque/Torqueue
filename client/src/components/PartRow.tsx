import "../App.css";

type Props = {
    part: any;
};

export default function TableRow({ part }: Props): JSX.Element {
    return (
        <tr>
            <td>{part.title}</td>
            <td>{part.status}</td>
            <td>{part.machine}</td>
            <td>
                <button>Edit</button>
            </td>
        </tr>
    );
}
