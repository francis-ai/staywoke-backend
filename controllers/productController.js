// controllers/productController.js
import Product from "../models/ProductModel.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    console.log("=== Incoming Body ===", req.body);
    console.log("=== Incoming Files ===", req.files);

    const { name, shortDesc, longDesc, sizes, price } = req.body;

    // Main image
    let image = null;
    if (req.files.image && req.files.image[0]) {
      image = {
        url: req.files.image[0].path,        // Cloudinary secure URL
        public_id: req.files.image[0].filename // Cloudinary public_id
      };
    }

    // Gallery images
    let gallery = [];
    if (req.files.gallery) {
      gallery = req.files.gallery.slice(0, 3).map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    // Sizes as array
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
    res.status(201).json({ message: "✅ Product added", product: savedProduct });

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
    if (!product) return res.status(404).json({ message: "❌ Product not found" });

    console.log("=== Incoming Body ===", req.body);
    console.log("=== Incoming Files ===", req.files);

    // Update main image
    if (req.files.image && req.files.image[0]) {
      // Optionally: delete old image from Cloudinary
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      product.image = {
        url: req.files.image[0].path,
        public_id: req.files.image[0].filename
      };
    }

    // Update gallery
    if (req.files.gallery && req.files.gallery.length > 0) {
      // Optionally: delete old gallery images from Cloudinary
      if (product.gallery && product.gallery.length > 0) {
        for (let img of product.gallery) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }
      product.gallery = req.files.gallery.slice(0, 3).map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    // Update other fields
    product.name = name || product.name;
    product.shortDesc = shortDesc || product.shortDesc;
    product.longDesc = longDesc || product.longDesc;
    product.sizes = sizes ? (Array.isArray(sizes) ? sizes : sizes.split(",")) : product.sizes;
    product.price = price || product.price;

    await product.save();

    res.json({ message: "✅ Product updated", product });
  } catch (err) {
    console.error("=== Error Updating Product ===", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "❌ Product not found" });

    // Delete main image
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // Delete gallery images
    if (product.gallery && product.gallery.length > 0) {
      for (let img of product.gallery) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await product.deleteOne();

    res.json({ message: "✅ Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
