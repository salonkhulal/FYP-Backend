import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './database/index.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import passport from 'passport';
import './services/passportjs/localStrategy.js';
import './services/passportjs/googleStrategy.js';
import { authMiddleware } from './middleware/index.js';
import cookieParser from "cookie-parser";
import path from 'path';
import runSocket from './services/socket/index.js';
import { connectedUsers } from './services/socket/index.js';


dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Connect to MongoDB
connectDB(MONGO_URI);

const app = express();
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./app/uploads")));
app.use(passport.initialize());
app.use(authMiddleware("token"));

app.use('/api/auth',userRoutes);
app.get("/getLogedInUsers",(req,res)=>{
 return res.status(200).json({ users: Array.from(connectedUsers) });
})


const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

runSocket(server);