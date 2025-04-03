import express from 'express'
import { login, logout, send } from '../controllers/admincontroller.js';


const adminrouter=express.Router();

adminrouter.post('/send',send);
adminrouter.post('/login',login);
adminrouter.post('/logout',logout);

export default adminrouter;