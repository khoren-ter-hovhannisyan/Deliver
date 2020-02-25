const { Router } = require('express');
const { getUsers } = require('../handlers/users.handlers');

const router = Router();

router.get('/users', getUsers);
router.post('/sign-up-user', postUser);
module.exports = router;
