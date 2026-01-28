import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { TextField, Button, Grid, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { displayNotification } from "../redux/notificationSlice";
import { setBookingState } from "../redux/bookingSlice";
import { getBookingsApi } from "../common/axiosClient";
import { useNavigate } from "react-router-dom";
import { generateGoogleMapsLink } from "../common/helpers";

export default function PickSlot() {
  const booking = useSelector((state) => state.booking);
  const [showSlots, setShowSlots] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      startTime: '',
      endTime: '',
    },
    onSubmit: (values) => {
      // Create Date objects for today with the selected times
      const today = new Date();
      const [startHours, startMinutes] = values.startTime.split(':');
      const [endHours, endMinutes] = values.endTime.split(':');
      
      const startDateTime = new Date(today);
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);
      
      const endDateTime = new Date(today);
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

      // Check if times are valid
      if (startDateTime >= endDateTime) {
        alert("Start time must be before end time");
        setShowSlots(false);
        return;
      }

      setShowSlots(true);
      dispatch(setBookingState({ startTime: startDateTime, endTime: endDateTime }));
    },
  });

  return (
    <div>
      <h2>Pick Slot</h2>
      {
        !booking.parkingArea
          ? <h3>Please select a parking area first</h3>
          : <Grid container style={{justifyContent: 'space-evenly'}}>
            <Grid item>
              <h3>{booking.parkingArea.name}</h3>
              <h5>Capacity: {booking.parkingArea.capacity}</h5>
              <h5>Price per Hour: {booking.parkingArea.pricePerHour}</h5>
              <h5>Address: {booking.parkingArea.address}</h5>
              <h5><a href={generateGoogleMapsLink(booking.parkingArea.lat, booking.parkingArea.lng)} target="_blank" rel="noopener noreferrer">Location</a></h5>
            </Grid>
            <Grid item>
              <h3>Select Time</h3>
              <form onSubmit={formik.handleSubmit}>
                <TextField 
                  id="startTime" 
                  name="startTime" 
                  label="From" 
                  type="time" 
                  required 
                  style={{ marginBlock: 5 }} 
                  InputLabelProps={{ shrink: true }}
                  onChange={formik.handleChange} 
                  value={formik.values.startTime}
                />
                <br />
                <TextField 
                  id="endTime" 
                  name="endTime" 
                  label="To"
                  type="time" 
                  required 
                  style={{ marginBlock: 5 }} 
                  InputLabelProps={{ shrink: true }}
                  onChange={formik.handleChange} 
                  value={formik.values.endTime}
                />
                <br />
                <Button type="submit" variant="contained" style={{ marginBlock: 5 }}>Check</Button>
              </form>
            </Grid>
          </Grid>
      }
      {
        showSlots
          ? <Slots />
          : null
      }
    </div>
  );
}

const Slots = () => {
  const {parkingArea, startTime, endTime} = useSelector((state) => state.booking);
  const [slots, setSlots] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const discoverSlots = async () => {
      try {
        const bookings = await getBookingsApi(parkingArea._id, startTime, endTime);
        const bookedSlots = bookings.map((booking) => booking.slot);

        let slots = Array.from({ length: parkingArea.capacity }, (_, i) => {
          return {
            slotNumber: i + 1,
            booked: bookedSlots.includes(i + 1),
          }
        });
        setSlots(slots);

      } catch (err) {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      }
    };
    if(parkingArea && startTime && endTime)
      discoverSlots();
  }, [dispatch, parkingArea, startTime, endTime]);

  const handleSlotClick = (slotNumber) => {
    dispatch(setBookingState({ slot: slotNumber }));
    navigate("/bookSlot");
  }

  return (
    <div>
      <h2>Slots</h2>
      <Grid container spacing={4}>
        {slots.map((slot) => (
          <Grid item key={slot.slotNumber}>
            <Card
              style={{ color: "white", backgroundColor: slot.booked ? "red" : "green", cursor: slot.booked ? "default" : "pointer" }}
              onClick={() => !slot.booked && handleSlotClick(slot.slotNumber)} 
            >
              <CardContent style={{ padding: 20 }}>
                <Typography variant="h5" component="div">
                  {slot.slotNumber}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {slot.booked ? "Booked" : "Available"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}