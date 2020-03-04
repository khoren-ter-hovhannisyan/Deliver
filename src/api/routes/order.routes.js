const { Router } = require('express')

const {
  createOrder,
  getAllActiveOrder,
  getCompanyOrders,
  delOrder
} = require('../handlers/order.hendlers')

router = Router()

router.post('/create-order', createOrder)
router.get('/orders', getAllActiveOrder)
router.get('/company-orders/:id', getCompanyOrders)
router.delete("companies/:id", delOrder)

module.exports = router
