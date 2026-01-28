import { useFormik } from "formik";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { createParkingAreaApi } from "../common/axiosClient";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { PropTypes } from "prop-types";

export default function AddParkingAreaDialog({open, handleClose}) {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      capacity: "",
      pricePerHour: "",
      lat: "",
      lng: "",
    },
    onSubmit: (values) => {
      console.log(values);
      createParkingAreaApi(values).then(() => {
        dispatch(displayNotification({message: "Parking Area Created Successfully", type: "success"}));
        handleClose();
      }).catch(err => {
        dispatch(displayNotification({message: String(err), type: "error"}));
      });
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Parking Area</DialogTitle>
        <DialogContent style={{justifyContent: 'center', marginInline: 20}}>
          <form onSubmit={formik.handleSubmit}>
            <TextField id="name" name="name" label="Name" variant="outlined" required onChange={formik.handleChange} value={formik.values.name} style={{marginTop: 10}} /><br />
            <TextField id="address" name="address" label="Address" variant="outlined" required onChange={formik.handleChange} value={formik.values.address} style={{marginTop: 10}} /><br />
            <TextField id="capacity" name="capacity" label="Capacity" variant="outlined" required type="number" inputProps={{ min: 5, step: 5 }} onChange={formik.handleChange} value={formik.values.capacity} style={{marginTop: 10}} /><br />
            <TextField id="pricePerHour" name="pricePerHour" label="Price Per Hour" variant="outlined" required type="number" inputProps={{ min: 300, step: 50 }} onChange={formik.handleChange} value={formik.values.pricePerHour} style={{marginTop: 10}} /><br />
            <TextField id="lat" name="lat" label="Latitude" variant="outlined" required type="number" onChange={formik.handleChange} value={formik.values.lat} style={{marginTop: 10}} /><br />
            <TextField id="lng" name="lng" label="Longitude" variant="outlined" required type="number" onChange={formik.handleChange} value={formik.values.lng} style={{marginTop: 10}} /><br />
            <DialogActions>
              <Button type="submit" variant="contained" style={{ marginTop: 10 }}>Create</Button>
            </DialogActions>
            </form>
        </DialogContent>
    </Dialog>
  );
}

AddParkingAreaDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};