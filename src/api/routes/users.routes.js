const {
  Router
} = require('express')
const {
  createUser,
  getAllUsers,
  getUserById,
  delUser,
  updateUser,
} = require('../handlers/users.handlers')
const checkAuth = require('../middleware/check-auth')

const router = Router()

router.get('/users', checkAuth, getAllUsers)
router.get('/users', checkAuth, getUserById)
router.post('/sign-up-user', createUser)
router.delete('/users/:id', checkAuth, delUser)
router.put('/users/:id', checkAuth, updateUser)

module.exports = router