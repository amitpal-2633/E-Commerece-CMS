const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./categoryModel");
const Subcategory = require("./subCategoryModel");
const User = require("./userModel");

const Product = sequelize.define("Product", {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: "id",
    },
  },
  subcategoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subcategory,
      key: "id",
    },
  },
  addedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

Product.associate = (models) => {
  Product.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });
  Product.belongsTo(models.Subcategory, {
    foreignKey: "subcategoryId",
    as: "subcategory",
  });
  Product.belongsTo(models.User, { foreignKey: "addedBy", as: "user" });

  Product.hasMany(models.Stock, {
    foreignKey: "productId",
    as: "stock",
  });
};

module.exports = Product;
