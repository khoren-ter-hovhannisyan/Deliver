const { Router } = require("express");
const {login} = require('../handlers/login.handler')

const router = Router();
router.post('/login',login)

module.exports = router;
