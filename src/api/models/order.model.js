const { Schema, model } = require("mongoose");



const orderSchema = new Schema({
    points:{
        type:Number,
        required:true
    },
    take_address:{
        type:String,
        required:true
    },
    deliver_address:{
        type:String,
        required:true
    },
    item_description:{
        type:String,
        required:true
    },
    order_create_time:{
        type:Date,
        required:true
    },
    order_start_time:{
        type:Date,
        required:true
    },
    order_end_time:{
        type:Date,
        required:true
    },
    comment:{
        type:String,
    },
    state:{
        type:String,
        required:true
    },
});


module.exports = model("Order", orderSchema);