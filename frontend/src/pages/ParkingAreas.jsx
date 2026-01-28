import { Grid, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllParkingAreasApi, getNearbyParkingAreasApi } from "../common/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setBookingState } from "../redux/bookingSlice";
import { displayNotification } from "../redux/notificationSlice";
import AddParkingAreaDialog from "../components/AddParkingAreaDialog";
import UpdateParkingAreaDialog from "../components/UpdateParkingAreaDialog";
import DeleteParkingAreaDialog from "../components/DeleteParkingAreaDialog";
import { getLocation } from "../common/helpers";
import { generateGoogleMapsLink } from "../common/helpers";

export default function ParkingAreas() {

  const [parkingAreas, setParkingAreas] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.login);

  const { parkingArea } = useSelector((state) => state.booking);
  const selectedParkingArea = parkingArea;

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [nearby, setNearby] = React.useState(false);

  const fetchParkingAreas = useCallback(async () => {
    try{
      if (nearby) {
        const location = await getLocation();
        console.log(location);
        let radius = 1;
        const res = await getNearbyParkingAreasApi(radius, location.latitude, location.longitude);
        setParkingAreas(res);
      } else {
        const res = await getAllParkingAreasApi();
        setParkingAreas(res);
      }
    } catch (error) {
      dispatch(displayNotification({ message: String(error), type: "error" }));
    }
  }, [dispatch, nearby]);

  React.useEffect(() => {
    fetchParkingAreas();
  }, [fetchParkingAreas]);

  const handleUpdateClick = (parkingArea) => {
    dispatch(setBookingState({ parkingArea: parkingArea }));
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = (parkingArea) => {
    dispatch(setBookingState({ parkingArea: parkingArea }));
    setDeleteDialogOpen(true);
  };

  const handleExploreClick = (parkingArea) => {
    dispatch(setBookingState({ parkingArea: parkingArea }));
    navigate(`/pickSlot`);
  };

  return (
    <div>
      <h2>Parking Areas</h2>
      <Stack my={1} spacing={2} direction={'row'} justifyContent={'center'}>
        {loginState.user?.role == "admin" && (
          <Button onClick={() => { setAddDialogOpen(true); }} variant="contained">
            Add New
          </Button>
        )}
        <Button onClick={() => { setNearby(!nearby); }} variant="contained">
          {nearby ? "Show All" : "Show Nearby"}
        </Button>
      </Stack>
      <Grid container spacing={4}>
        {parkingAreas.map((parkingArea) => {
          return (
            <Grid item key={parkingArea._id}>
              <Card>
              <CardContent style={{padding:20}}>
                <Typography variant="h5" component="div" style={{marginBottom: '20px'}}>
                  {parkingArea.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {parkingArea.capacity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price per Hour: {parkingArea.pricePerHour}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <a href={generateGoogleMapsLink(parkingArea.lat, parkingArea.lng)} target="_blank" rel="noopener noreferrer">Location</a>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {parkingArea.address}
                </Typography>
                <Stack mt={2} spacing={2} direction={'row'} justifyContent={'center'}>
                    {loginState.user?.role == "admin" && (
                      <>
                        <Button variant="contained" onClick={() => { handleUpdateClick(parkingArea); }}>Update</Button>
                        <Button variant="contained" color="error" onClick={() => { handleDeleteClick(parkingArea); }}>Delete</Button>
                      </>
                    )}
                    {loginState.user?.role == "user" && (
                      <Button variant="contained" onClick={() => { handleExploreClick(parkingArea); }}>Explore</Button>
                    )}
                </Stack>
              </CardContent>
            </Card>
            </Grid>
          )
        })}
      </Grid>
      <AddParkingAreaDialog open={addDialogOpen} handleClose={() => { setAddDialogOpen(false); fetchParkingAreas(); }} />
      <UpdateParkingAreaDialog open={updateDialogOpen} handleClose={() => { setUpdateDialogOpen(false); fetchParkingAreas(); }} parkingArea={selectedParkingArea} />
      <DeleteParkingAreaDialog open={deleteDialogOpen} handleClose={() => { setDeleteDialogOpen(false); fetchParkingAreas(); }} parkingArea={selectedParkingArea} />
    </div>
  );
}