import express from 'express'
const router =express.Router()


import {protect, admin} from '../middleware/authMiddleware.js'
import{
    //authUser,
    // registerUser,
    logoutUser,
    getUserProfile,
    getUserById,
    updateUserProfile,
    getUsers,
    deleteUser,
    updateUser,
} from '../controllers/userController.js'
//admin
// router.route('/').post(registerUser).get(getUsers);
// router.post('/', registerUser)
router.get('/', protect, admin, getUsers)
router.post('/logout', logoutUser)
//router.post('/auth', authUser)
router.route('/profile').get( getUserProfile).put(protect, updateUserProfile)
router.delete('/:id', protect, admin, deleteUser)
router.get('/:id',    getUserById)
router.put ('/:id', protect, admin,  updateUser)

export default router


