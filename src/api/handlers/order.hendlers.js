const Company = require("../models/company.model");
const Users = require("../models/users.model");
const Order = require('../models/order.model');
const mongoose = require('mongoose')


exports.createOrder =  (req, res) => {
    const {companyId, order} = req.body;
    
        const newOrder = new Order({
            ...order,
            companyId,
        });
        console.log(newOrder);
        
        newOrder.save((err, newOrder)=>{
            if(err){
                return res.status(404).send({
                    message: "Something went wrong, try again in a few minutes",
                    err
                });
            }
            return res.status(201).send({msg:"msg"})
            
            
        });
        
        
};