import mongoose from 'mongoose';

const attendenceschema=mongoose.Schema({
    empId:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    OutTime:{
       
        type: Date, 
    },
    InTime:{
        type: Date, 
        default: Date.now
    },
    hours:{
        type:Number,
        default:0
    },
    payment:{
        type:Number,
        default:0
    },
    out:{
        type:Boolean,
        default:true
    },
    active:{
        type:Boolean,
        default:true
    }

},{ timestamps: true })

const attendencemodel=mongoose.model('attemdence',attendenceschema);

export default attendencemodel