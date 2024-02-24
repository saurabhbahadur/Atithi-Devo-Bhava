// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/blogController");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn ,  userController.userBlogs);
router.post("/", isLoggedIn , userController.postInBlogs);
router.delete("/:id/delete", isLoggedIn,   userController.deleteBlog);


module.exports = router;