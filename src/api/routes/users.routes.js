const { Router } = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  delUser,
  updateUser
} = require("../handlers/users.handlers");

const router = Router();

router.get("/users", getAllUsers);
router.get("/users", getUserById);
router.post("/sign-up-user", createUser);
router.delete("/users", delUser);
router.put("update-user-info", updateUser);

module.exports = router;
