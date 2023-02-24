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
    files: {
        cadExt: string;
        camExt: string;
    };
    dev: {
        delete: boolean;
    };
}

export enum Status {
    NEEDS_3D_PRINTING = "Needs 3D Printing",
    NEEDS_ORDERING = "Needs Ordering",
    NEEDS_CAD = "Needs CAD",
    NEEDS_CAM = "Needs CAM",
    NEEDS_MACHINING = "Needs Machining",
    NEEDS_PROCESSING = "Needs Processing",
    NEEDS_ASSEMBLY = "Needs Assembly",
    COMPLETE = "Complete!",
}
