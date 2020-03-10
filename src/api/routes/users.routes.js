const { Router } = require('express')

const {
  createUser,
  getAllUsers,
  getUserById,
  delUser,
  updateUser,
} = require('../handlers/users.handlers')
const checkAuth = require('../middleware/check-auth.middleware')

const router = Router()

router.get('/users', checkAuth, getAllUsers)
router.get('/users/:id', checkAuth, getUserById)
router.post('/user', checkAuth, createUser)
router.delete('/users/:id', checkAuth, delUser)
router.put('/users/:id', checkAuth, updateUser)

module.exports = router
