const express = require("express");
const {
  login,
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", login);

router.post("/user",  createUser);


router.get("/user/getUser", verifyToken, getAllUser);


router.put("/user/updateUser/:id", verifyToken, updateUser);

router.delete("/user/deleteUser/:id", verifyToken, deleteUser);

module.exports = router;
