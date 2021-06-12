import * as React from "react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "region", headerName: "Region", width: 130 },
  { field: "vpcId", headerName: "VPC", width: 130 },
];

interface IProps {
  locations: object[];
}

const LocationList = ({ locations, ...props }: IProps) => {
  return <DataGrid rows={locations} columns={columns} {...props} />;
};

export default LocationList;
