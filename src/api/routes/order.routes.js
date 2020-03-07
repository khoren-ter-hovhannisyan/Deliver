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

router.post('/orders', createOrder)
router.delete('/orders/:id', delOrder)
router.put('/orders/:id', updateOrder)
router.get('/active-orders', getAllActiveOrder)
router.get('/company-orders/:id', getCompanyOrders)
router.get('/user-orders/:id', getUserOrders)

module.exports = router
