
import express from 'express'
const router =express.Router()


import {protect, admin} from '../middleware/authMiddleware.js'

import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderPaymentMethod,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrdersByUserId
} from '../controllers/orderControllers.js'

router.post('/', protect, addOrderItems)
router.get('/',protect,admin,getOrders)
router.get('/mine',protect,getMyOrders)
router.get('/:id',protect,  getOrderById)
router.put('/:id/pay',protect, updateOrderToPaid)
router.put('/:id/method',protect, updateOrderPaymentMethod)
router.put('/:id/deliver',protect, admin, updateOrderToDelivered)
router.get('/:id/orders',protect, admin, getOrdersByUserId)
export default router


