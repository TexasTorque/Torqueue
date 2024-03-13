import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../index.css";
import { Part, Status } from "../Interfaces";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { v4 as uuid4 } from "uuid";
import MachineDropdown from "./MachineDropdown";

type Props = {
  popupPart: Part;
  showPopup: boolean;
  BACKEND_URL: string;
  defaultPart: Part;
  addPart: any;
  name: string;
  numParts: number;
  projects: string[];
  setName: (name: string) => void;
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
  addPart,
  name,
  numParts,
  projects,
  setName,
}: Props) {
  const [machine, setMachine] = useState(popupPart.machine);
  const [material, setMaterial] = useState(popupPart.machine);
  let [status, setStatus] = useState(popupPart.status);
  const [needed, setNeeded] = useState(popupPart.needed);
  const [priority, setPriority] = useState(popupPart.priority);
  const [notes, setNotes] = useState(popupPart.notes);
  const [popupName, setPopupName] = useState("");
  const [link, setLink] = useState(popupPart.link);
  const [project, setProject] = useState(popupPart.project);
  const [endmill, setEndmill] = useState(popupPart.endmill);
  const [creator, setCreator] = useState(popupPart.creator);
  const [dueDate, setDueDate] = useState(popupPart.dueDate);
  const [asignee, setAsignee] = useState(popupPart.asignee);

  const [loading, setLoading] = useState(false);

  const previousName = useRef("");
  const previousMachine = useRef("");
  const previousEndmill = useRef("");
  const previousProject = useRef("");
  const previousMaterial = useRef("");
  const previousStatus = useRef(0);
  const previousNeeded = useRef("");
  const previousPriority = useRef("1");
  const previousCreator = useRef("");
  const previousNotes = useRef("");
  const previousLink = useRef("");
  const previousDueDate = useRef("");
  const previousAsignee = useRef("");

  const [uploadFileType, setUploadFileType] = useState("cad");
  const [projectOpen, setProjectOpen] = useState(false);

  const openFileSelector = useRef(null);

  let fileUploadExtension = "";

  let hasUploaded = false;

  useEffect(() => {
    previousName.current = name;
    previousMachine.current = machine;
    previousProject.current = project;
    previousStatus.current = status;
    previousMaterial.current = material;
    previousNeeded.current = needed;
    previousPriority.current = priority;
    previousNotes.current = notes;
    previousLink.current = link;
    previousEndmill.current = endmill;
    previousCreator.current = creator;
    previousDueDate.current = dueDate;
    previousAsignee.current = asignee;

    const statusKeyboardInput = (e: any) => {
      if (e.keyCode === 39) setStatus(Math.min(status + 1, 7));
      else if (e.keyCode === 37) setStatus(Math.max(0, status - 1));
      else if (e.keyCode === 13) {
        e.preventDefault();
        savePartAndClose();
      }
    };

    window.addEventListener("keydown", statusKeyboardInput);
    return () => window.removeEventListener("keydown", statusKeyboardInput);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    machine,
    status,
    needed,
    priority,
    material,
    notes,
    project,
    link,
    endmill,
    creator,
    dueDate,
    asignee,
  ]);

  useEffect(() => {
    setName(popupPart.name);
    setMachine(popupPart.machine);
    setEndmill(popupPart.endmill);
    setProject(popupPart.project);
    setStatus(popupPart.status);
    setNeeded(popupPart.needed);
    setPriority(popupPart.priority);
    setMaterial(popupPart.material);
    setNotes(popupPart.notes);
    setLink(popupPart.link);
    setCreator(popupPart.creator);
    setDueDate(popupPart.dueDate);
    setAsignee(popupPart.asignee);

    if (addPart.current) {
      setPopupName("Add a Part");
      popupPart.id = uuid4();
      addPart.current = false;
      popupPart.createDate = getDate();
      popupPart.partNumber = numParts + 1;
      setName("");
    } else setPopupName(`Edit ${popupPart.name}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupPart, showPopup]);

  console.log(popupPart)

  const handleFileUpload = async (e: { target: { files: any } }) => {
    setLoading(true);
    hasUploaded = true;
    const { files } = e.target;
    if (files && files.length) {
      const parts = files[0].name.split(".");
      popupPart.files.camSize =
        files[0].size / 1000 > 1000
          ? Math.round(files[0].size / 100000) / 10 + " MB"
          : Math.round(files[0].size / 1000) + " KB";

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
        setLoading(false);
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

        if (name !== "") savePart();
      }
    }
  };

  const handleOpenFileSelector = (selectedFileType: string) => {
    if (
      selectedFileType === "cad" &&
      popupPart.files.cadExt !== "" 
    ) {
      alert(
        "This part already has A CAD file. Please delete this part and make a new one if you want to change the CAD file."
      );
      return;
    }
    if (
      selectedFileType === "cam" &&
      popupPart.files.camExt !== ""
    ) {
      alert(
        "This part already has A CAM file. Please delete this part and make a new one if you want to change the CAM file."
      );
      return;
    }
    openFileSelector.current["click"]();
  };

  const handleFileDownload = async (fileType: string) => {
    if (popupPart.files.camExt === "" && fileType === "cam") {
      alert("No GCODE Found");
      return;
    } else if (popupPart.files.cadExt === "" && fileType === "cad") {
      alert("No CAD File Found");
      return;
    }
    let fileExtension = fileType === "cad" ? "cad" : "cam";
    let params = {
      fileId: popupPart.id,
      fileExt: fileExtension,
      name: `${popupPart.name}-${fileType === "cad" ? "CAD" : "GCODE"}`,
    };

    await axios({
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
          fileType === "cad" ? popupPart.files.cadExt : popupPart.files.camExt
        }`
      );
      document.body.appendChild(link);
      link.click();
    });
  };

  const isPreston = (creator: string) => {
    creator = creator.toLowerCase().replace(/\s/g, "");
    return false; // Don't be mean to Preston :(
    //return (
    //    creator === "preston" ||
    //    creator === "prestonm" ||
    //    creator === "prestonmontgomery" ||
    //    creator === "pdawg" ||
    //    creator === "pdigity" ||
    //    creator === "pdiggity"
    //);
  };

  const savePart = () => {
    if (name === "") {
      alert("Please provide a name");
      return;
    }

    if (creator === "") {
      alert("Please provide a creator");
      return;
    }

    setHotPart({
      id: popupPart.id,
      name: name,
      status: status,
      material: material,
      machine: machine,
      endmill: endmill,
      needed: needed,
      priority: isPreston(creator) ? "5" : priority,
      project: project,
      creator: creator,
      link: link,
      createDate: getDate(),
      partNumber: popupPart.partNumber,
      dueDate: dueDate,
      asignee: asignee,
      files: {
        camExt: popupPart.files.camExt,
        cadExt: popupPart.files.cadExt,
        camSize: popupPart.files.camSize,
      },
      notes: notes,
      dev: { delete: false },
    });
  };

  const savePartAndClose = () => {
    if (name === "") {
      alert("Please provide a name");
      return;
    }

    if (creator === "") {
      alert("Please provide a creator");
      return;
    }

    if (machine === "") {
      alert("Please provide a machine");
      return;
    }

    if (material === "") {
      alert("Please provide a material");
      return;
    }

    if (endmill === "" && status === 4) {
      alert("Dhiraj wants you to provide an endmill 😡");
      return;
    }

    if (
      name !== popupPart.name ||
      machine !== popupPart.machine ||
      status !== popupPart.status ||
      needed !== popupPart.needed ||
      priority !== popupPart.priority ||
      material !== popupPart.material ||
      notes !== popupPart.notes ||
      project !== popupPart.project ||
      hasUploaded ||
      link !== popupPart.link ||
      creator !== popupPart.creator ||
      endmill !== popupPart.endmill ||
      dueDate !== popupPart.dueDate ||
      asignee !== popupPart.asignee
    ) {
      setHotPart({
        id: popupPart.id,
        name: name,
        status: status,
        material: material,
        endmill: endmill,
        machine: machine,
        needed: needed,
        priority: isPreston(creator) ? "5" : priority,
        creator: creator,
        project: project,
        link: link,
        createDate: getDate(),
        partNumber: popupPart.partNumber,
        dueDate: dueDate,
        asignee: asignee,
        files: {
          camExt: popupPart.files.camExt,
          cadExt: popupPart.files.cadExt,
          camSize: popupPart.files.camSize,
        },
        notes: notes,
        dev: { delete: false },
      });

      setPopupPart(defaultPart);
    }

    setShowPopup(false);
  };

  const getDate = () => {
    const date = new Date();
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes()
    );
  };

  const deletePart = () => {
    setHotPart({
      id: popupPart.id,
      name: popupPart.name,
      status: 0,
      material: "",
      machine: "",
      endmill: "",
      needed: "",
      priority: "",
      creator: "",
      project: "",
      notes: "",
      link: "",
      createDate: "",
      partNumber: 0,
      dueDate: "",
      asignee: "",
      files: {
        camExt: popupPart.files.camExt,
        camSize: popupPart.files.camSize,
        cadExt: popupPart.files.cadExt,
      },
      dev: { delete: true },
    });
    setShowPopup(false);
  };

  const openProjectDropdown = () => {
    return (
      projectOpen &&
      projects.filter((listedProject) =>
        listedProject.toLowerCase().includes(project.toLowerCase())
      ).length > 1
    );
  };

  return (
    <>
      <div
        className={`${loading ? "loader" : "hide"}`}
        style={{
          position: "absolute",
          left: "45%",
          top: "50%",
          zIndex: 9999,
        }}
      ></div>
      <Modal
        show={showPopup}
        onHide={() => {
          setPopupPart(defaultPart);
          setShowPopup(false);
        }}
        className={` ${loading ? "blur" : ""}`}
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
          <label className="Popup">Name: </label>
          <input
            type="text"
            autoFocus
            className="form-control Popup w-50 BlackTextBox relative left-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <br />

          <label className="Popup">Machine: </label>
          <Dropdown>
            <Dropdown.Toggle variant="primary" className="ManagePopupDropdown">
              {machine}
            </Dropdown.Toggle>

            <Dropdown.Menu className="ManagePopupDropdownMenu">
              <MachineDropdown
                setMachineFilter={setMachine}
                setStatus={setStatus}
              />
            </Dropdown.Menu>
          </Dropdown>

          <br />
          <label className="Popup">Project: </label>
          <input
            type="text"
            className="form-control Popup w-50 BlackTextBox relative left-4"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            onFocus={() => setProjectOpen(true)}
          />

          {openProjectDropdown() ? (
            <div className="form-control Popup w-50 BlackTextBox ProjectDropdown">
              {projects
                .filter((listedProject) =>
                  listedProject.toLowerCase().includes(project.toLowerCase())
                )
                .map((listedProject: string, id: number) => {
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        setProject(listedProject);
                        setProjectOpen(false);
                      }}
                      className="ProjectDDItem"
                    >
                      {listedProject}
                    </div>
                  );
                })}
            </div>
          ) : (
            <></>
          )}

          <br />
          <label className="Popup">Material: </label>
          <input
            type="text"
            className="form-control Popup w-50 BlackTextBox relative left-4"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
          <br />

          <div className={` ${status === 4 ? "" : "hidden"}`}>
            <label className="Popup">Endmill: </label>
            <input
              type="text"
              className="form-control Popup w-50 BlackTextBox relative left-4"
              value={endmill}
              onChange={(e) => setEndmill(e.target.value)}
            />
          </div>

          <div>
            <label className="Popup">Creator: </label>
            <input
              type="text"
              className="form-control Popup w-50 BlackTextBox relative left-4"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
            />
          </div>
          <label className="Popup">Due: </label>
          <input
            type="date"
            defaultValue={dueDate}
            className="form-control Popup w-50 BlackTextBox relative left-4"
            onChange={(e) => setDueDate(e.target.value)}
          />
          <br />

          <label className="Popup">Status: </label>
          <button
            className={`relative left-2 ${status <= 0 ? "opacity-0" : ""}`}
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
            value={Object.values(Status)[status < 0 ? 0 : status]}
            onChange={(e) => setStatus(Math.max(0, parseInt(e.target.value)))}
          />
          <button
            className={`relative left-2 ${status > 6 ? "opacity-0" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setStatus(++status);
            }}
          >
            &#62;
          </button>
          <br />
          <br className={` ${status > 1 ? "" : "hidden"}`} />

          <div className={` ${status === 1 ? "" : "hidden"}`}>
            <label className="Popup">Link: </label>
            <input
              type="text"
              className={`form-control Popup w-50 BlackTextBox relative left-4`}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <br />
            <br />
          </div>

          <div className={` ${status === 0 ? "" : "hidden"}`}>
            <label className="Popup">Assignee: </label>
            <input
              type="text"
              className="form-control Popup w-50 BlackTextBox relative left-4"
              value={asignee}
              onChange={(e) => setAsignee(e.target.value)}
            />
            <br />
            <br />
          </div>

          <div className="btn-group ">
            <label className="Popup">Remaining: </label>

            <input
              type="button"
              value="-"
              className="btn btn-danger"
              style={{ position: "relative", left: "3.25em" }}
              onClick={(e) => {
                e.preventDefault();
                const value = needed === "" ? 0 : parseInt(needed);
                setNeeded("" + Math.max(0, value - 1));
              }}
            />

            <input
              type="text"
              className="outline outline-1 w-20 text-center relative text-black BlackTextBox"
              value={needed}
              style={{ position: "relative", left: "3.75em" }}
              onChange={(e) => {
                e.preventDefault();
                setNeeded(e.target.value);
              }}
            />

            <input
              type="button"
              value="+"
              className="btn btn-success rounded-sm"
              style={{ position: "relative", left: "4.25em" }}
              onClick={(e) => {
                e.preventDefault();
                const value = needed === "" ? 0 : parseInt(needed);
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
              className="btn btn-danger"
              style={{ position: "relative", left: "3.25em" }}
              onClick={(e) => {
                e.preventDefault();
                const value = priority === "" ? 0 : parseInt(priority);
                setPriority(value + 1 + "");
              }}
            />

            <input
              type="text"
              className="outline outline-1 w-20 text-center relative text-black BlackTextBox"
              style={{ position: "relative", left: "3.75em" }}
              value={priority}
              onChange={(e) => {
                e.preventDefault();
                setPriority(e.target.value);
              }}
            />

            <input
              type="button"
              value="+"
              className="btn btn-success rounded-sm"
              style={{ position: "relative", left: "4.25em" }}
              onClick={(e) => {
                e.preventDefault();
                const value = priority === "" ? 0 : parseInt(priority);
                setPriority(value + 1 + "");
                setPriority("" + Math.max(1, value - 1));

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
          <br />
          <br />
          <div style={{ display: "flex" }}>
            <h2>
              {popupPart.createDate ? "Created " + popupPart.createDate : ""}
            </h2>
            <h2 style={{ position: "absolute", right: "2em" }}>
              {popupPart.partNumber ? "Part # " + popupPart.partNumber : ""}
            </h2>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-black">
          <Button
            variant="secondary"
            className="btn btn-danger absolute left-3"
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
              savePartAndClose();
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
