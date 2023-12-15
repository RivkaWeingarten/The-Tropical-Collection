import asyncHandler from "../middleware/asyncHandler.js";
// import Product from "../models/productModel.js";
// //fetches all products
// //route GET api/products
// //public
// const getProducts = asyncHandler(async (req, res) => {
//   const products =  await Product.find({});
//   res.json(products);
// });
// //fetches a products
// //route GET api/product/id
// //public

// const getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     return res.json(product);
//   } else {
//     res.status(404);
//     throw new Error("Item not found");
//   }
// });

// export { getProductById, getProducts };

//firebase code
// models/productModel.js
import { db } from '../config/firebase.js';
import { collection, query, where, getDocs, doc, addDoc, getDoc } from "firebase/firestore";

const Product = collection(db, "Products");

// Create a new product
const createProduct = async (productData) => {
  const docRef = await addDoc(Product, ({
    ...productData,
    // createdAt: serverTimestamp(),
    // updatedAt: serverTimestamp()
   
  }));
  
  console.log(`Data is ${productData}`)
  return docRef.id;
  // return productData
};

// Get all products
const getProducts = async () => {
  const snapshot = await getDocs(Product);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get product by ID
const getProductById = async (productId) => {
  const docRef = doc(db, 'Products', productId);
  const docSnap = await getDoc(docRef);
  // const doc = await docRef.get();

  if (!docSnap.exists) {
    throw new Error("Item not found");
  }

  return { id: docSnap.id, ...docSnap.data() };
};

const updateProduct = async (productId, updatedData) => {
  await db.collection('Products').doc(productId).update({
    ...updatedData,
    modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export { createProduct, getProducts, getProductById, updateProduct };
