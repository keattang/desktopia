import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridCellParams,
} from "@material-ui/data-grid";
import {
  ExpandedInstance,
  HandleRequestPassword,
  HandleTerminateInstance,
} from "../types";
import HiddenPassword from "./HiddenPassword";
import Button from "@material-ui/core/Button";
import { TERMINATABLE_STATES } from "../constants";

const getColumns = (
  onRequestPassword: HandleRequestPassword,
  onTerminateInstance: HandleTerminateInstance
): GridColDef[] => [
  { field: "instanceId", headerName: "Instance ID", width: 200 },
  { field: "state", headerName: "State", width: 150 },
  {
    field: "location.name",
    headerName: "Location",
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.location.name,
  },
  {
    field: "instanceType.vCpus",
    headerName: "vCPUs",
    type: "number",
    width: 120,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.instanceType.vCpus,
  },
  {
    field: "instanceType.memory",
    headerName: "Memory",
    type: "number",
    width: 130,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.instanceType.memory,
    valueFormatter: (params: GridValueFormatterParams) => {
      const memory = params.value;
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
      params.row.instanceType.pricePerHour,
    valueFormatter: (params: GridValueFormatterParams) => `$${params.value}`,
  },
  {
    field: "dateCreated",
    headerName: "Launch Date",
    width: 160,
    valueFormatter: (params: GridValueFormatterParams) =>
      params.value?.toLocaleString(),
  },
  {
    field: "password",
    headerName: "Password",
    width: 160,
    renderCell: (params: GridCellParams) =>
      params.value ? (
        <HiddenPassword
          onRequestPassword={() => onRequestPassword(params.row.id)}
        />
      ) : (
        "Not yet available."
      ),
  },
  {
    field: "publicDnsName",
    headerName: "Connection File",
    width: 180,
    renderCell: (params: GridCellParams) =>
      params.value ? (
        <Button href={`/api/instances/${params.row.id}/connection-file`}>
          Download
        </Button>
      ) : (
        "Not yet available."
      ),
  },
  {
    field: "terminate",
    headerName: "Terminate",
    width: 180,
    valueGetter: (params: GridValueGetterParams) => params.row.state,
    renderCell: (params: GridCellParams) => {
      const enabled =
        params.value &&
        typeof params.value === "string" && // Required for typescript
        TERMINATABLE_STATES.includes(params.value);
      return (
        <Button
          onClick={() => onTerminateInstance(params.row.id)}
          disabled={!enabled}
        >
          Terminate
        </Button>
      );
    },
  },
];

interface IProps {
  instances: ExpandedInstance[];
  onRequestPassword: HandleRequestPassword;
  onTerminateInstance: HandleTerminateInstance;
}

const InstanceList = ({
  instances,
  onRequestPassword,
  onTerminateInstance,
  ...props
}: IProps) => {
  const columns = getColumns(onRequestPassword, onTerminateInstance);
  return <DataGrid rows={instances} columns={columns} {...props} />;
};

export default InstanceList;
