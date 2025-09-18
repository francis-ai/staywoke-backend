// models/ProductModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDesc: { type: String, required: true },
  longDesc: { type: String },
  sizes: [{ type: String }],
  price: { type: Number, required: true },
  image: { type: String }, 
  gallery: [{ type: String }], // new gallery field
}, { timestamps: true });

export default mongoose.model("Product", productSchema, 'tbl_products');
