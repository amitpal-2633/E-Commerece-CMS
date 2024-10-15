const Product = require("../models/productModel");
const Stock = require("../models/stockModel");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subCategoryModel");
const User = require("../models/userModel");

const addProduct = async (req, res) => {
  try {
    const {
      productName,
      model,
      description,
      category,
      subcategory,
      size,
      price,
      color,
      totalQuantity,
    } = req.body;

    const image = req.file ? `uploads/${req.file.filename}` : null; 
    const userId = req.user.id;

    const newProduct = await Product.create({
      productName,
      image, 
      model,
      description,
      categoryId  : category,
      subcategoryId : subcategory,
      addedBy: userId,
    });

    console.log("this is the new product", newProduct);
    let newStock;
    if (size) {
      newStock = await Stock.create({
        productId: newProduct.dataValues.id,
        size,
        price,
        color,
        totalQuantity,
      });
      console.log("this is the stockdata", newStock);
    }

    return res.status(201).json({
      message: "Product created successfully",
      product: { ...newProduct, ...newStock },
    });
  } catch (error) {
    console.error("Error adding product:", error); 
    return res.status(500).json({ message: "Error adding product", error });
  }
};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Stock,
          as: "stock",
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Subcategory,
          as: "subcategory",
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving products", error });
  }
};

// Get a Single Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Stock,
          as: "stock",
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Subcategory,
          as: "subcategory",
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error retrieving product", error });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      image,
      model,
      description,
      categoryId,
      subcategoryId,
      stock,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({
      productName,
      image,
      model,
      description,
      categoryId,
      subcategoryId,
    });

    // Update stock details if provided
    if (stock) {
      const existingStock = await Stock.findOne({ where: { productId: id } });
      if (existingStock) {
        await existingStock.update(stock);
      } else {
        await Stock.create({ ...stock, productId: id });
      }
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Stock.destroy({
      where: { productId: id },
    });
    await product.destroy();
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error deleting product", error });
  }
};

// Update Stock
const updateStock = async (req, res) => {
  try {
    const { Id } = req.params;
    if (!Id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const { size, price, color, totalQuantity } = req.body;

    const stock = await Stock.findOne({ where: { Id } });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    await stock.update({ size, price, color, totalQuantity });

    return res.status(200).json({
      message: "Stock updated successfully",
      stock,
    });
  } catch (error) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", error);
    
    return res.status(500).json({ message: "Error updating stock", error });
  }
};


// Delete Stock
const deleteStock = async (req, res) => {
  try {
    const { Id } = req.params;

    const stock = await Stock.findOne({ where: { Id } });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    await stock.destroy();

    return res.status(200).json({
      message: "Stock deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting stock", error });
  }
};

// Get Stock by Product ID
const getStockByProductId = async (req, res) => {
  try {
    // console.log("Request object:", req.body);
    const productId = req.params.productId; 
    // console.log(`Fetching stock for product ID: ${productId}`); 

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const stock = await Stock.findOne({ where: { productId } });
    if (!stock) {
      // console.log("Stock not found for productId:", productId);
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.status(200).json(stock);
  } catch (error) {
    console.error("Error retrieving stock:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving stock", error: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  deleteStock,
  getStockByProductId,
};
