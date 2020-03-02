const Company = require("../models/company.model");
const Users = require("../models/users.model");
const Order = require('../models/order.model');
const mongoose = require('mongoose')


exports.createOrder =  (req, res) => {
    const {companyId:_id, order} = req.body;
    
        const newOrder = new Order({
            ...order,
            companyId:_id,
            state:"active"
        });
        console.log(newOrder);
        
        newOrder.save((err, newOrder)=>{
            if(err){
                return res.status(404).send({
                    message: "Something went wrong, try again in a few minutes",
                    err
                });
            }
            Company.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(_id)}},
                {$lookup:{
                    from:"orders",
                    localField:`${newOrder._id}`,
                    foreignField:`${_id}`,
                    as:"orders"
            }
            }]).exec((err, orders)=>{
                if(err){
                    console.log(err);
                    
                    return res.status(404).send({
                        massage: "Something went wrong, try again in a few minutes",
                        err
                    });
                }
                console.log(orders);
                console.log(orders[0].orders);
                
                
                return res.status(201).json({
                    message: "Order created"
                  });
            });
            
            
        });
        
        
};