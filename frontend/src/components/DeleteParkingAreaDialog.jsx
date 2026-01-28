import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { deleteParkingAreaApi } from "../common/axiosClient";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";

export default function Wrapper({ parkingArea, open, handleClose }) {
  if (!parkingArea) {
    return (<Dialog open={open} onClose={handleClose}>
      <DialogTitle>Parking Area Not Selected</DialogTitle>
    </Dialog>
    );
  } else {
    return (<DeleteParkingAreaDialog parkingArea={parkingArea} open={open} handleClose={handleClose} />);
  }
}

Wrapper.propTypes = {
  parkingArea: PropTypes.object,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function DeleteParkingAreaDialog({parkingArea, open, handleClose}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDelete = () => {
    deleteParkingAreaApi(parkingArea._id).then(() => {
      dispatch(displayNotification({ message: "Delete Successful.", type: "success" }));
      navigate('/parkingAreas');
    }).catch(err => {
      dispatch(displayNotification({ message: String(err), type: "error" }));
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Parking Area</DialogTitle>
      <DialogContent style={{justifyContent: 'center', marginInline: 20}}>
        <DialogContentText>
          Are you sure you want to delete this parking area: {parkingArea.name}?
        </DialogContentText>
        <DialogActions>
          <Button variant="contained" color="error" onClick={onDelete} style={{marginTop: 10}}>Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

DeleteParkingAreaDialog.propTypes = {
  parkingArea: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
