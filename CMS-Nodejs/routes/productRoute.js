const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
// const upload = multer({ dest: 'uploads/' }); 
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  deleteStock,
  getStockByProductId,
} = require("../controllers/productController");
const router = express.Router();


router.post("/add", verifyToken, upload.single('image'), addProduct);


router.get("/", verifyToken, getProducts);


router.get("/:id", verifyToken, getProductById);


router.put("/:id", verifyToken, updateProduct);


router.delete("/:id", verifyToken, deleteProduct);

router.get("/stock/:productId", verifyToken, getStockByProductId);
// router.get("/stock/:productId", (req, res, next) => {
//   console.log(`Received ${req.method} request for ${req.url}`);
//   next();
// }, verifyToken, getStockByProductId);

router.put("/stock/:Id", verifyToken, updateStock);


router.delete("/stock/:Id", verifyToken, deleteStock);



module.exports = router;
