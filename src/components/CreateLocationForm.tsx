import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { Subnet, Vpc } from "@aws-sdk/client-ec2";
import { useEffect, useState } from "react";
import alphabeticalSort from "../utilities/alphabeticalSort";
import { CreateLocationData } from "../types";

interface IProps {
  availableRegions: string[];
  onSubmit: (values: CreateLocationData) => void;
  onFetchVpcs: (region: string) => Promise<Vpc[]>;
  onFetchSubnets: (region: string, vpcId: string) => Promise<Subnet[]>;
}

export default function CreateLocationForm({
  availableRegions,
  onFetchVpcs,
  onSubmit,
  onFetchSubnets,
}: IProps) {
  const validationSchema = yup.object({
    name: yup.string(),
    region: yup
      .string()
      .required("This field is required.")
      .oneOf(availableRegions),
    vpcId: yup.string().required("This field is required."),
    subnetIds: yup
      .array()
      .of(yup.string())
      .min(1)
      .required("This field is required."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      region: "",
      vpcId: "",
      subnetIds: [],
    },
    validationSchema: validationSchema,
    onSubmit,
  });

  const [availableVpcs, setAvailableVpcs] = useState<Vpc[]>([]);

  useEffect(() => {
    // Can't use async function for useEffect so we have to use .then
    onFetchVpcs(formik.values.region).then((vpcs) => {
      setAvailableVpcs(vpcs);
    });
  }, [formik.values.region]);

  const [availableSubnets, setAvailableSubnets] = useState<Subnet[]>([]);

  useEffect(() => {
    // Can't use async function for useEffect so we have to use .then
    if (formik.values.vpcId) {
      onFetchSubnets(formik.values.region, formik.values.vpcId).then(
        (subnets) => {
          setAvailableSubnets(
            subnets.sort((a, b) =>
              alphabeticalSort(a.AvailabilityZone!, b.AvailabilityZone!)
            )
          );
        }
      );
    } else {
      setAvailableSubnets([]);
    }
  }, [formik.values.vpcId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column">
        <TextField
          id="name"
          name="name"
          margin="normal"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.name && formik.errors.name}
        ></TextField>
        <TextField
          id="region"
          name="region"
          margin="normal"
          select
          label="Region"
          value={formik.values.region}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.region && formik.errors.region}
        >
          {availableRegions.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="vpcId"
          name="vpcId"
          margin="normal"
          select
          label="VPC"
          value={formik.values.vpcId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.vpcId && formik.errors.vpcId}
        >
          {availableVpcs.map((vpc) => (
            <MenuItem key={vpc.VpcId} value={vpc.VpcId}>
              {vpc.VpcId}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="subnetIds"
          name="subnetIds"
          margin="normal"
          select
          SelectProps={{ multiple: true }}
          label="Subnets"
          value={formik.values.subnetIds}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.subnetIds && formik.errors.subnetIds}
        >
          {availableSubnets.map((subnet) => (
            <MenuItem key={subnet.SubnetId} value={subnet.SubnetId}>
              {`${subnet.SubnetId} (${subnet.AvailabilityZone} - ${
                subnet.MapPublicIpOnLaunch ? "public" : "private"
              })`}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Button color="primary" variant="contained" fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
}
