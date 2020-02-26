const { Router } = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  delUser,
  updateUser
} = require("../handlers/users.handlers");

const router = Router();

router.get("/users", getAllUsers);
router.get("/users", getUserById);
router.post("/sign-up-user", createUser);
router.post("/login-user", loginUser);
router.delete("/del-user/:id", delUser);
router.put("update-user-ifo", updateUser);

module.exports = router;
