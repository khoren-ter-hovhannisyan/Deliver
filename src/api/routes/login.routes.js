const { Router } = require("express");
<<<<<<< HEAD
const {loginAdmin, login, loginCompany} = require("../handlers/login.hendler")
const router = Router();

router.post("/login", login);
router.post("/admin", loginAdmin);
router.post("/log", loginCompany)



module.exports = router;
=======
const {login} = require('../handlers/login.handler')

const router = Router();
router.post('/login',login)

module.exports = router;
>>>>>>> dev
