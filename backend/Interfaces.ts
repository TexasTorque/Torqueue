export interface Files {
    id: string;
}

export interface Part {
    id: string;
    name: string;
    status: number;
    material: string;
    machine: string;
    needed: string;
    priority: string;
    files: Files;
    dev: {delete: boolean, upload: boolean, download: boolean};
}
