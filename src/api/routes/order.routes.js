const { Router } = require('express')

const {
  createOrder,
  getAllActiveOrder,
  getCompanyOrders,
} = require('../handlers/order.hendlers')

router = Router()

router.post('/create-order', createOrder)
router.get('/orders', getAllActiveOrder)
router.get('/company-orders/:id', getCompanyOrders)

module.exports = router
