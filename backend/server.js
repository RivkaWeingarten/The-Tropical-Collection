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

// Import Firebase setup
import './config/firebase.js';

import productRoutes from './routes/productRoutes.js';

const port = process.env.PORT || 5000;

connectDB(); // This might need adjustments based on your Firebase setup

const app = express();

app.get('/', (req, res) => {
  res.send('Server is running on port 5000');
});

app.use('/api/products', productRoutes);
app.use(errorHandler);
app.use(notFound);

app.listen(port, () => console.log(`Server is running on port ${port}`));
