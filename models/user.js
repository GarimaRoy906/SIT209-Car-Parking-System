import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  photo: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password: {type: String, required: true},
  date: {type: Date, default: Date.now},
  bookings: [
    {
      paymentId: { type: String },
      slotId: { type: String, required: true ,enum: ['1', '2', '3', '4', '5', '6']  },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true},
      amount: { type: Number, required: true },
      status: { type: String, enum: ["Booked", "Pending", "Expired", "Cancelled"], default: "Pending" }
    }
  ]
},{ timestamps: true });

// Use `bcrypt.hash()` to generate a secure hash of the password
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt((error, salt) => {
    if (error) {
      return next(error);
    }
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  });
});

// Use `bcrypt.compare()` to securely compare passwords
userSchema.methods.comparePassword = function(password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);

export default User;