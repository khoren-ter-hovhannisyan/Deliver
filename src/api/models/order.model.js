const { Schema, model } = require("mongoose");



const orderSchema = new Schema({
    points:{
        type:Number,
        required:true
    },
    take_address:{
        type:String,
    },
    deliver_address:{
        type:String,
    },
    item_description:{
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
        type:String,
        required:true
    },
    companyId:{
        type:String
    },
    userId:{
        type:String
    }

});


module.exports = model("Order", orderSchema);