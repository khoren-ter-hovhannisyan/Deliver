const { Router } = require('express');
const { createUser, getAllUsers } = require('../handlers/users.handlers');

const router = Router();

router.get('/users', getAllUsers);
router.post('/sign-up-user', createUser);
module.exports = router;
