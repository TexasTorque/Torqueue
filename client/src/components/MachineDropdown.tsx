import Dropdown from "react-bootstrap/Dropdown";
import { machineList } from "../machines.js";
import { useEffect, useState } from "react";
type Props = {
  setMachineFilter: (machineName: string) => void;
};

export default function PartRow({ setMachineFilter }: Props): JSX.Element {
  const [machines, setMachines] = useState<string[]>([]);

  useEffect(() => {
    setMachines(machineList[0]);
  }, []);

  return (
    <>
      {machines.map((machineName: string, id: number) => {
        return (
          <Dropdown.Item key={id} onClick={() => setMachineFilter(machineName)}>
            {machineName}
          </Dropdown.Item>
        );
      })}
    </>
  );
}
