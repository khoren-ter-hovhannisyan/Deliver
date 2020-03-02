const { Router } = require("express");

const { createOrder } = require('../handlers/order.hendlers');

router = Router();

router.post("/create-order", createOrder)

module.exports = router;