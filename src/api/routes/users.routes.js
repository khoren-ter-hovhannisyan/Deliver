const { Router } = require('express');
const { getUser } = require('../handlers/users.handlers');

const router = Router();

router.get('/users', getUser);

module.exports = router;
