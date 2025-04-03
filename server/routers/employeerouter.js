import express from 'express'
import { attenddetails, login, logout, otp_Send, register, resetpassword, userdetails} from '../controllers/authemployee.js'
import userAuth from '../middleware/userauth.js'
import { validateLogin, validateSignup } from '../middleware/validate.js'

const employeerouter=express.Router()

employeerouter.post('/register',register)
employeerouter.post('/login',login)
employeerouter.post('/logout',logout)
employeerouter.post('/otpSend',otp_Send)
employeerouter.post('/resetPassword',resetpassword)
employeerouter.get('/userdetails',userAuth,  userdetails)
employeerouter.get('/attenddetails',userAuth,attenddetails)

export default employeerouter;

