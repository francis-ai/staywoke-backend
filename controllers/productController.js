import Product from "../models/ProductModel.js";
import fs from "fs";

export const addProduct = async (req, res) => {
  try {
    console.log("=== Incoming Body ===", req.body);
    console.log("=== Incoming Files ===", req.files);

    const { name, shortDesc, longDesc, sizes, price } = req.body;

    const image = req.files.image ? `uploads/products/${req.files.image[0].filename}` : null;

    let gallery = [];
    if (req.files.gallery) {
      gallery = req.files.gallery.slice(0, 3).map(file => `uploads/products/${file.filename}`);
    }

    const sizesArray = sizes ? (Array.isArray(sizes) ? sizes : sizes.split(",")) : [];

    const product = new Product({
      name,
      shortDesc,
      longDesc,
      sizes: sizesArray,
      price,
      image,
      gallery,
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: "Product added", product: savedProduct });

  } catch (error) {
    console.error("=== Error Saving Product ===", error);
    res.status(500).json({ message: error.message });
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

    console.log("=== Incoming Body ===", req.body);
    console.log("=== Incoming Files ===", req.files);

    // Update main image if new file uploaded
    if (req.files.image && req.files.image[0]) {
      if (product.image && fs.existsSync(`.${product.image}`)) fs.unlinkSync(`.${product.image}`);
      product.image = `uploads/products/${req.files.image[0].filename}`;
    }

    // Update gallery images if new files uploaded
    if (req.files.gallery && req.files.gallery.length > 0) {
      // Delete old gallery files
      if (product.gallery && product.gallery.length > 0) {
        product.gallery.forEach((imgPath) => {
          if (fs.existsSync(`.${imgPath}`)) fs.unlinkSync(`.${imgPath}`);
        });
      }
      // Assign new gallery files (up to 3)
      product.gallery = req.files.gallery.slice(0, 3).map(file => `uploads/products/${file.filename}`);
    }

    // Update other fields
    product.name = name || product.name;
    product.shortDesc = shortDesc || product.shortDesc;
    product.longDesc = longDesc || product.longDesc;
    product.sizes = sizes ? (Array.isArray(sizes) ? sizes : sizes.split(",")) : product.sizes;
    product.price = price || product.price;

    await product.save();

    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("=== Error Updating Product ===", err);
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
