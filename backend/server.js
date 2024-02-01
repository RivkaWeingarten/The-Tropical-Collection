import path from 'path'
import express from 'express';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import clerkWebhooks from './routes/clerkWebhooks.js'; // Import the Clerk webhooks router

import uploadRoutes from './routes/uploadRoutes.js'
const port =process.env.PORT||5000;

connectDB();
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.get('/', (req, res) => {
res.send("server is on 5000")
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.use('/api/clerk', clerkWebhooks);

if (process.env.NODE_ENV==='production'){
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get ('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))

 } else{
        app.get('/', (req, res) => {
            res.send("server running")
            })
    
}

app.get('/api/config/paypal', (req, res) => res.send({clientId:
process.env.PAYPAL_CLIENT_ID}))

const __dirname =path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(errorHandler)
app.use(notFound)
app.listen(port, ()=> console.log(`Server ${port} is running!`))


//rewritten for FirebaseError.db
// import express from 'express';
// import { errorHandler, notFound } from './middleware/errorMiddleware.js';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import cors from 'cors'
// import bodyParser from 'body-parser';
// // Import Firebase setup
// import auth from './config/firebase.js';

// import router from './routes/productRoutes.js';
// import authRouter from './routes/authRoutes.js';
// const port = process.env.PORT || 5000;

// connectDB(); // This might need adjustments based on your Firebase setup

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Server is running on port 5000');
// });

// app.use('/api/products', router);
// app.use(`/api/auth`, authRouter)
// app.use(bodyParser.json());
// app.use(cors())
// app.use(errorHandler);
// app.use(notFound);

// app.listen(port, () => console.log(`Server is running on port ${port}`));
