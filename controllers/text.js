import Product from "../models/ProductModel.js";
import fs from "fs";

export const addProduct = async (req, res) => {
  try {
    const { name, shortDesc, longDesc, sizes, price } = req.body;
    const image = req.file ? req.file.path : null;

    const sizesArray = sizes ? (Array.isArray(sizes) ? sizes : sizes.split(",")) : [];

    const product = new Product({ name, shortDesc, longDesc, sizes: sizesArray, price, image });
    await product.save();

    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortDesc, longDesc, sizes, price } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      if (product.image && fs.existsSync(product.image)) fs.unlinkSync(product.image);
      product.image = req.file.path;
    }

    product.name = name || product.name;
    product.shortDesc = shortDesc || product.shortDesc;
    product.longDesc = longDesc || product.longDesc;
    product.sizes = sizes ? (Array.isArray(sizes) ? sizes : sizes.split(",")) : product.sizes;
    product.price = price || product.price;

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image && fs.existsSync(product.image)) fs.unlinkSync(product.image);
    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
