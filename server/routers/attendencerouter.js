import express from 'express'
import { attend, intime, outTime } from '../controllers/attendencecontroll.js';

const attendencerouter=express.Router();

attendencerouter.post('/ingoing',intime);
attendencerouter.post('/outgoing',outTime);
attendencerouter.get('/attend',attend);

export default attendencerouter;

