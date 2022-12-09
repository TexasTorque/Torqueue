import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../index.css";
import { Part, Status } from "../Interfaces";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";

type Props = {
    popupPart: Part;
    showPopup: boolean;
    BACKEND_URL: string;
    defaultPart: Part;
    setShowPopup: (show: boolean) => void;
    setHotPart: (hotPart: Part) => void;
    setPopupPart: (hotPart: Part) => void;
    setAlert: (params: any) => void;
};

export default function ManagePopup({
    popupPart,
    setHotPart,
    showPopup,
    setShowPopup,
    setAlert,
    BACKEND_URL,
    defaultPart,
    setPopupPart,
}: Props) {
    const [name, setName] = useState(popupPart.name);
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
    const previousPriority = useRef("1");
    const previousNotes = useRef("");

    const [uploadFileType, setUploadFileType] = useState("cad");

    const openFileSelector = useRef(null);

    let fileUploadExtension = "",
        overRideCAD = false,
        overRideCAM = false;

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
            else if (e.keyCode === 13) {
                savePart();
                setShowPopup(false);
            }
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
        if (popupPart.name === "") setPopupName("Add A New Part");
        else setPopupName(`Edit ${popupPart.name}`);
    }, [popupPart]);

    const handleFileUpload = async (e: { target: { files: any } }) => {
        const { files } = e.target;
        if (files && files.length) {
            const parts = files[0].name.split(".");
            fileUploadExtension = parts[parts.length - 1];

            if (uploadFileType === "cad")
                popupPart.files.cadExt = fileUploadExtension;
            else popupPart.files.camExt = fileUploadExtension;

            const formData = new FormData();

            formData.append("fileId", popupPart.id);
            formData.append("fileType", uploadFileType);
            formData.append("partUpload", files[0]);

            const request = await axios({
                method: "POST",
                url: `${BACKEND_URL}/uploadPart`,
                headers: { "Content-Type": "multipart/form-data" },
                data: formData,
            });

            if (request.data === "success") {
                setAlert({
                    show: true,
                    message: "File Successfully Uploaded",
                    success: true,
                });

                setTimeout(() => {
                    setAlert({
                        show: false,
                        message: "",
                        success: false,
                    });
                }, 2000);

                savePart();
            }
        }
    };

    const handleOpenFileSelector = (selectedFileType: string) => {
        if (
            selectedFileType === "cad" &&
            popupPart.files.cadExt !== "" &&
            !overRideCAD
        ) {
            alert(
                "This Part Already Has A CAD File. Upload A New File To Override The Current One."
            );
            overRideCAD = true;
            return;
        } else if (
            selectedFileType === "cam" &&
            popupPart.files.camExt !== "" &&
            !overRideCAM
        ) {
            alert(
                "This Part Already Has A CAM File. Upload A New File To Override The Current One."
            );
            overRideCAM = true;
            return;
        }

        openFileSelector.current["click"]();
    };

    const handleFileDownload = async (fileType: string) => {
        let fileExtension = fileType === "cad" ? "cad" : "cam";
        let params = {
            fileId: popupPart.id,
            fileExt: fileExtension,
            name: `${popupPart.name}-${fileType === "cad" ? "CAD" : "GCODE"}`,
        };

        axios({
            url: `${BACKEND_URL}/downloadPart`,
            method: "GET",
            responseType: "blob",
            params: params,
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `${popupPart.name}-${fileType}.${
                    fileType === "cad"
                        ? popupPart.files.cadExt
                        : popupPart.files.camExt
                }`
            );
            document.body.appendChild(link);
            link.click();
        });
    };

    const savePart = () => {
        setHotPart({
            id: popupPart.id,
            name: name,
            status: status,
            material: material,
            machine: machine,
            needed: needed,
            priority: priority,
            files: {
                camExt: popupPart.files.camExt,
                cadExt: popupPart.files.cadExt,
            },
            notes: notes,
            dev: { delete: false, upload: false, download: false },
        });

        setPopupPart(defaultPart);
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
                camExt: popupPart.files.camExt,
                cadExt: popupPart.files.cadExt,
            },
            dev: { delete: true, upload: false, download: false },
        });
        setShowPopup(false);
    };

    return (
        <>
            <Modal
                show={showPopup}
                onHide={() => {
                    setPopupPart(defaultPart);
                    setShowPopup(false);
                    console.log("Bye")
                }}
            >
                <Modal.Header closeButton className="bg-black text-white">
                    <Modal.Title>{popupName}</Modal.Title>
                    <button
                        className="absolute right-5"
                        onClick={() => {
                            setPopupPart(defaultPart);
                            setShowPopup(false);
                        }}
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
                                    setPriority("" + Math.max(1, value - 1));
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
                                if (openFileSelector.current !== null) {
                                    setUploadFileType("cad");
                                    handleOpenFileSelector("cad");
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
                                handleFileDownload("cad");
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
                                if (openFileSelector.current !== null) {
                                    setUploadFileType("cam");
                                    handleOpenFileSelector("cam");
                                }
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
                                handleFileDownload("cam");
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
                            setShowPopup(false);
                        }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <input
                style={{ display: "none" }}
                ref={openFileSelector}
                onChange={handleFileUpload}
                type="file"
            />
        </>
    );
}
