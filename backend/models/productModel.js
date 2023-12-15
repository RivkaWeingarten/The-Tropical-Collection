// import { mongoose } from "mongoose";
// // require("dotenv").config();

// import dotenv from 'dotenv'
// dotenv.config()
// const reviewSchema =  mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//     },
//     comment: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timesstamps: true,
//   }
// );

// const productSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     image: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },

//     category: {
//       type: String,
//       default: "Dried Fruits",
//     },

//     price: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     reviews: [reviewSchema],
//     rating: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     numReviews: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     countInStock: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//   },
//   { timesstamps: true }
// );

// const Product= mongoose.model("Product", productSchema)
// export default  Product

import { db } from '../config/firebase';

const reviewSchema = {
  user: {
    type: 'reference',
    required: true,
    reference: db.collection('users'),
  },
  name: {
    type: 'string',
    required: true,
  },
  rating: {
    type: 'number',
    required: true,
  },
  comment: {
    type: 'string',
    required: true,
  },
};

const productSchema = {
  user: {
    type: 'reference',
    required: true,
    reference: db.collection('users'),
  },
  name: {
    type: 'string',
    required: true,
  },
  image: {
    type: 'string',
    required: true,
  },
  description: {
    type: 'string',
    required: true,
  },
  category: {
    type: 'string',
    default: 'Dried Fruits',
  },
  price: {
    type: 'number',
    required: true,
    default: 0,
  },
  reviews: {
    type: 'array',
    schema: reviewSchema,
  },
  rating: {
    type: 'number',
    required: true,
    default: 0,
  },
  numReviews: {
    type: 'number',
    required: true,
    default: 0,
  },
  countInStock: {
    type: 'number',
    required: true,
    default: 0,
  },
};

export default productSchema;
