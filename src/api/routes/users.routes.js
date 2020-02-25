const { Router } = require('express');
const { postUser, getAllUsers } = require('../handlers/users.handlers');

const router = Router();

router.get('/users', getAllUsers);
router.post('/sign-up-user', postUser);
module.exports = router;
