const { Schema, model } = require("mongoose");



const orderSchema = new Schema({
    points:{
        type:String,
        required:true
    },
    take_address:{
        type:String,
    },
    deliver_address:{
        type:String,
    },
    order_description:{
        type:String,
    },
    order_create_time:{
        type:Date,
        default:Date.now,
        required:true
    },
    order_start_time:{
        type:Date,
    },
    order_end_time:{
        type:Date,
    },
    comment:{
        type:String,
    },
    state:{
        type: String,
        default: "active",
    },
    companyId:{
        type:String
    },
    userId:{
        type:String
    }

});


module.exports = model("Order", orderSchema);