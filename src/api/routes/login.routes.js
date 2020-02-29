const { Router } = require("express");
const {login, loginAdmin} = require('../handlers/login.handlers')

const router = Router();

router.post('/login',login)
router.post("/admin", loginAdmin)

module.exports = router;
