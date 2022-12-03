import { useState, useEffect } from "react";
import PartRow from "./PartRow";
import { Part } from "../Interfaces";

type Props = {
    hotPart: Part;
    defaultPart: Part;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

export default function TableBody({ setPopupPart, setHotPart, defaultPart }: Props) {
    let [parts, setParts] = useState<Part[]>([
        defaultPart
    ]);

    useEffect(() => {
        const callGetAllBooks = async () => {
            await getAllParts();
        };
        callGetAllBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllParts = async () => {
        const testPartArray: Part[] = [
            {
                id: "46932649326",
                name: "Swerve Plate",
                status: 1,
                material: "Aluminum",
                machine: "Tormach",
                needed: "1",
                priority: "7",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            },
            {
                id: "76737543",
                name: "Spacer",
                status: 0,
                material: "Aluminum",
                machine: "Lathe",
                needed: "1",
                priority: "9",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            },
            {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            },
            {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            }, {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            }, {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            }, {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            }, {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            }, {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            }, {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            }, {
                id: "5325325",
                name: "Block",
                status: 3,
                material: "Polycarbonate",
                machine: "Nebula",
                needed: "1",
                priority: "3",
                files: {id: "", filetypes: []},
                dev: {delete: false, upload: false, download: false},
            },
        ];

        testPartArray.sort((a, b) => {
            return numberSortArray(a.priority, b.priority);
        });

        setParts(testPartArray);
    };

    const numberSortArray = (a: any, b: any) => {
        return a < b ? 1 : a > b ? -1 : 0;
    };

    return (
        <>
            {parts.map((part: Part, id: number) => {
                return (
                    <PartRow
                        key={id}
                        part={part}
                        setPopupPart={setPopupPart}
                        setHotPart={setHotPart}
                    />
                );
            })}
        </>
    );
}
