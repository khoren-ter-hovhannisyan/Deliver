const { Router } = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  delUser,
  updateUser,
  loginAdmin
} = require("../handlers/users.handlers");

const router = Router();

router.get("/users", getAllUsers);
router.get("/users", getUserById);
router.post("/sign-up-user", createUser);
router.post("/login-user", loginUser);
router.delete("/users", delUser);
router.put("update-user-info", updateUser);
router.post("/admin", loginAdmin)

module.exports = router;
