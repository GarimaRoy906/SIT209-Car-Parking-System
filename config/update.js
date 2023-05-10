import Booking from '../models/booking.js';

const updateBookingStatus = async (booking) => {
  if (booking.status !== 'Available' && new Date() > booking.endTime) {
    booking.status = 'Available';
    await booking.save();
  }
};

export default (io) => {
  io.on('connection', (socket) => {
    console.log('A client has connected!');
    const emitBookingStatusUpdates = async () => {
      const bookings = await Booking.find();
      bookings.forEach(updateBookingStatus);
      io.emit('bookingStatusUpdate', bookings);
    };

    const intervalId = setInterval(emitBookingStatusUpdates, 1000);

    socket.on('disconnect', () => {
      console.log('A client has disconnected!');
      clearInterval(intervalId);
    });
  });
};