export default function TableHeader() {
    return (
        <thead>
            <tr>
                <th className="TableHeaderCell text-center">Priority</th>
                <th className="TableHeaderCell text-center">Part</th>
                <th className="TableHeaderCell text-center">Machine</th>
                <th className="TableHeaderCell text-center">Project</th>
                <th className="TableHeaderCell text-center">Material</th>
                <th className="TableHeaderCell text-center">Status</th>
                <th className="w-5 TableHeaderCell text-center">Remaining</th>
                <th className="w-5 TableHeaderCell text-center">Complete</th>
                <th className="TableHeaderCell text-center" >↓ GCODE</th>
                <th className="TableHeaderCell text-center">Manage</th>
            </tr>
        </thead>
    );
}
