const { Router } = require('express')

const {
  createOrder,
  getAllActiveOrder,
  getCompanyOrders,
  delOrder,
  updateOrder,
  getUserOrders,
} = require('../handlers/order.hendlers')
const checkAuth = require('../middleware/checkAuth.middleware')

router = Router()

router.post('/orders', checkAuth, createOrder)
router.delete('/orders/:id', checkAuth, delOrder)
router.put('/orders/:id', checkAuth, updateOrder)
router.get('/active-orders', checkAuth, getAllActiveOrder)
router.get('/company-orders/:id', checkAuth, getCompanyOrders)
router.get('/user-orders/:id', checkAuth, getUserOrders)

module.exports = router
