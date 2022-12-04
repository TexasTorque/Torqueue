

export interface Part {
    id: string;
    name: string;
    status: number;
    material: string;
    machine: string;
    needed: string;
    priority: string;
    cad_uploaded: boolean;
    cam_uploaded: boolean;
    files: {
        cadext: string;
        camext: string;
    }
    dev: {
        delete: boolean, 
        upload: boolean, 
        download: boolean,
        
    };
}
