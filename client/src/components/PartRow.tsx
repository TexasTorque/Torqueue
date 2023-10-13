import { Button } from "react-bootstrap";
import { Part, Status } from "../Interfaces";
import axios from "axios";

type Props = {
  part: Part;
  BACKEND_URL: string;
  setPopupPart: (part: Part) => void;
  setShowPopup: (show: boolean) => void;
  setHotPart: (part: Part) => void;
};

export default function PartRow({
  part,
  setPopupPart,
  setHotPart,
  setShowPopup,
  BACKEND_URL,
}: Props): JSX.Element {
  const manage = (e: any) => {
    e.preventDefault();
    setPopupPart(part);
    setShowPopup(true);
  };

  const download = async (e: any) => {
    e.preventDefault();
    if (part.files.camExt === "") {
      alert("No GCODE Found");
      return;
    }

    let params = {
      fileId: part.id,
      fileExt: "cam",
      name: `${part.name}-GCODE`,
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
      link.setAttribute("download", `${part.name}-GCODE.${part.files.camExt}`);
      document.body.appendChild(link);
      link.click();
    });
  };

  const complete = (e: any) => {
    e.preventDefault();
    if (parseInt(part.needed) > 0) part.needed = parseInt(part.needed) - 1 + "";

    if (parseInt(part.needed) === 0)
      part.status = Object.keys(Status).indexOf("COMPLETE");

    setHotPart(part);
  };

  const getDateString = (date: string) => {
    return (
      (new Date(date).getMonth() > 8
        ? new Date(date).getMonth() + 1
        : "0" + (new Date(date).getMonth() + 1)) +
      "/" +
      (new Date(date).getDate() > 9
        ? new Date(date).getDate() + 1
        : "0" + (new Date(date).getDate() + 1)) +
      "/" +
      new Date(date).getFullYear()
    );
  };

  return (
    <tr style={{ verticalAlign: "middle" }}>
      <td align="center">{part.priority}</td>
      <td align="center">
        {part.dueDate === undefined || part.dueDate.length === 0
          ? "N/A"
          : getDateString(part.dueDate)}
      </td>
      <td align="center">{part.name}</td>
      <td align="center">{part.project === "" ? "N/A" : part.project}</td>
      <td align="center">{part.machine === "" ? "Any" : part.machine}</td>
      <td align="center">{part.material === "" ? "N/A" : part.material}</td>
      <td align="center">
        {part.endmill === undefined || part.endmill.length === 0
          ? "N/A"
          : part.endmill}
      </td>
      <td align="center">
        {Object.values(Status)[part.status < 0 ? 0 : part.status]}
      </td>
      <td align="center">{part.needed}</td>
      <td align="center">
        <Button onClick={(e) => complete(e)} className="btn btn-success flex">
          ✓
        </Button>
      </td>
      <td align="center">
        <button
          className="btn btn-primary my-2"
          data-toggle="tooltip"
          data-placement="top"
          title={`${part.files.camSize}`}
          onClick={(e) => download(e)}
        >
          ↓
        </button>
      </td>
      <td align="center">
        <button className="btn btn-primary my-2" onClick={(e) => manage(e)}>
          ⚙︎
        </button>
      </td>
    </tr>
  );
}
