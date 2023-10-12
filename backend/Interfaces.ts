export interface Files {
    id: string;
}

export interface Part {
    id: string;
    name: string;
    status: number;
    material: string;
    machine: string;
    endmill: string;
    needed: string;
    priority: string;
    notes: string;
    project: string;
    link: string;
    creator: string;
    createDate: string;
    partNumber: number;
    dueDate: string;
    files: {
        cadExt: string;
        camExt: string;
        camSize: string;
    };
    dev: {
        delete: boolean;
    };
}
