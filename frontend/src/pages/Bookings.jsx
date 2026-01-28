import React from "react"
import { Button, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { getAllBookingsApi } from "../common/axiosClient";

export default function Bookings() {
  const [bookings, setBookings] = React.useState([]);

  const dispatch = useDispatch();

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid Date';
      }
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const fetchBookings = React.useCallback(async () => {
    try {
      const response = await getAllBookingsApi();
      console.log('Fetched bookings:', response); // Debug log
      // Sort by start time in descending order (newest first)
      response.sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return dateB - dateA;
      });
      setBookings(response);
    } catch (error) {
      dispatch(displayNotification({ message: error, type: "error" }));
    }
  }, [dispatch]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div>
      <h3>Bookings</h3>
      <div style={{ margin: 10 }}>
        <Button variant="contained" color="primary" onClick={fetchBookings}> Refresh </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{fontWeight: 'bold'}}>Parking Area</TableCell>
              <TableCell style={{fontWeight: 'bold'}}>User</TableCell>
              <TableCell style={{fontWeight: 'bold'}}>Slot</TableCell>
              <TableCell style={{fontWeight: 'bold'}}>From</TableCell>
              <TableCell style={{fontWeight: 'bold'}}>To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              bookings.map(booking =>
                <TableRow key={booking._id}>
                  <TableCell>{booking.parkingArea.name}</TableCell>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>{booking.slot}</TableCell>
                  <TableCell>{formatDateTime(booking.startTime)}</TableCell>
                  <TableCell>{formatDateTime(booking.endTime)}</TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

