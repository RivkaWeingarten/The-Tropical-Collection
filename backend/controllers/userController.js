import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import generateToken from "../utils/generateTokens.js";



// //Auth user and get token
// //route POST api/users/login
// //public
// const authUser = asyncHandler(async (req, res) => {
//   console.log(req.body);

//   const email = req.body.email;
//   const password = req.body.password;
//   //to make the email case insensitive,
//   let user = await User.findOne({
//     email: new RegExp(`^${email}$`, "i"),
//   });

//   if (user && (await user.matchPassword(password))) {
//     generateToken(res, user._id);
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }
// });

//Auth user and get token
//route POST api/users/login
//public
const authUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const clerkId = req.body.user_id;

  let user = await User.findOne({
    clerkId: clerkId,
  });

  if (user) {
    generateToken(res, user._id);
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
// const oldRegisterUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;
//   const userExists = await User.findOne({
//     email: new RegExp(`^${email}$`, "i"),
//   });
//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }
//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   if (user) {
//     generateToken(res, user._id);
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

const registerUser = async (data) => {
  const { id, first_name, last_name, email_addresses } = data;
  console.log(`data from registerUser is ${first_name} ${last_name} ${email_addresses[0].email_address}`)
  
  try {
    const userExists = await User.findOne({
      clerkId: data.id,
    });

    if (userExists) {
      return { success: false, message: "User already exists" };
    }

    const user = await User.create({
      clerkId: id,
      firstName: first_name,
      lastName: last_name,
      email: email_addresses[0].email_address,
    });

    if (user) {
      generateToken(res, user._id);
      return {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      };
    } else {
      return { success: false, message: "Invalid user data" };
    }
  } catch (error) {
    console.error('Error creating or updating user:', error);
    // You might want to log the error or handle it differently
    return { success: false, message: 'Internal Server Error' };
  }
};


const createOrUpdateUser = asyncHandler(async (data, res) => {
const   {id, first_name, last_name, email_addresses} = data;
  try {
    const userExists = await User.findOne({
      clerkId: id,
    });

    if (userExists) {
      return { success: false, message: "User already exists" };
    }

    const user = await User.create({
      clerkId: id,
      firstName: first_name,
      lastName: last_name,
      email: email_addresses[0].email_address,
    });

    if (user) {
      generateToken(res, user._id);
      return {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      };
    } else {
      return { success: false, message: "Invalid user data" };
    }
  
  } catch (error) {
    console.error('Error creating or updating user:', error);
    // You might want to log the error or handle it differently
    return { success: false, message: 'Internal Server Error' };
  }
});

const createAndUpdateUser = asyncHandler(async (req, res) => {
  const { id, first_name, last_name, email_addresses } = req.body;

  try {
    let user = await User.findOne({ clerkId: id });

    if (!user) {
      // If the user does not exist in your database, create a new user
      user = await User.create({
        clerkId: id,
        firstName: first_name,
        lastName: last_name,
        email: email_addresses[0].email_address,
      });
    }

    // Generate and send token
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// //Logout user and clear cookie
// //route POST api/users/logout
// //private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged Out Successfully" });
});

// //Get user profile
// //route GET  api/users/profile
// //private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
lastName:user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// //Get user profile
// //route GET  api/users/profile
// //private
// const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password")
//   .populate("order");

//   if (user) {
//     return res.json(user);
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.id })

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming the orders are associated with the user through a field named userId
    const orders = await Order.find({ user: user._id });

    // Add the orders to the user object
    user.orders = orders;
    console.log(`user.orders from backend is ${user.orders}`)
    res.json(user);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

// //update user profile
// //route PUT  api/users/profile
// //private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// //get all user profile
// //route Get  api/users/
// //private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// //delete user
// //route DELETE  api/users/:id
// //private/admin
// const deleteUser = asyncHandler(async (req, res) => {
//   const user =  await User.findById(req.params.id);
//   if (user) {
//     if (user.isAdmin) {
//       res.status(400);
//       throw new Error("Cannot Delete Admin User");
//     }
//     await User.deleteOne({ _id: user._id });
//     res.status(200).json({ message: "User Deleted Successfully" });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

//using clerk

const deleteUser = asyncHandler(async (id) => {
   const user =  await User.find({clerkId:id});
    if (user) {
     if (user.isAdmin) {
      res.status(400);
  throw new Error("Cannot Delete Admin User");
     }
     await User.deleteOne({ clerkId:id});
      res.status(200).json({ message: "User Deleted Successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });

// //update user
// //route PUT  api/users/:id
// //private/admin



const updateUser = asyncHandler(async (req, res) => {

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields
    user.name = req.body.name;
    user.email = req.body.email;

    // Hash the password if it's present in the request
    // if (req.body.password) {
    //   // const saltRounds = 10;
    //   // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    //   user.password = req.body.password;
    // }

    // Save the updated user
    const updatedUser = await user.save();
    
    res.json(updatedUser);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: "An error occurred" });
  }
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
  createOrUpdateUser
};
