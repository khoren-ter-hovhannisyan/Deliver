const Company = require("../models/company.model");
const Users = require("../models/users.model");
const Order = require('../models/order.model');


exports.createOrder = async (req, res) => {
    const {companyId:_id, order} = req.body;
    try{
        const newOrder = new Order({
            ...order,
            order_create_time:Date.now,
            state:"active"
        });
        await newOrder.save((err, newOrder)=>{
            if(err){
                return res.status(404).send({
                    message: "Something went wrong, try again in a few minutes",
                    err
                });
            }
            Company.aggregate([{
                $lookup:{
                    from:"Order",
                    localField:newOrder._id,
                    foreignField:_id,
                    as:"orders"
            }
            }]).exec((err, orders)=>{
                if(err){
                    return res.status(404).send({
                        massage: "Something went wrong, try again in a few minutes",
                        err
                    });
                }
            });
            return res.status(201).json({
                message: "Order created"
              });
        });
    }catch (err){
        res.status(404).send({
            massage: "Something went wrong, try again in a few minutes",
            err
        });
    }
};