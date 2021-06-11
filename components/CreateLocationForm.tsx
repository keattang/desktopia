import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { Vpc } from "@aws-sdk/client-ec2";
import { useEffect, useState } from "react";

interface ICreateLocationData {
  name: string;
  region: string;
  vpcId: string;
}

interface IProps {
  availableRegions: string[];
  onSubmit: (values: ICreateLocationData) => void;
  onFetchVpcs: (region: string) => Promise<Vpc[]>;
}

export default function CreateLocationForm({
  availableRegions,
  onFetchVpcs,
  onSubmit,
}: IProps) {
  const validationSchema = yup.object({
    name: yup.string(),
    region: yup
      .string()
      .required("This field is required.")
      .oneOf(availableRegions),
    vpcId: yup.string().required("This field is required."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      region: "",
      vpcId: "",
    },
    validationSchema: validationSchema,
    onSubmit,
  });

  const [availableVpcs, setAvailableVpcs] = useState<Vpc[]>([]);

  useEffect(() => {
    const fetchAvailableVpcs = async () => {
      const vpcs = await onFetchVpcs(formik.values.region);
      setAvailableVpcs(vpcs);
    };
    fetchAvailableVpcs();
  }, [formik.values.region]);

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
      </Box>
      <Button color="primary" variant="contained" fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
}
