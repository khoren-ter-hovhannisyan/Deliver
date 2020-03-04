const { Router } = require('express')

const {
  createOrder,
  getAllActiveOrder,
  getCompanyOrders,
  delOrder,
  updateOrder,
} = require('../handlers/order.hendlers')

router = Router()

router.post('/create-order', createOrder)
router.get('/orders', getAllActiveOrder)
router.get('/orders/:id', getCompanyOrders)
router.delete('/orders/:id', delOrder)
router.put('/orders/:id', updateOrder)

module.exports = router
