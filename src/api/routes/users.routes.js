const { Router } = require('express');
const { createUser, getAllUsers,loginUser } = require('../handlers/users.handlers');

const router = Router();

router.get('/users', getAllUsers);
router.post('/sign-up-user', createUser);
router.post('/login-user', loginUser);
module.exports = router;
