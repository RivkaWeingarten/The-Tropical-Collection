import mongoose from 'mongoose'

const connectDB= async() => {
    try {
        const data = await mongoose.connect(process.env.MONGO_URI);
        console.log (`Mongo DB Connected: ${data.connection.host}`)
    } catch (error){
console.log(`Error: ${error.message}`)
process.exit(1)
    }
}

export default connectDB

//firebase code and it worked
// import dotenv from 'dotenv';
// dotenv.config();

// const connectDB = async () => {
//   try {
//     console.log('Firebase initialized and Firestore connected');
//     // Additional setup logic goes here if needed
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;