import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../index.css";
import { Part, Files } from "../Interfaces";
import { v4 as uuid4 } from "uuid";
import Dropdown from "react-bootstrap/Dropdown";

type Props = {
    popupPart: Part;
    defaultPart: Part;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

enum Status {
    NEEDS_3D_PRINTING = "Needs 3D Printing",
    NEEDS_CAM = "Needs CAM",
    NEEDS_MACHINING = "Needs Machining",
    NEEDS_PROCESSING = "Needs Processing",
    NEEDS_ASSEMBLY = "Needs Assembly",
    COMPLETE = "Complete!",
}

export default function ManagePopup({
    popupPart,
    setHotPart,
    defaultPart,
    setPopupPart,
}: Props) {
    const [name, setName] = useState(popupPart.name);
    const [machine, setMachine] = useState(popupPart.machine);
    const [material, setMaterial] = useState(popupPart.machine);
    let [status, setStatus] = useState(popupPart.status);
    const [needed, setNeeded] = useState(popupPart.needed);
    const [priority, setPriority] = useState(popupPart.priority);

    const previousName = useRef("");
    const previousMachine = useRef("");
    const previousMaterial = useRef("");
    const previousStatus = useRef(0);
    const previousNeeded = useRef("");
    const previousPriority = useRef("");

    const [file, setFile] = useState<Files>({ id: "", filetypes: [] });
    const partFile = useRef(null);

    useEffect(() => {
        previousName.current = name;
        previousMachine.current = machine;
        previousStatus.current = status;
        previousMaterial.current = material;
        previousNeeded.current = needed;
        previousPriority.current = priority;
    }, [name, machine, status, needed, priority, material]);

    useEffect(() => {
        setName(popupPart.name);
        setMachine(popupPart.machine);
        setStatus(popupPart.status);
        setNeeded(popupPart.needed);
        setPriority(popupPart.priority);
        setMaterial(popupPart.material);
    }, [popupPart]);

    useEffect(() => {
        const statusKeyboardInput = (e: any) => {
            if (e.keyCode === 39) setStatus(++status);
            else if (e.keyCode === 37) setStatus(--status);
        };
        window.addEventListener("keydown", statusKeyboardInput);
        return () => window.removeEventListener("keydown", statusKeyboardInput);
    }, [status]);

    const close = () => {
        setPopupPart(defaultPart);
    };

    const handleFileUpload = (e: { target: { files: any } }) => {
        const { files } = e.target;
        if (files && files.length) {
            const filename = files[0].name;
            const parts = filename.split(".");
            const fileType = parts[parts.length - 1];
            console.log(files[0]); // ASK JAOCB ABOUT THIS
            setFile({ id: files[0], filetypes: fileType });
        }
    };

    const savePart = () => {
        if (popupPart.id === "") popupPart.id = uuid4();

        setHotPart({
            id: popupPart.id,
            name: name,
            status: status,
            material: popupPart.material,
            machine: machine,
            needed: needed,
            priority: priority,
            files: {
                id: "",
                filetypes: [],
            },
            dev: { delete: false, upload: false, download: false },
        });
        close();
    };

    const deletePart = () => {
        setHotPart({
            id: popupPart.id,
            name: "",
            status: 0,
            material: "",
            machine: "",
            needed: "",
            priority: "",
            files: { id: "", filetypes: [] },
            dev: { delete: true, upload: false, download: false },
        });
        close();
    };

    return (
        <>
            <Modal show={popupPart.id !== ""} onHide={() => close()}>
                <Modal.Header closeButton className="bg-black text-white">
                    <Modal.Title>Edit This Part</Modal.Title>
                    <button
                        className="absolute right-5"
                        onClick={(e) => close()}
                    >
                        X
                    </button>
                </Modal.Header>
                <form>
                    <Modal.Body className="bg-black text-white">
                        <div className="">
                            <label className="Popup">Name: </label>
                            <input
                                type="text"
                                className="form-control Popup w-50 BlackTextBox relative left-4"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <br />
                            <br />

                            <label className="Popup">Machine: </label>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="primary"
                                    className="ManagePopupDropdown"
                                >
                                    {machine}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="ManagePopupDropdownMenu">
                                    <Dropdown.Item
                                        onClick={(e) => setMachine("Tormach")}
                                    >
                                        Tormach
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => setMachine("Nebula")}
                                    >
                                        Nebula
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => setMachine("Omio")}
                                    >
                                        Omio
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => setMachine("Lathe")}
                                    >
                                        Lathe
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <br />
                            <label className="Popup">Material: </label>
                            <input
                                type="text"
                                className="form-control Popup w-50 BlackTextBox relative left-4"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                            />

                            <br />
                            <label className="Popup">Status: </label>
                            <button
                                className={`relative left-2 ${
                                    status <= 0 ? "opacity-0" : ""
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatus(--status);
                                }}
                            >
                                &#60;
                            </button>
                            <input
                                type="text"
                                className="form-control Popup w-50 BlackTextBox relative left-2"
                                value={
                                    Object.values(Status)[
                                        status < 0 ? 0 : status
                                    ]
                                }
                                onChange={(e) =>
                                    setStatus(
                                        Math.max(0, parseInt(e.target.value))
                                    )
                                }
                            />
                            <button
                                className={`relative left-2 ${
                                    status > 3 ? "opacity-0" : ""
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatus(++status);
                                }}
                            >
                                &#62;
                            </button>
                            <br />
                            <br />

                            <div className="btn-group ">
                                <label className="Popup">Error: </label>
                                <input
                                    type="button"
                                    value="-"
                                    className="btn btn-danger left-9"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const value =
                                            needed === ""
                                                ? 0
                                                : parseInt(needed);
                                        setNeeded("" + (value - 1));
                                    }}
                                />

                                <input
                                    type="text"
                                    className="outline outline-1 w-20 text-center relative left-10 text-black BlackTextBox"
                                    value={needed}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setNeeded(e.target.value);
                                    }}
                                />

                                <input
                                    type="button"
                                    value="+"
                                    className="btn btn-success left-11 rounded-sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const value =
                                            needed === ""
                                                ? 0
                                                : parseInt(needed);
                                        setNeeded(value + 1 + "");
                                    }}
                                />
                            </div>

                            <br />
                            <br />
                            <div className="btn-group ">
                                <label className="Popup">Priority: </label>
                                <input
                                    type="button"
                                    value="-"
                                    className="btn btn-danger left-9"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const value =
                                            priority === ""
                                                ? 0
                                                : parseInt(priority);
                                        setPriority("" + (value - 1));
                                    }}
                                />

                                <input
                                    type="text"
                                    className="outline outline-1 w-20 text-center relative left-10 text-black BlackTextBox"
                                    value={priority}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setPriority(e.target.value);
                                    }}
                                />

                                <input
                                    type="button"
                                    value="+"
                                    className="btn btn-success left-11 rounded-sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const value =
                                            priority === ""
                                                ? 0
                                                : parseInt(priority);
                                        setPriority(value + 1 + "");
                                    }}
                                />
                            </div>

                            <br />
                            <br />
                            <button
                                type="button"
                                value="+"
                                className="btn btn-secondary left-11 rounded-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (partFile.current !== null) {
                                        partFile.current["click"]();
                                    }
                                }}
                            >
                                Upload CAD
                            </button>
                            <button
                                type="button"
                                value="+"
                                className="btn btn-secondary left-11 rounded-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const value =
                                        needed === "" ? 0 : parseInt(needed);
                                    setNeeded(value + 1 + "");
                                }}
                            >
                                Download CAD
                            </button>

                            <button
                                type="button"
                                value="+"
                                className="btn btn-secondary left-11 rounded-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const value =
                                        needed === "" ? 0 : parseInt(needed);
                                    setNeeded(value + 1 + "");
                                }}
                            >
                                Upload GCODE
                            </button>
                            <button
                                type="button"
                                value="+"
                                className="btn btn-secondary left-11 rounded-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const value =
                                        needed === "" ? 0 : parseInt(needed);
                                    setNeeded(value + 1 + "");
                                }}
                            >
                                Download GCODE
                            </button>
                        </div>
                    </Modal.Body>

                    <Modal.Footer className="bg-black">
                        <Button
                            variant="secondary"
                            className="btn btn-danger absolute left-0"
                            onClick={(e) => {
                                e.preventDefault();
                                deletePart();
                            }}
                        >
                            Delete
                        </Button>

                        <Button
                            variant="secondary"
                            className="btn btn-success "
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                savePart();
                            }}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <input
                style={{ display: "none" }}
                ref={partFile}
                onChange={handleFileUpload}
                type="file"
            />
        </>
    );
}
