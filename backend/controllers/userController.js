import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateTokens.js";

// //Auth user and get token
// //route POST api/users/login
// //public
const authUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;
  //to make the email case insensitive,
  let user = await User.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// //Register user
// //route POST api/users/
// //public
const registerUser = asyncHandler(async (req, res) => {
const {name, email, password} =req.body
const userExists=  await User.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });
if (userExists){
    res.status(400)
    throw new Error('User already exists')
}
const user =await User.create({
name,
email,
password
})

if (user){
    generateToken(res, user._id)
    res.status(200).json({
       _id:user._id,
       name:user.name,
       email:user.email,
       isAdmin:user.isAdmin

    })
}else{
    res.status(400)
throw new Error('Invalid user data')
}

});

// //Logout user and clear cookie
// //route POST api/users/logout
// //private
const logoutUser = asyncHandler(async (req, res) => {
res.cookie('jwt', '', {
    httpOnly:true,
    expires: new Date(0)
});
res.status(200).json({message: 'Logged Out Successfully'})
});

// //Get user profile
// //route GET  api/users/profile
// //private
const getUserProfile = asyncHandler(async (req, res) => {
const user = await User.findById(req.user._id)

if (user){
    res.status(200).json({
        id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin
    })
} else{
    res.status(404)
    throw new Error ('User not found')
}
});

// //Get user profile
// //route GET  api/users/profile
// //private
const getUserById = asyncHandler(async (req, res) => {
  res.send("get user by id");
});
// //update user profile
// //route PUT  api/users/profile
// //private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password){
            user.password=req.body.password
        }
        const updatedUser= await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin
        })

    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
});

// //get all user profile
// //route Get  api/users/
// //private/admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("get users ");
});

// //delete user
// //route DELETE  api/users/:id
// //private/admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete user ");
});

// //delete user
// //route DELETE  api/users/:id
// //private/admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("updateUser ");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUserById,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
};
