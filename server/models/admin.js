import mongoose from 'mongoose'

const adminschema=mongoose.Schema({
    adminId:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    }
})

const adminmodel=mongoose.model('admin',adminschema);
export default adminmodel;