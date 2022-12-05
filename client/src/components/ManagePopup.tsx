import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../index.css";
import { Part, Status } from "../Interfaces";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";

type Props = {
    popupPart: Part;
    showPopup: boolean;
    setShowPopup: (show: boolean) => void;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
};

export default function ManagePopup({
    popupPart,
    setHotPart,
    showPopup,
    setShowPopup,
}: Props) {
    let [name, setName] = useState(popupPart.name);
    const [machine, setMachine] = useState(popupPart.machine);
    const [material, setMaterial] = useState(popupPart.machine);
    let [status, setStatus] = useState(popupPart.status);
    const [needed, setNeeded] = useState(popupPart.needed);
    const [priority, setPriority] = useState(popupPart.priority);
    const [notes, setNotes] = useState(popupPart.notes);
    const [popupName, setPopupName] = useState("");

    const previousName = useRef("");
    const previousMachine = useRef("");
    const previousMaterial = useRef("");
    const previousStatus = useRef(0);
    const previousNeeded = useRef("");
    const previousPriority = useRef("");
    const previousNotes = useRef("");

    const [fileType, setUploadFileType] = useState(null);
    const partFile = useRef(null);

    useEffect(() => {
        previousName.current = name;
        previousMachine.current = machine;
        previousStatus.current = status;
        previousMaterial.current = material;
        previousNeeded.current = needed;
        previousPriority.current = priority;
        previousNotes.current = notes;

        const statusKeyboardInput = (e: any) => {
            if (e.keyCode === 39) setStatus(++status);
            else if (e.keyCode === 37) setStatus(--status);
            else if (e.keyCode === 13) savePart();
        };

        window.addEventListener("keydown", statusKeyboardInput);
        return () => window.removeEventListener("keydown", statusKeyboardInput);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, machine, status, needed, priority, material, notes]);

    useEffect(() => {
        setName(popupPart.name);
        setMachine(popupPart.machine);
        setStatus(popupPart.status);
        setNeeded(popupPart.needed);
        setPriority(popupPart.priority);
        setMaterial(popupPart.material);
        setNotes(popupPart.notes);
        if (popupPart.name === "") setPopupName("Add a new part");
        else setPopupName(`Edit ${popupPart.name}`);
    }, [popupPart]);

    const handleFileUpload = async (e: { target: { files: any } }) => {
        const { files } = e.target;
        if (files && files.length) {
            const formData = new FormData();
            formData.append("partUpload", files[0]);
            formData.append("fileId", popupPart.id);
            formData.append("fileType", fileType);

            axios({
                method: "post",
                url: "https://torqueue.texastorque.org/uploadPart",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
        }
    };

    const downloadFile = async (fileType: string) => {
        let params = { fileId: popupPart.id, fileExt: "pdf", name: "test" };

        let byteData = await axios.get(
            "https://torqueue.texastorque.org/downloadPart",
            {
                params,
            }
        );

        const data = byteData.data; // assume you have the data here
        console.log(data);
        //const arrayBuffer = base64ToArrayBuffer(data);
        createAndDownloadBlobFile(data, "testName");
    };

    function base64ToArrayBuffer(base64: string) {
        const binaryString = window.atob(base64); // Comment this if not using base64
        const bytes = new Uint8Array(binaryString.length);
        return bytes.map((byte, i) => binaryString.charCodeAt(i));
    }

    function createAndDownloadBlobFile(
        body: any,
        filename: any,
        extension = "pdf"
    ) {
        const blob = new Blob([body]);
        const fileName = `${filename}.${extension}`;

        const link = document.createElement("a");
        // Browsers that support HTML5 download attribute
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const savePart = () => {
        setHotPart({
            id: popupPart.id,
            name: name,
            status: status,
            material: popupPart.material,
            machine: machine,
            needed: needed,
            priority: priority,
            files: {
                camExt: "",
                cadExt: "",
            },
            notes: notes,
            dev: { delete: false, upload: false, download: false },
        });
        setShowPopup(false);
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
            notes: "",
            files: {
                camExt: "",
                cadExt: "",
            },
            dev: { delete: true, upload: false, download: false },
        });
        setShowPopup(false);
    };

    return (
        <>
            <Modal show={showPopup} onHide={() => setShowPopup(false)}>
                <Modal.Header closeButton className="bg-black text-white">
                    <Modal.Title>{popupName}</Modal.Title>
                    <button
                        className="absolute right-5"
                        onClick={(e) => setShowPopup(false)}
                    >
                        X
                    </button>
                </Modal.Header>
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
                                    onClick={() => setMachine("Tormach")}
                                >
                                    Tormach
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setMachine("Nebula")}
                                >
                                    Nebula
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setMachine("Omio")}
                                >
                                    Omio
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setMachine("Lathe")}
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
                                Object.values(Status)[status < 0 ? 0 : status]
                            }
                            onChange={(e) =>
                                setStatus(Math.max(0, parseInt(e.target.value)))
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
                            <label className="Popup">Remaining: </label>
                            <input
                                type="button"
                                value="-"
                                className="btn btn-danger left-9"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const value =
                                        needed === "" ? 0 : parseInt(needed);
                                    setNeeded("" + Math.max(0, value - 1));
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
                                        needed === "" ? 0 : parseInt(needed);
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
                                    setPriority("" + Math.max(0, value - 1));
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

                        <label className="Popup NoteLabel">Notes: </label>
                        <textarea
                            placeholder="Add a note"
                            className="form-control Popup w-50 BlackTextBox NoteBox"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <br />
                        <br />
                        <button
                            type="button"
                            value="+"
                            className="btn btn-secondary left-11 rounded-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                setUploadFileType("cad");
                                if (partFile.current !== null) {
                                    partFile.current["click"]();
                                }
                                setUploadFileType("cad");
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
                                downloadFile("cad");
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
                                setUploadFileType("cad");
                                if (partFile.current !== null) {
                                    partFile.current["click"]();
                                }
                                setUploadFileType("cam");
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
                                downloadFile("cam");
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
                        className="btn btn-success"
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            savePart();
                        }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
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
