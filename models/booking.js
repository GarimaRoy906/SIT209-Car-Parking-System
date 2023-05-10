import mongoose from 'mongoose';
const Types = mongoose.Schema.Types;
const bookingSchema = new mongoose.Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  carId: { type: String, required: true, unique: true },
  slotId: { type: String, required: true ,enum: ['1', '2', '3', '4', '5', '6']  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true},
  status: { type: String, enum: ["Booked","Available"], default: "Available" }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking