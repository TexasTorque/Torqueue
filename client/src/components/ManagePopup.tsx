import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../index.css";

type Props = {
    popupPart: Part;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

interface Part {
    name: string;
    status: number;
    machine: string;
    needed: string;
    priority: number;
}

enum Status {
    NEEDS_ASSEMBLY = "Needs Assembly",
    NEEDS_PROCESSING = "Needs Processing",
    NEEDS_MACHINING = "Needs Machining",
    NEEDS_CAM = "Needs CAM",
    NEEDS_3D_PRINTING = "Needs 3D Printing",
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

    const previousName = useRef("");
    const previousMachine = useRef("");
    const previousStatus = useRef(0);
    const previousNeeded = useRef("");

    useEffect(() => {
        previousName.current = name;
        previousMachine.current = machine;
        previousStatus.current = status;
        previousNeeded.current = needed;
    }, [name, machine, status, needed]);

    useEffect(() => {
        setName(popupPart.name);
        setMachine(popupPart.machine);
        setStatus(popupPart.status);
        setNeeded(popupPart.needed);
    }, [popupPart]);

    const close = () => {
        setPopupPart({
            name: "",
            status: 0,
            machine: "",
            needed: "",
            priority: 0,
        });
    };
    return (
        <>
            <Modal show={popupPart.name !== ""} onHide={() => close()}>
                <Modal.Header closeButton className="bg-black text-white">
                    <Modal.Title>Edit This Part</Modal.Title>
                </Modal.Header>
                <form>
                    <Modal.Body className="bg-black text-white">
                        <div className="">
                            <label className="Popup">Name: </label>
                            <input
                                type="text"
                                className="form-control Popup w-50 BlackTextBox"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <br />
                            <label className="Popup">Machine: </label>
                            <input
                                type="text"
                                className="form-control Popup w-50 BlackTextBox"
                                value={machine}
                                onChange={(e) => setMachine(e.target.value)}
                            />

                            <br />
                            <label className="Popup">Status: </label>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatus(++status);
                                }}
                            >
                                &#60;
                            </button>
                            <input
                                type="text"
                                className="form-control Popup w-50 BlackTextBox"
                                value={Object.values(Status)[status]}
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatus(--status);
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
                            type="submit"
                            onClick={(e) => {
                                // editBook(e);
                            }}
                        >
                            Delete
                        </Button>

                        <Button
                            variant="secondary"
                            className="btn btn-success "
                            type="submit"
                            onClick={(e) => {
                                // editBook(e);
                            }}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}
