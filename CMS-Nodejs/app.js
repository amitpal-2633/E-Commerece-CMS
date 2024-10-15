const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const { registerAdmin } = require("./controllers/authController");
const Category = require("./models/categoryModel");
const Subcategory = require("./models/subCategoryModel");
const Product = require("./models/productModel");
const Stock = require("./models/stockModel");
const User = require("./models/userModel");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// const upload = multer({ dest: 'uploads/' }); 
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200', 
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.resolve('uploads')));

const upload = multer({
  dest: path.join(__dirname, 'uploads/'),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only .jpg, .png and .gif formats are allowed!'), false);
    }
    cb(null, true);
  }
});
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); 

// Set up associations
Category.associate({ Subcategory });
Subcategory.associate({ Category });
Product.associate({ Category, Subcategory, User, Stock });
Stock.associate({ Product });
User.associate = () => {};

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.log("Error connecting to the database: ", err);
  });

sequelize.sync().then(registerAdmin);

// Routes
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
