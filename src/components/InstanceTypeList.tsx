import * as React from "react";
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";
import { SerialisedInstanceType } from "../types";

const columns: ColDef[] = [
  { field: "name", headerName: "Instance Type", width: 200 },
  { field: "vCpus", headerName: "vCPUs", type: "number", width: 130 },
  { field: "cores", headerName: "Cores", type: "number", width: 130 },
  {
    field: "memory",
    headerName: "Memory",
    type: "number",
    width: 130,
    valueGetter: (params: ValueGetterParams) => {
      const memory = params.value;
      if (!memory) {
        return "-";
      }
      return `${memory / 1024} GB`;
    },
  },
  {
    field: "networkPerformance",
    headerName: "Network Performance",
    width: 160,
  },
  {
    field: "pricePerHour",
    headerName: "Price / Hour",
    width: 160,
    valueGetter: (params: ValueGetterParams) => `$${params.value}`,
  },
];

interface IProps {
  instances: SerialisedInstanceType[];
}

const InstanceTypeList = ({ instances, ...props }: IProps) => {
  return <DataGrid rows={instances} columns={columns} {...props} />;
};

export default InstanceTypeList;
