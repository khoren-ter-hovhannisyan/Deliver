const { Router } = require('express')

const { createOrder, getAllActiveOrder } = require('../handlers/order.hendlers')

router = Router()

router.post('/create-order', createOrder)
router.get('/orders', getAllActiveOrder)

module.exports = router
