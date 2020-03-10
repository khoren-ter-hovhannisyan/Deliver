const { Router } = require('express')

const {
  createUser,
  getAllUsers,
  getUserById,
  delUser,
  updateUser,
} = require('../handlers/users.handlers')
const checkAuth = require('../middleware/checkAuth.middleware')

const router = Router()

router.get('/users', checkAuth, getAllUsers)
router.get('/users/:id', checkAuth, getUserById)
router.post('/user', createUser)
router.delete('/users/:id', checkAuth, delUser)
router.put('/users/:id', checkAuth, updateUser)

module.exports = router
