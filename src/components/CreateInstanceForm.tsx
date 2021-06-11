import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { InstanceType, Location } from ".prisma/client";

interface ICreateInstanceData {
  locationId: string;
  instanceTypeId: string;
}

interface IProps {
  availableLocations: Location[];
  availableInstanceTypes: InstanceType[];
  onSubmit: (values: ICreateInstanceData) => void;
}

const CreateInstanceForm = ({
  availableLocations,
  availableInstanceTypes,
  onSubmit,
}: IProps) => {
  const validationSchema = yup.object({
    locationId: yup.string().required("This field is required."),
    instanceType: yup.string().required("This field is required."),
  });

  const formik = useFormik({
    initialValues: {
      locationId: "",
      instanceTypeId: "",
    },
    validationSchema: validationSchema,
    onSubmit,
  });

  const selectedLocation = availableLocations.find(
    (l) => l.id === formik.values.locationId
  );

  const filteredInstanceTypes = selectedLocation
    ? availableInstanceTypes.filter((i) => i.region === selectedLocation.region)
    : availableInstanceTypes;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column">
        <TextField
          id="locationId"
          name="locationId"
          margin="normal"
          select
          label="Location"
          value={formik.values.locationId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.locationId && formik.errors.locationId}
        >
          {availableLocations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              {location.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="instanceTypeId"
          name="instanceTypeId"
          margin="normal"
          select
          label="Instance Type"
          value={formik.values.instanceTypeId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={
            formik.touched.instanceTypeId && formik.errors.instanceTypeId
          }
        >
          {filteredInstanceTypes.map((instanceType) => (
            <MenuItem key={instanceType.id} value={instanceType.id}>
              {instanceType.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Button color="primary" variant="contained" fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
};

export default CreateInstanceForm;
