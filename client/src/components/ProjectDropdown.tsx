import Dropdown from "react-bootstrap/Dropdown";
type Props = {
    project: string;
    setProjectFilter: (projectFilter: string) => void;
};
export default function ProjectDropdown({
    setProjectFilter,
    project,
}: Props): JSX.Element {
    return (
        <Dropdown.Item onClick={() => setProjectFilter(project)}>
            {project}
        </Dropdown.Item>
    );
}
