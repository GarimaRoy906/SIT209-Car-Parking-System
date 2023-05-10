import express from 'express'
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv'
dotenv.config()
import { Server as SocketIO } from 'socket.io';
import passport from './config/passport.js';
import authRoutes from'./routes/auth.js';
import userRoutes from'./routes/user.js';
import adminRoutes from'./routes/admin.js';
import { getIndex } from './controllers/sensorController.js';
import db from './config/database.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

app.set('io', io);
app.set('view engine', 'ejs');

// Set up middleware
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up static file serving
app.use(express.static(new URL('./public', import.meta.url).pathname));
app.use(express.static(new URL('./public/uploads', import.meta.url).pathname));

// Set up routes
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/slot-status', getIndex(io));

// Database Connection
db.on('open', () => {
  console.log('Database connected');
});

// Port connection
const PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});