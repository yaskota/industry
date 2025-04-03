import express from 'express'
import employeemodel from '../models/employee.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import transporter from '../nodemail.js'


export const register=async(req,res)=>{
    const {empId,name,email,password,phno}=req.body;
    if(!name || !email || !password || !phno)
    {
        return res.status(401).send({message:"required data was missing"})
    }
    try {      
        const user =await employeemodel.findOne({email});
        if(user)
        {
            return res.status(400).send({message:"mail is alreay exist"});
        }

        const hashpassword=await bcrypt.hash(password,10);
        
        const newstudent={
            empId,
            name,email,
            password:hashpassword,
            phno
        }

        const User=new employeemodel(newstudent);
        await User.save();

        const token=jwt.sign({id:User._id},process.env.SECRET_KEY,{expiresIn:'7d'})

        res.cookie('token',token ,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge :7*24*60*60*1000
        })

        const verificationMail={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"welcome to JNTU sulthanpur",
            text:`Welcome to JNTU sulthanpur your account has been created by email id ${email}`
        }

        await transporter.sendMail(verificationMail);

        return res.status(201).send({message:"register succesfullly"})
        
    } catch (error) {
        console.error({message:"error occur in signup",error})
    }
    
    
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return res.status(505).send({message:"Data missing"});
    }
    try {
        
        const user=await employeemodel.findOne({email});
        if(!user)
        {
            return res.status(400).send({message:"email not exist"});
        }

        const check=await bcrypt.compare(password,user.password);
        if(!check)
        {
            return res.status(404).send({message:"password is incorrect"});
        }

        const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'7d'})

        res.cookie('token',token ,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge :7*24*60*60*1000
        })

        return res.status(200).send({message:"Login succesfully"});


    } catch (error) {
        console.error({message:"error in login_page",error});
        console.log("error in login page")
        return res.status(400).send({message:"error occur in login"})
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict'
        })

        return res.status(200).send({message:"logout succesfully"})
    } catch (error) {
        console.error({message:"error in login_page",error});
    }
}

export const otp_Send=async(req,res)=>{
    const {email}=req.body;
        
    const user=await employeemodel.findOne({email});
    console.log({user});
    if(!user)
    {
        return res.status(400).send({message:"User Not found"})
    }
    try {

        const otp=String(Math.floor(10000+Math.random()*90000))

        const email=user.email;

        user.otpsend=otp;
        user.otp_expiry_time=Date.now()+5*60*1000;

        await user.save();

        const otpEmail={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Account verification OTP",
            text:`your otp is ${otp} . verify your account using this OTP`
        }

        await transporter.sendMail(otpEmail);

        return res.status(200).send({message:"otp send to email succesfully"});

    } catch (error) {
        console.error(error.message)
        return res.status(404).send({message:"error at otp_send",error})
    }
}

export const resetpassword=async(req,res)=>{
    const{email,password,otp}=req.body

    if(!email || !otp || !password)
    {
        return res.status(404).send({message:"Data missing"})
    }
    try {
        
        const user=await employeemodel.findOne({email});
        if(!user)
        {
            return res.status(404).send({message:"user not found"})
        }
        console.log(user.email)
        if(user.otpsend==="" || user.otpsend!==otp)
        {
            console.log(user.otpsend);
            console.log(otp);
            return res.status(401).send({message:"otp incorrect"})
        }
        if(user.otp_expiry_time<Date.now())
        {
            return res.status(402).send({message:"otp expired"})
        }
        const hashpassword=await bcrypt.hash(password,10)

        user.password=hashpassword
        user.otpsend=""
        user.otp_expiry_time=0
        await user.save()
        return res.status(200).send({message:"password reset succesfully"});

    } catch (error) {
        return res.send(400).send({message:"error in passreset",error})
    }
}

export const userdetails=async(req,res)=>{
    const {USER_ID}=req.body;

    try {
        const user=await employeemodel.findById(USER_ID);
        return res.status(201).send(user);

    } catch (error) {
        return res.status(400).send({message:"error occur in send details"});
    }
}


