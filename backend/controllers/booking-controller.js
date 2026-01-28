const Booking = require('../models/booking-model');
const ParkingArea = require('../models/parking-area-model');
const User = require('../models/user-model');
const { getHoursBetween } = require('../utils');

const getAllBookings = async (req, res) => {
  try {
    let bookings = await Booking.find();
    //filter bookings that are not in the past
    bookings = bookings.filter((booking) => booking.endTime > new Date());
    // filter by user if user is accessing the endpoint
    if(req.user.role === 'user') {
      bookings = bookings.filter((booking) => booking.userId === req.user._id);
    }
    // Convert the records
    const convertedRecords = await Promise.all(bookings.map(async (record) => {
      let parkingArea = await ParkingArea.findById(record.parkingAreaId);
      let user = await User.findById(record.userId).select('-password');
      return {
        ...record.toObject(),
        startTime: record.startTime.toISOString(),
        endTime: record.endTime.toISOString(),
        parkingArea: parkingArea,
        user: user,
      };
    }));
    res.json(convertedRecords);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookings = async (req, res) => {
  if (!req.params.parkingAreaId  || !req.params.startTime || !req.params.endTime) {
    return res.status(400).json({ error: 'Missing required fields: parkingAreaId, startTime, endTime' });
  }
  const { parkingAreaId, startTime, endTime } = req.params;
  // Query to check for conflicts
  const query = {
    parkingAreaId,
    $or: [
      {
        startTime: { $lt: startTime },
        endTime: { $gt: startTime },
      },
      {
        startTime: { $lt: endTime },
        endTime: { $gt: endTime },
      },
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime },
      },
    ],
  };
  try {
    const bookings = await Booking.find(query);
    // Convert the date fields in the records
    const convertedRecords = bookings.map((record) => {
      return {
        ...record.toObject(),
        startTime: record.startTime.toISOString(),
        endTime: record.endTime.toISOString(),
      };
    });
    res.json(convertedRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkoutBooking = async (req, res) => {
  if (!req.body.parkingAreaId || !req.body.slot || !req.body.startTime || !req.body.endTime) {
    return res.status(400).json({ error: 'Missing required fields: parkingAreaId, slot, startTime, endTime' });
  }
  const { parkingAreaId, slot, startTime, endTime } = req.body;
  const userId = req.user._id;
  try {
    //check if slot is available
    // Query to check for conflicts
    const query = {
      parkingAreaId,
      slot,
      $or: [
        {
          startTime: { $lt: startTime },
          endTime: { $gt: startTime },
        },
        {
          startTime: { $lt: endTime },
          endTime: { $gt: endTime },
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime },
        },
      ],
    };
    const bookings = await Booking.find(query);
    if (bookings.length > 0) {
      return res.status(400).json({ error: 'Slot is not available' });
    }

    // Create booking directly
    const booking = new Booking({ parkingAreaId, slot, startTime, endTime, userId });
    await booking.save();

    res.json({ message: 'Booking created successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookings,
  checkoutBooking,
};
