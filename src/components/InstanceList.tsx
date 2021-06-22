import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
} from "@material-ui/data-grid";
import { ExpandedInstance } from "../types";

const columns: GridColDef[] = [
  { field: "instanceId", headerName: "Instance ID", width: 200 },
  { field: "state", headerName: "State", width: 200 },
  {
    field: "location.name",
    headerName: "Location",
    width: 200,
    valueGetter: (params: GridValueGetterParams) => params.row.location.name,
  },
  {
    field: "instanceType.vCpus",
    headerName: "vCPUs",
    type: "number",
    width: 130,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.instanceType.vCpus,
  },
  {
    field: "instanceType.memory",
    headerName: "Memory",
    type: "number",
    width: 130,
    valueGetter: (params: GridValueGetterParams) => {
      const memory = params.row.instanceType.memory;
      if (!memory || typeof memory !== "number") {
        return "-";
      }
      return `${memory / 1024} GB`;
    },
  },
  {
    field: "instanceType.pricePerHour",
    headerName: "Price / Hour",
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `$${params.row.instanceType.pricePerHour}`,
  },
  {
    field: "dateCreated",
    headerName: "Launch Date",
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      params.value?.toLocaleString(),
  },
];

interface IProps {
  instances: ExpandedInstance[];
}

const InstanceList = ({ instances, ...props }: IProps) => {
  return <DataGrid rows={instances} columns={columns} {...props} />;
};

export default InstanceList;
