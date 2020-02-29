const { Router } = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  delUser,
  updateUser
} = require("../handlers/users.handlers");
const {login} = require('../handlers/login.handler')

const router = Router();

router.get("/users", getAllUsers);
router.get("/users", getUserById);
router.post("/sign-up-user", createUser);
router.delete("/users", delUser);
router.put("update-user-info", updateUser);
<<<<<<< HEAD
=======
router.post("/admin", loginAdmin)
router.post('/login',login)
>>>>>>> dev

module.exports = router;
