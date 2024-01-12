import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
// //fetches all products
// //route GET api/products
// //public
const getProducts = asyncHandler(async (req, res) => {
  const products =  await Product.find({});
  res.json(products);
});
// //fetches a products
// //route GET api/product/id
// //public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// //Create a products
// //route POST api/product
// //private/admin

const createProduct = asyncHandler(async (req, res) => {
  console.log('hello')
const product = new Product({
  name:'Sample name',
  user:req.user._id,
  price:0,
  image:'images/sample.jpg',
  catagory:'dried fruits',
  countInStock:0,
  description:'Sample Description'

})

const createdProduct=await product.save()
res.status(201).json(createdProduct)
});


// //update a product
// //route PUT api/products/:id
// //private admin
const updateProduct = asyncHandler(async (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body)
  .then((product) => {
    res.json(product);
  })
  .catch((err) => {
    console.log("err", err);
    res.status(500).json({ error: "An error occurred" });
  });
});

// //delete a product
// //route DELETE api/products/:id
// //private admin
const deleteProduct = asyncHandler(async (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json(" deleted");
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).json({ error: "An error occurred" });
    });
});
export {createProduct, getProductById, getProducts, updateProduct, deleteProduct};

//firebase code and it worked for displaying single item and all items
// models/productModel.js
// import { db } from '../config/firebase.js';
// import { collection, query, where, getDocs, doc, addDoc, getDoc } from "firebase/firestore";

// const Product = collection(db, "Products");

// // Create a new product
// const createProduct = async (productData) => {
//   const docRef = await addDoc(Product, ({
//     ...productData,
//     // createdAt: serverTimestamp(),
//     // updatedAt: serverTimestamp()
   
//   }));
  
//   console.log(`Data is ${productData}`)
//   return docRef.id;
//   // return productData
// };

// // Get all products
// const getProducts = async () => {
//   const snapshot = await getDocs(Product);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// // Get product by ID
// const getProductById = async (productId) => {
//   const docRef = doc(db, 'Products', productId);
//   const docSnap = await getDoc(docRef);
//   // const doc = await docRef.get();

//   if (!docSnap.exists) {
//     throw new Error("Item not found");
//   }

//   return { id: docSnap.id, ...docSnap.data() };
// };

// const updateProduct = async (productId, updatedData) => {
//   await db.collection('Products').doc(productId).update({
//     ...updatedData,
//     modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
//   });
// };

// export { createProduct, getProducts, getProductById, updateProduct };
