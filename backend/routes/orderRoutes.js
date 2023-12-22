
import express from 'express'
const router =express.Router()


import {protect, admin} from '../middleware/authMiddleware.js'

import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid
} from '../controllers/orderControllers.js'

router.post('/', protect, addOrderItems)
router.get('/',protect,admin,getOrders)
router.get('/mine',protect,getMyOrders)
router.get('/:id',protect, admin, getOrderById)
router.put('/:id/pay',protect, updateOrderToPaid)
router.put('/:id/deliver',protect, admin, updateOrderToDelivered)

export default router


