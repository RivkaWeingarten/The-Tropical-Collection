import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
//fetches all products
//route GET api/products
//public
const getProducts = asyncHandler(async (req, res) => {
  const products =  await Product.find({});
  res.json(products);
});
//fetches a products
//route GET api/product/id
//public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

export { getProductById, getProducts };
