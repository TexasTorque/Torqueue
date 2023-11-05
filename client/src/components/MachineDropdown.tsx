import Dropdown from "react-bootstrap/Dropdown";
import { machineList } from "../machines.js";
import { useEffect, useState } from "react";
type Props = {
  setMachineFilter: (machineName: string) => void;
  setStatus: (status: number) => void;
};

export default function PartRow({ setMachineFilter, setStatus }: Props): JSX.Element {
  const [machines, setMachines] = useState<string[]>([]);

  useEffect(() => {
    setMachines(machineList[0]);
  }, []);

  return (
    <>
      {machines.map((machineName: string, id: number) => {
        return (
          <Dropdown.Item
            key={id}
            onClick={() => {
              setMachineFilter(machineName);
              if (machineName === "3D Printer" && setStatus) setStatus(0);
            }}
          >
            {machineName}
          </Dropdown.Item>
        );
      })}
    </>
  );
}
