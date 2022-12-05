export default function TableHeader() {
    return (
        <thead>
            <tr>
                <th className="TableHeaderCell">Priority</th>
                <th className="TableHeaderCell">Part</th>
                <th className="TableHeaderCell">Machine</th>
                <th className="TableHeaderCell">Material</th>
                <th className="TableHeaderCell">Status</th>
                <th className="w-5 TableHeaderCell">Remaining</th>
                <th className="w-5 TableHeaderCell">Complete</th>
                <th className="TableHeaderCell">Manage</th>
            </tr>
        </thead>
    );
}
