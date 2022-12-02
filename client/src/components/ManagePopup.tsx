import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../index.css";

type Props = {
    popupPart: Part;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

interface Files {
    name: string;
    filetype: string;
}

interface Part {
    name: string;
    status: number;
    machine: string;
    needed: string;
    priority: string;
    files: Files[];
}

enum Status {
    NEEDS_3D_PRINTING = "Needs 3D Printing",
    NEEDS_CAM = "Needs CAM",
    NEEDS_MACHINING = "Needs Machining",
    NEEDS_PROCESSING = "Needs Processing",
    NEEDS_ASSEMBLY = "Needs Assembly",
}

export default function ManagePopup({
    popupPart,
    setHotPart,
    setPopupPart,
}: Props) {
    const [name, setName] = useState(popupPart.name);
    const [machine, setMachine] = useState(popupPart.machine);
    let [status, setStatus] = useState(popupPart.status);
    const [needed, setNeeded] = useState(popupPart.needed);
    const [priority, setPriority] = useState(popupPart.priority);

    const previousName = useRef("");
    const previousMachine = useRef("");
    const previousStatus = useRef(0);
    const previousNeeded = useRef("");
    const previousPriority = useRef("");

    const [file, setFile] = useState<Files>({ name: "", filetype: "" });
    const partFile = useRef(null);

    useEffect(() => {
        previousName.current = name;
        previousMachine.current = machine;
        previousStatus.current = status;
        previousNeeded.current = needed;
        previousPriority.current = priority;
    }, [name, machine, status, needed, priority]);

    useEffect(() => {
        setName(popupPart.name);
        setMachine(popupPart.machine);
        setStatus(popupPart.status);
        setNeeded(popupPart.needed);
        setPriority(popupPart.priority);
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
        setPopupPart({
            name: "",
            status: 0,
            machine: "",
            needed: "",
            priority: "",
            files: [],
        });
    };

    const handleFileUpload = (e: { target: { files: any } }) => {
        const { files } = e.target;
        if (files && files.length) {
            const filename = files[0].name;
            const parts = filename.split(".");
            const fileType = parts[parts.length - 1];
            setFile({ name: files[0], filetype: fileType });
        }
    };

    const savePart = () => {
        setHotPart({
            name: name,
            status: status,
            machine: machine,
            needed: needed,
            priority: "",
            files: [...popupPart.files, file],
        });
        close();
    };

    const deletePart = () => {
        setHotPart(null);
        close();
    };

    return (
        <>
            <Modal
                show={popupPart.name !== ""}
                onHide={() => close()}
                tabIndex="-1"
            >
                <Modal.Header closeButton className="bg-black text-white">
                    <Modal.Title>Edit This Part</Modal.Title>
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
                            <label className="Popup">Machine: </label>
                            <input
                                type="text"
                                className="form-control Popup w-50 BlackTextBox relative left-4"
                                value={machine}
                                onChange={(e) => setMachine(e.target.value)}
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
