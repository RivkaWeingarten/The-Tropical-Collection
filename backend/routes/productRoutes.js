import  express from 'express'
const router =express.Router()
import { getProductById,  getProducts} from '../controllers/productControllers.js'


router.route('/').get(getProducts);
router.route('/:id').get(getProductById)

// router.post('/', async (req, res) => {
//     try {
//       const productId = await createProduct(req.body);
//       res.status(201).json({ id: productId, message: 'Product created successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
//   // Get all products
//   router.get('/', async (req, res) => {
//     try {
//       const products = await getProducts();
//       res.json(products);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
//   // Get product by ID
//   router.get('/:id', async (req, res) => {
//     try {
//       const product = await getProductById(req.params._id);
//       res.json(product);
//     } catch (error) {
//       res.status(404).json({ error: error.message });
//     }
//   });

//   router.put('/', async (req, res) => {
//     try {
//       const productId = await updateProduct(req.body);
//       res.status(201).json({ id: productId, message: 'Product updated successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
  
  export default router;