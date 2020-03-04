const { Router } = require('express')

const {
  createOrder,
  getAllActiveOrder,
  getCompanyOrders,
  delOrder,
  updateOrder,
  getUserOrders,
} = require('../handlers/order.hendlers')

router = Router()

router.post('/create-order', createOrder)
router.get('/orders', getAllActiveOrder)
router.get('/company-orders/:id', getCompanyOrders)
router.get('/user-orders/:id', getUserOrders)
router.delete('/orders/:id', delOrder)
router.put('/orders/:id', updateOrder)

module.exports = router
