const { Router } = require("express");
const {loginAdmin, login, loginCompany} = require("../handlers/login.hendler")
const router = Router();

router.post("/login", login);
router.post("/admin", loginAdmin);
router.post("/log", loginCompany)



module.exports = router;