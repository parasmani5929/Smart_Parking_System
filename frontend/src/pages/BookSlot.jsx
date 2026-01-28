import React from "react";
import { Button, Paper, TableContainer, Table, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { bookSlotApi } from "../common/axiosClient";
import { generateGoogleMapsLink } from "../common/helpers";
import { useNavigate } from "react-router-dom";

export default function BookSlot() {
  const { parkingArea, startTime, endTime, slot } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const formatTime = (date) => {
    if (!date) return '';
    // If date is already a Date object, use it directly
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onBookSlotClick = async () => {
    try {
      // Ensure we're sending proper Date objects to the backend
      const bookingData = {
        parkingAreaId: parkingArea._id,
        startTime: startTime instanceof Date ? startTime : new Date(startTime),
        endTime: endTime instanceof Date ? endTime : new Date(endTime),
        slot
      };
      
      await bookSlotApi(bookingData);
      dispatch(displayNotification({ 
        message: "Parking slot booked successfully!", 
        type: "success" 
      }));
      setShowConfirmation(true);
    } catch (error) {
      dispatch(displayNotification({ message: error, type: "error" }));
    }
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate('/bookings'); // Redirect to bookings page
  };

  return (
    <div>
      <h3>Book Parking Slot</h3>
      {
        !parkingArea || !startTime || !endTime || !slot
          ? <h3>Please select a parking area, time and slot first</h3>
          : <div>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Parking Area</TableCell>
                    <TableCell>{parkingArea.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell><a href={generateGoogleMapsLink(parkingArea.lat, parkingArea.lng)} target="_blank" rel="noopener noreferrer">Location</a></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>{formatTime(startTime)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>To</TableCell>
                    <TableCell>{formatTime(endTime)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Slot</TableCell>
                    <TableCell>{slot}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button 
              variant="contained" 
              color="primary" 
              style={{ margin: 10 }}
              onClick={onBookSlotClick}
            >
              Book Slot
            </Button>
          </div>
      }

      <Dialog open={showConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Booking Confirmed!</DialogTitle>
        <DialogContent>
          Your parking slot has been successfully booked. You can view your booking details in the Bookings section.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            View Bookings
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}