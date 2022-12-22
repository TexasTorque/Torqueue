import ProjectDropdown from "./ProjectDropdown";

type Props = {
    projects: string[];
    setProjectFilter: (projectFilter: string) => void;
};

export const ProjectDDMenu: Function = ({
    projects,
    setProjectFilter,
}: Props): JSX.Element[] => {
    return projects.map((project: string, id: number) => {
        return (
            <ProjectDropdown
                key={id}
                project={project}
                setProjectFilter={setProjectFilter}
            />
        );
    });
};
