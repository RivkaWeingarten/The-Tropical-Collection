import  express from 'express'
const router =express.Router()
import { getProductById,  getProducts } from '../controllers/productControllers.js'


router.route('/').get(getProducts);
router.route('/:id').get(getProductById)

//code before we changed it. because we found better way on web,
// // show all products
// router.get("/", async (req, res) => {
//     const products = await Product.find({})
//     //   .sort({ name: 1 })
//     //   .populate("donations")
//     //   .then((products) => {
//         res.json(products);
//       })
//       .patch((err) => {
//         console.log(err);
//         res.status(500).json({ error: "An error occurred" });
//       });
 



//display a single product

// router.get("/:id", async (req, res) => {
//     const product =await Product.findById(req.params.id)
//     //   .populate("donations")
//     //   .then((family) => {
//     //     console.log(family.donations);
//         res.json(product);
//       })
//       .patch((err) => {
//         console.log("err", err);
//         res.status(500).json({ error: "An error occurred" });
//       });

export default router