export interface Part {
    id: string;
    name: string;
    status: number;
    material: string;
    machine: string;
    needed: string;
    priority: string;
    notes: string;
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
    NEEDS_CAM = "Needs CAM",
    NEEDS_MACHINING = "Needs Machining",
    NEEDS_PROCESSING = "Needs Processing",
    NEEDS_ASSEMBLY = "Needs Assembly",
    COMPLETE = "Complete!",
}
