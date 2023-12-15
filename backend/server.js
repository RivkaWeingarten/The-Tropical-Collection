// import express from 'express';
// import { errorHandler, notFound } from './middleware/errorMiddleware.js';
// import dotenv from 'dotenv'
// dotenv.config()
// import connectDB from './config/db.js';

// import productRoutes from './routes/productRoutes.js'
// const port =process.env.PORT||5000;

// connectDB();
// const app = express();

// app.get('/', (req, res) => {
// res.send("server is on 5000")
// })

// app.use('/api/products', productRoutes)
// app.use(errorHandler)
// app.use(notFound)
// app.listen(port, ()=> console.log(`Server ${port} is running!`))
//rewritten for FirebaseError.db
import express from 'express';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors'
import bodyParser from 'body-parser';
// Import Firebase setup
import auth from './config/firebase.js';

import router from './routes/productRoutes.js';
import authRouter from './routes/authRoutes.js';
const port = process.env.PORT || 5000;

connectDB(); // This might need adjustments based on your Firebase setup

const app = express();

app.get('/', (req, res) => {
  res.send('Server is running on port 5000');
});

app.use('/api/products', router);
app.use(`/api/auth`, authRouter)
app.use(bodyParser.json());
app.use(cors())
app.use(errorHandler);
app.use(notFound);

app.listen(port, () => console.log(`Server is running on port ${port}`));
